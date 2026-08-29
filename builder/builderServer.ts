/**
 * builderServer.ts
 *
 * The "AI Studio-style" app builder backend for Persona.
 *
 * It serves three things:
 *  1. The `/builder` page itself (rewritten to `/builder.html`, which Vite
 *     transforms in dev and which lives in `dist/` after a production build).
 *  2. A small session store (`.builder/sessions/*.json`) so conversations
 *     persist across page reloads — the "history" sidebar.
 *  3. An agentic chat endpoint (`POST /api/builder/chat`, SSE) that talks to
 *     the DeepSeek API with tool calling. The agent can read, write, and edit
 *     files in this repository and run shell commands, so it can genuinely
 *     modify the app while the user watches the live preview.
 *
 * Beyond the chat loop it also serves:
 *   - Git version history + rollback (`/api/builder/git/history`,
 *     `/api/builder/git/rollback`) and a pending-changes status
 *     (`/api/builder/git/status`) for the "time machine" + "unpushed changes"
 *     features in the UI.
 *   - A stop/rollback hook for a running turn (`POST /api/builder/chat/stop`):
 *     aborts the in-flight agent loop, restores every file the turn touched,
 *     and truncates the conversation back to before the turn.
 *   - Token-usage recording: every turn's provider-reported usage is appended
 *     to the DSH cost widget's synced usage file
 *     (`~/.dsh/profiles/web/dsh-cost-widget/builder-usage.json`) so builder
 *     chat spend shows up in the DSH "Spend" widget alongside DSH sessions.
 *
 * API key resolution order (first hit wins):
 *   1. process.env.DEEPSEEK_API_KEY
 *   2. `.env.local` in the repo root (DEEPSEEK_API_KEY=...)
 *   3. the DSH harness credentials file (~/.dsh/.credentials.yaml)
 */
import path from "path";
import { promises as fs } from "fs";
import { readFileSync } from "fs";
import { exec, execFile } from "child_process";
import { randomUUID } from "crypto";
import { homedir } from "os";

export const REPO_ROOT = path.resolve(process.cwd());
const SESSIONS_DIR = path.join(REPO_ROOT, ".builder", "sessions");

// A generous step budget: the agent legitimately reads many files per turn,
// and the old cap of 40 made real tasks die with
// "Agent exceeded 40 tool steps; stopping." (overridable via env).
const MAX_TOOL_STEPS = Number(process.env.DEEPSEEK_MAX_TOOL_STEPS) || 120;
const MAX_LLM_MS = 300_000;
const MAX_OUTPUT_CHARS = 30000;
const MAX_READ_CHARS = 200_000;
const MAX_SEARCH_MATCHES = 100;
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", ".builder", "public/assets"]);

// Version-history markers (which commits the user rolled back to) live next
// to the session store; git log itself stays the source of truth for the list.
const VERSIONS_FILE = path.join(REPO_ROOT, ".builder", "versions.json");

// Which builder this server is — used to tag spend records for the DSH widget.
const BUILDER_SOURCE = "persona-builder";

// The DSH cost widget's synced usage file (inside the Syncthing dsh-home
// folder). Both builders append here; the widget's host half serves it back.
const BUILDER_USAGE_FILE = path.join(
  homedir(),
  ".dsh",
  "profiles",
  "web",
  "dsh-cost-widget",
  "builder-usage.json"
);
const MAX_RECORDED_USAGE = 1000;

/* ── configuration ─────────────────────────────────────────────────────────── */

function apiKey(): string {
  const fromEnv = process.env.DEEPSEEK_API_KEY;
  if (fromEnv && fromEnv.trim()) return fromEnv.trim();

  // Fallback 1: .env.local in the repo root
  try {
    const envLocal = readFileSync(path.join(REPO_ROOT, ".env.local"), "utf8");
    const m = envLocal.match(/^\s*DEEPSEEK_API_KEY\s*=\s*(.+?)\s*$/m);
    if (m && m[1]) return m[1].replace(/^["']|["']$/g, "");
  } catch {
    /* no .env.local */
  }

  // Fallback 2: DSH harness credentials (~/.dsh/.credentials.yaml)
  try {
    const creds = readFileSync(path.join(homedir(), ".dsh", ".credentials.yaml"), "utf8");
    const m = creds.match(/^\s*DEEPSEEK_API_KEY\s*:\s*(.+?)\s*$/m);
    if (m && m[1]) return m[1].replace(/^["']|["']$/g, "");
  } catch {
    /* no harness credentials */
  }

  return "";
}

export const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";
const API_URL = process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/chat/completions";
const API_KEY = apiKey();
const API_CONFIGURED = Boolean(API_KEY);

/* ── types ─────────────────────────────────────────────────────────────────── */

type ToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

type ApiMessage =
  | { role: "system" | "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: ToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };

type TranscriptItem = {
  kind: "user" | "tool" | "text";
  text: string;
  ok?: boolean;
  at: string;
};

type Session = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  apiMessages: ApiMessage[];
  transcript: TranscriptItem[];
};

type ChatEvent =
  | { type: "tool"; label: string; ok: boolean }
  | { type: "text"; text: string }
  | { type: "error"; message: string }
  | { type: "stopped"; message: string; files: number }
  | { type: "done" };

type UsageBuckets = {
  uncachedInputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
};

/** One turn's token spend, written for the DSH cost widget. */
type UsageRecord = {
  id: string;
  source: string;
  title: string;
  at: string;
  cwd: string;
  model: string;
  aborted?: boolean;
  tokenUsage: UsageBuckets;
};

/** A commit listed in the version-history panel. */
type VersionInfo = {
  sha: string;
  short: string;
  message: string;
  authorDate: string;
  current?: boolean;
  rolledBack?: boolean;
};

/** State of one in-flight agent turn (for stop + rollback). */
type ActiveTurn = {
  controller: AbortController;
  signal: AbortSignal;
  session: Session;
  startApiLen: number;
  startTranscriptLen: number;
  /** abs path -> original content (null = the file did not exist before this turn). */
  snapshots: Map<string, string | null>;
  /** Record a file's pre-turn content (once per path) for later rollback. */
  snapshot: (abs: string) => Promise<void>;
  usage: UsageBuckets;
  llmCalls: number;
};

/** Registry of running turns keyed by session id — supports stop/rollback. */
const activeTurns = new Map<string, ActiveTurn>();

/* ── system prompt ─────────────────────────────────────────────────────────── */

function systemPrompt(): string {
  return `You are the AI builder agent for "Persona" — a D&D 5e character sheet & homebrew builder web app.

You work inside the repository at ${REPO_ROOT}. The user chats with you in an AI Studio-style builder: they describe what they want changed in the app, you edit the code, and the live preview reloads so they can verify.

Rules:
- All file paths are relative to the repo root (${REPO_ROOT}). Never touch files outside it.
- Read files before editing them. Prefer small, targeted edits over rewrites.
- To save tool steps, read several files in ONE read_file call by passing a "paths" array (or a comma-separated "path" string).
- Tech stack: React 18 + TypeScript + Vite 5 + Express 5 (server.ts) + Supabase (services/supabase.ts) + Tailwind via CDN (index.html). Main app entry: App.tsx. Read AGENTS.md for project conventions.
- Keep the D&D 5e dark aesthetic: near-black backgrounds (#1a1b1e / #25262b), gold accent rgb(201 173 106), red accent rgb(138 11 11), light text #c1c2c5.
- After significant edits, run \`npm run lint\` (TypeScript check) and fix any type errors you introduced.
- If you need to understand structure or data, read the relevant files first (components/, services/, data/, types.ts, utils/).
- When running commands, prefer \`npm run ...\` scripts. Do not start or restart servers.
- Reply in concise markdown: what you changed, why, and anything the user should verify in the preview.`;
}

/* ── tool schemas ──────────────────────────────────────────────────────────── */

const TOOLS = [
  {
    type: "function",
    function: {
      name: "read_file",
      description:
        "Read one or more UTF-8 text files from the repo (returns content with line numbers). Pass several paths at once to save tool steps.",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "Repo-relative file path; may be comma-separated to read several at once" },
          paths: { type: "array", items: { type: "string" }, description: "Repo-relative file paths to read in one step" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "write_file",
      description: "Create a new file or fully replace an existing one in the repo.",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "Repo-relative file path" },
          content: { type: "string", description: "Full new file content" },
        },
        required: ["path", "content"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "edit_file",
      description:
        "Replace one occurrence of old_string with new_string inside a file. Fails if old_string is not found exactly once.",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "Repo-relative file path" },
          old_string: { type: "string", description: "Exact existing text to replace" },
          new_string: { type: "string", description: "Replacement text" },
        },
        required: ["path", "old_string", "new_string"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_files",
      description: "List files and directories directly under a repo path (one level).",
      parameters: {
        type: "object",
        properties: { path: { type: "string", description: "Repo-relative directory path; defaults to repo root" } },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_files",
      description:
        "Search file contents under a repo path for a regular expression. Returns matching lines with line numbers (max 100 matches).",
      parameters: {
        type: "object",
        properties: {
          pattern: { type: "string", description: "Regular expression to search for" },
          path: { type: "string", description: "Repo-relative directory to search; defaults to repo root" },
        },
        required: ["pattern"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "run_command",
      description:
        "Run a shell command in the repo root (for example: npm run lint, npm run build, git status). 120s timeout.",
      parameters: {
        type: "object",
        properties: { command: { type: "string", description: "Shell command to run" } },
        required: ["command"],
      },
    },
  },
] as const;

/* ── tool execution ────────────────────────────────────────────────────────── */

function safeResolve(p: string): string {
  const abs = path.resolve(REPO_ROOT, String(p ?? "").replace(/^~/, ""));
  if (abs !== REPO_ROOT && !abs.startsWith(REPO_ROOT + path.sep)) {
    throw new Error(`Path escapes the repo root: ${p}`);
  }
  return abs;
}

function truncate(s: string, n = MAX_OUTPUT_CHARS): string {
  if (s.length <= n) return s;
  return `${s.slice(0, n)}\n… [output truncated at ${n} chars]`;
}

async function readFileTool(p: string): Promise<string> {
  const abs = safeResolve(p);
  const stat = await fs.stat(abs);
  if (stat.isDirectory()) throw new Error(`${p} is a directory; use list_files instead`);
  if (stat.size > MAX_READ_CHARS) {
    return `[file too large (${stat.size} bytes) to return fully]`;
  }
  const text = await fs.readFile(abs, "utf8");
  const lines = text.split("\n");
  return lines.map((l, i) => `${i + 1}\t${l}`).join("\n");
}

/** Read several files in one tool step; per-file errors are inline, not fatal. */
async function readFilesTool(paths: string[]): Promise<string> {
  const parts: string[] = [];
  for (const p of paths) {
    try {
      parts.push(`--- ${p} ---\n${await readFileTool(p)}`);
    } catch (e: any) {
      parts.push(`--- ${p} ---\n[error] ${e?.message ?? String(e)}`);
    }
    if (parts.join("\n").length > MAX_OUTPUT_CHARS) break;
  }
  return truncate(parts.join("\n\n"));
}

/** Collect the file paths from a read_file call (paths array or comma-separated path). */
function readPathsOf(args: any): string[] {
  const list = Array.isArray(args.paths) && args.paths.length
    ? args.paths.map(String)
    : String(args.path ?? "").split(",").map((s: string) => s.trim()).filter(Boolean);
  return list;
}

async function writeFileTool(p: string, content: string, snapshot?: (abs: string) => Promise<void>): Promise<string> {
  const abs = safeResolve(p);
  if (snapshot) await snapshot(abs);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, content, "utf8");
  return `Wrote ${Buffer.byteLength(content, "utf8")} bytes to ${p}`;
}

async function editFileTool(p: string, oldString: string, newString: string, snapshot?: (abs: string) => Promise<void>): Promise<string> {
  const abs = safeResolve(p);
  if (snapshot) await snapshot(abs);
  const text = await fs.readFile(abs, "utf8");
  const count = text.split(oldString).length - 1;
  if (count === 0) return `Error: old_string was not found in ${p}. No changes made.`;
  if (count > 1) return `Error: old_string was found ${count} times in ${p}. Make old_string unique. No changes made.`;
  const updated = text.replace(oldString, newString);
  await fs.writeFile(abs, updated, "utf8");
  const preview = newString.split("\n").slice(0, 6).join("\n");
  return `Replaced 1 occurrence in ${p}.\nNew text starts with:\n${preview}`;
}

async function listFilesTool(p: string): Promise<string> {
  const abs = safeResolve(p || ".");
  const entries = await fs.readdir(abs, { withFileTypes: true });
  const lines = entries
    .filter((e) => !SKIP_DIRS.has(e.name))
    .map((e) => (e.isDirectory() ? `${e.name}/` : e.name))
    .sort();
  if (lines.length === 0) return "(empty directory)";
  return lines.join("\n");
}

async function walk(dir: string, depth: number, onFile: (file: string) => Promise<void>): Promise<void> {
  if (depth > 7) return;
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      await walk(path.join(dir, e.name), depth + 1, onFile);
    } else if (e.isFile()) {
      await onFile(path.join(dir, e.name));
    }
  }
}

async function searchFilesTool(pattern: string, p: string): Promise<string> {
  const abs = safeResolve(p || ".");
  let re: RegExp;
  try {
    re = new RegExp(pattern, "i");
  } catch (e: any) {
    throw new Error(`Invalid regular expression: ${e.message}`);
  }
  const matches: string[] = [];
  await walk(abs, 0, async (file) => {
    if (matches.length >= MAX_SEARCH_MATCHES) return;
    try {
      const stat = await fs.stat(file);
      if (stat.size > 500_000) return;
      const text = await fs.readFile(file, "utf8");
      const rel = path.relative(REPO_ROOT, file);
      for (const line of text.split("\n")) {
        if (matches.length >= MAX_SEARCH_MATCHES) return;
        if (re.test(line)) {
          matches.push(`${rel}:${line.slice(0, 300)}`);
        }
      }
    } catch {
      /* skip unreadable files */
    }
  });
  if (matches.length === 0) return "No matches found.";
  return matches.join("\n");
}

function runCommandTool(command: string): Promise<string> {
  return new Promise((resolve) => {
    exec(command, { cwd: REPO_ROOT, timeout: 120_000, maxBuffer: 10 * 1024 * 1024, shell: "/bin/bash" }, (err, stdout, stderr) => {
      const out = truncate(`${stdout || ""}${stderr ? `\n${stderr}` : ""}`.trim());
      if (err) {
        resolve(`Command exited with ${err.code ?? "error"}: ${err.message}\n${out || "(no output)"}`);
      } else {
        resolve(out || "(no output)");
      }
    });
  });
}

/** Extra per-turn context threaded into tool execution (snapshot for rollback). */
type ToolContext = { snapshot?: (abs: string) => Promise<void> };

async function executeTool(name: string, argsJson: string, ctx: ToolContext = {}): Promise<string> {
  let args: any = {};
  try {
    args = JSON.parse(argsJson || "{}");
  } catch {
    throw new Error(`Could not parse tool arguments: ${argsJson}`);
  }
  switch (name) {
    case "read_file": {
      const paths = readPathsOf(args);
      if (paths.length === 0) return "Error: no path given";
      return paths.length === 1 ? readFileTool(paths[0]) : readFilesTool(paths);
    }
    case "write_file":
      return writeFileTool(args.path, String(args.content ?? ""), ctx.snapshot);
    case "edit_file":
      return editFileTool(args.path, String(args.old_string ?? ""), String(args.new_string ?? ""), ctx.snapshot);
    case "list_files":
      return listFilesTool(args.path);
    case "search_files":
      return searchFilesTool(args.pattern, args.path);
    case "run_command":
      return runCommandTool(String(args.command ?? ""));
    default:
      return `Unknown tool: ${name}`;
  }
}

function toolLabel(name: string, argsJson: string): string {
  let args: any = {};
  try {
    args = JSON.parse(argsJson || "{}");
  } catch {
    /* ignore */
  }
  switch (name) {
    case "read_file": {
      const paths = readPathsOf(args);
      return `read ${paths.length > 3 ? paths.slice(0, 3).join(", ") + ` (+${paths.length - 3})` : paths.join(", ")}`;
    }
    case "write_file":
      return `write ${args.path}`;
    case "edit_file":
      return `edit ${args.path}`;
    case "list_files":
      return `list ${args.path ?? "."}`;
    case "search_files":
      return `search ${args.pattern ?? ""} in ${args.path ?? "."}`;
    case "run_command":
      return `run ${args.command}`;
    default:
      return name;
  }
}

/* ── DeepSeek API ──────────────────────────────────────────────────────────── */

async function callDeepSeek(messages: ApiMessage[], signal?: AbortSignal): Promise<any> {
  const abort = signal ? AbortSignal.any([AbortSignal.timeout(MAX_LLM_MS), signal]) : AbortSignal.timeout(MAX_LLM_MS);
  const resp = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      tools: TOOLS as any,
      tool_choice: "auto",
      temperature: 0.2,
      max_tokens: 4096,
      stream: false,
    }),
    signal: abort,
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`DeepSeek API ${resp.status}: ${text.slice(0, 300)}`);
  }
  return resp.json();
}

/* ── spend recording (DSH cost widget) ─────────────────────────────────────── */

/** Map a DeepSeek usage object onto the widget's token buckets. */
function usageToBuckets(usage: any): UsageBuckets {
  return {
    uncachedInputTokens: usage?.prompt_cache_miss_tokens ?? usage?.prompt_tokens ?? 0,
    outputTokens: usage?.completion_tokens ?? 0,
    cacheReadTokens: usage?.prompt_cache_hit_tokens ?? 0,
    cacheWriteTokens: 0,
  };
}

function addBuckets(a: UsageBuckets, b: UsageBuckets): UsageBuckets {
  return {
    uncachedInputTokens: a.uncachedInputTokens + b.uncachedInputTokens,
    outputTokens: a.outputTokens + b.outputTokens,
    cacheReadTokens: a.cacheReadTokens + b.cacheReadTokens,
    cacheWriteTokens: a.cacheWriteTokens + b.cacheWriteTokens,
  };
}

async function readUsageRecords(): Promise<UsageRecord[]> {
  try {
    const raw = await fs.readFile(BUILDER_USAGE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.records) ? parsed.records : [];
  } catch {
    return [];
  }
}

/** Append one turn's usage to the shared, Syncthing-synced widget file. Fail-soft. */
async function appendUsageRecord(record: UsageRecord): Promise<void> {
  try {
    const records = await readUsageRecords();
    records.push(record);
    const trimmed = records.slice(-MAX_RECORDED_USAGE);
    await fs.mkdir(path.dirname(BUILDER_USAGE_FILE), { recursive: true });
    const tmp = `${BUILDER_USAGE_FILE}.tmp`;
    await fs.writeFile(tmp, JSON.stringify({ version: 1, records: trimmed }, null, 2), "utf8");
    await fs.rename(tmp, BUILDER_USAGE_FILE);
  } catch {
    /* non-fatal: the spend widget simply won't see this turn */
  }
}

/* ── version history (git) ─────────────────────────────────────────────────── */

type VersionMarker = { sha: string; short: string; message: string; at: string; kind: "rollback" };

async function loadVersionMarkers(): Promise<VersionMarker[]> {
  try {
    const raw = await fs.readFile(VERSIONS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.versions) ? parsed.versions : [];
  } catch {
    return [];
  }
}

async function saveVersionMarkers(versions: VersionMarker[]): Promise<void> {
  await fs.mkdir(path.dirname(VERSIONS_FILE), { recursive: true });
  const tmp = `${VERSIONS_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify({ versions }, null, 2), "utf8");
  await fs.rename(tmp, VERSIONS_FILE);
}

async function recordRollbackMarker(sha: string, message: string): Promise<void> {
  const short = sha.slice(0, 7);
  const markers = await loadVersionMarkers();
  if (markers.some((m) => m.sha === sha)) return;
  markers.push({ sha, short, message, at: new Date().toISOString(), kind: "rollback" });
  await saveVersionMarkers(markers);
}

/**
 * List versions newest-first: every reachable commit (git log --all) plus any
 * recorded rollback markers, marked as such. HEAD is marked `current`.
 */
async function gitHistory(): Promise<VersionInfo[]> {
  const log = await runGit(["log", "--all", "--pretty=%H%x1f%ad%x1f%s", "--date=iso-strict", "-n", "100"]);
  const head = await runGit(["rev-parse", "HEAD"]);
  const headSha = head.ok ? head.output.trim() : "";
  const markers = await loadVersionMarkers();
  const markerShas = new Set(markers.map((m) => m.sha));

  const versions: VersionInfo[] = [];
  if (log.ok) {
    for (const line of log.output.split("\n")) {
      if (!line.trim()) continue;
      const [sha, authorDate, ...rest] = line.split("\x1f");
      if (!sha) continue;
      versions.push({
        sha,
        short: sha.slice(0, 7),
        message: rest.join("\x1f") || "(no message)",
        authorDate,
        current: sha === headSha,
        rolledBack: markerShas.has(sha),
      });
    }
  }
  // Include rollback markers whose commit is no longer reachable from any ref
  // (rare with the checkout-based rollback, but keep the panel honest).
  for (const m of markers) {
    if (versions.some((v) => v.sha === m.sha)) continue;
    const exists = await runGit(["cat-file", "-e", `${m.sha}^{commit}`]);
    if (exists.ok) {
      versions.push({ sha: m.sha, short: m.short, message: m.message, authorDate: m.at, rolledBack: true });
    }
  }
  versions.sort((a, b) => (a.authorDate < b.authorDate ? 1 : -1));
  return versions;
}

/* ── git push / pull / status ──────────────────────────────────────────────── */

/**
 * Run a git command. No shell involved (execFile), so arguments never need
 * quoting. `cwd` defaults to the repo root; it is a parameter so tests can
 * exercise the exact command sequences in a scratch repository.
 */
function runGit(args: string[], cwd: string = REPO_ROOT, timeoutMs = 90_000): Promise<{ ok: boolean; output: string }> {
  return new Promise((resolve) => {
    execFile("git", args, { cwd, timeout: timeoutMs, maxBuffer: 20 * 1024 * 1024 }, (err, stdout, stderr) => {
      const output = `${stdout || ""}${stderr ? `\n${stderr}` : ""}`.trim();
      resolve({ ok: !err, output });
    });
  });
}

export type GitResult = { ok: boolean; pushed?: boolean; output: string };

/** Stage everything, commit with the given message (or a default), and push. */
export async function gitPush(message?: string, cwd: string = REPO_ROOT): Promise<GitResult> {
  const msg = (message || "Update from Persona Builder").replace(/\s+/g, " ").slice(0, 200);
  const add = await runGit(["add", "-A"], cwd);
  if (!add.ok) return { ok: false, output: add.output };
  const status = await runGit(["status", "--short"], cwd);
  const files = status.output.split("\n").filter((l) => l.trim());
  if (files.length === 0) return { ok: true, pushed: false, output: "Working tree is clean — nothing to push." };
  const commit = await runGit(["commit", "-m", msg], cwd);
  if (!commit.ok && !/nothing to commit/i.test(commit.output)) return { ok: false, output: commit.output };
  // `-u origin HEAD` makes the first push set the upstream (and is a no-op
  // thereafter), so pushes work on freshly cloned branches too.
  const push = await runGit(["push", "-u", "origin", "HEAD"], cwd);
  return { ok: push.ok, pushed: true, output: push.output };
}

/** Pull the latest changes from the configured remote. */
export async function gitPull(cwd: string = REPO_ROOT): Promise<GitResult> {
  return runGit(["pull"], cwd);
}

/** Parsed `git status --short --branch` — drives the pending-changes indicator. */
function parseGitStatus(raw: string): {
  branch: string;
  ahead: number;
  behind: number;
  files: string[];
} {
  const lines = raw.split("\n").filter((l) => l.trim());
  const branchLine = lines.shift() ?? "";
  const m = branchLine.match(/^##\s+([^\s[.]+)(?:\.\.\.)?([^\s[]*)?(?:\s+\[(.*)\])?/);
  const branch = m?.[1] ?? "HEAD";
  const info = m?.[3] ?? "";
  const ahead = Number(/ahead (\d+)/.exec(info)?.[1] ?? 0);
  const behind = Number(/behind (\d+)/.exec(info)?.[1] ?? 0);
  return { branch, ahead, behind, files: lines };
}

/* ── agent turn ────────────────────────────────────────────────────────────── */

/** Roll back every file a turn touched and truncate the conversation to before it. */
async function rollbackTurn(turn: ActiveTurn, emit: (e: ChatEvent) => void): Promise<number> {
  const count = turn.snapshots.size;
  for (const [abs, original] of turn.snapshots) {
    try {
      if (original === null) {
        await fs.rm(abs, { force: true });
      } else {
        await fs.writeFile(abs, original, "utf8");
      }
    } catch {
      /* keep going */
    }
  }
  turn.snapshots.clear();
  turn.session.apiMessages = turn.session.apiMessages.slice(0, turn.startApiLen);
  turn.session.transcript = turn.session.transcript.slice(0, turn.startTranscriptLen);
  turn.session.transcript.push({
    kind: "text",
    text: count > 0
      ? `⏹ Turn stopped — ${count} file change${count === 1 ? "" : "s"} rolled back.`
      : "⏹ Turn stopped — no file changes had been made yet.",
    at: new Date().toISOString(),
  });
  await saveSession(turn.session);
  emit({ type: "stopped", message: "Turn stopped — changes rolled back.", files: count });
  return count;
}

async function runTurn(session: Session, userText: string, emit: (e: ChatEvent) => void, turn: ActiveTurn): Promise<void> {
  session.apiMessages.push({ role: "user", content: userText });
  session.transcript.push({ kind: "user", text: userText, at: new Date().toISOString() });

  let steps = 0;
  const signal = turn.signal;

  for (;;) {
    if (signal?.aborted) {
      await rollbackTurn(turn, emit);
      return;
    }

    steps += 1;
    if (steps > MAX_TOOL_STEPS) {
      emit({ type: "error", message: `Agent exceeded ${MAX_TOOL_STEPS} tool steps; stopping.` });
      return;
    }

    let resp: any;
    try {
      resp = await callDeepSeek(session.apiMessages, signal);
    } catch (e: any) {
      if (signal?.aborted) {
        await rollbackTurn(turn, emit);
        return;
      }
      emit({ type: "error", message: e?.message ?? String(e) });
      return;
    }

    if (resp?.usage) turn.usage = addBuckets(turn.usage, usageToBuckets(resp.usage));
    turn.llmCalls += 1;

    const msg = resp?.choices?.[0]?.message;
    if (!msg) {
      emit({ type: "error", message: "Empty response from the model." });
      return;
    }

    const toolCalls: ToolCall[] = msg.tool_calls ?? [];
    if (toolCalls.length > 0) {
      session.apiMessages.push({ role: "assistant", content: msg.content ?? null, tool_calls: toolCalls });
      for (const tc of toolCalls) {
        if (signal?.aborted) {
          await rollbackTurn(turn, emit);
          return;
        }
        const name = tc.function?.name ?? "unknown";
        const args = tc.function?.arguments ?? "{}";
        let result: string;
        try {
          result = await executeTool(name, args, { snapshot: turn.snapshot });
        } catch (e: any) {
          result = `Tool error: ${e?.message ?? String(e)}`;
        }
        session.apiMessages.push({ role: "tool", tool_call_id: tc.id, content: result });
        const ok = !result.startsWith("Tool error:");
        session.transcript.push({ kind: "tool", text: toolLabel(name, args), ok, at: new Date().toISOString() });
        emit({ type: "tool", label: toolLabel(name, args), ok });
        // Persist progressively so a crash mid-turn does not lose the transcript.
        await saveSession(session);
      }
      continue;
    }

    const content = msg.content ?? "";
    session.apiMessages.push({ role: "assistant", content });
    session.transcript.push({ kind: "text", text: content, at: new Date().toISOString() });
    emit({ type: "text", text: content });
    await saveSession(session);
    return;
  }
}

/* ── session store ─────────────────────────────────────────────────────────── */

async function ensureSessionsDir(): Promise<void> {
  await fs.mkdir(SESSIONS_DIR, { recursive: true });
}

function sessionPath(id: string): string {
  return path.join(SESSIONS_DIR, `${id}.json`);
}

async function loadSession(id: string): Promise<Session | null> {
  try {
    const raw = await fs.readFile(sessionPath(id), "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function saveSession(session: Session): Promise<void> {
  session.updatedAt = new Date().toISOString();
  await ensureSessionsDir();
  await fs.writeFile(sessionPath(session.id), JSON.stringify(session, null, 2), "utf8");
}

function createSession(title = ""): Session {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    title: title || "New conversation",
    createdAt: now,
    updatedAt: now,
    apiMessages: [{ role: "system", content: systemPrompt() }],
    transcript: [],
  };
}

async function listSessions(): Promise<Array<{ id: string; title: string; createdAt: string; updatedAt: string }>> {
  await ensureSessionsDir();
  let files: string[] = [];
  try {
    files = await fs.readdir(SESSIONS_DIR);
  } catch {
    files = [];
  }
  const sessions: Session[] = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    try {
      sessions.push(JSON.parse(await fs.readFile(path.join(SESSIONS_DIR, f), "utf8")));
    } catch {
      /* skip corrupt session files */
    }
  }
  sessions.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  return sessions.map((s) => ({ id: s.id, title: s.title, createdAt: s.createdAt, updatedAt: s.updatedAt }));
}

/* ── HTTP routes ───────────────────────────────────────────────────────────── */

export function mountBuilder(app: any): void {
  // The /builder page: rewrite to builder.html so Vite (dev) or express.static (prod) serves it.
  app.use((req: any, _res: any, next: any) => {
    if (req.path === "/builder" || req.path === "/builder/") {
      req.url = "/builder.html";
    }
    next();
  });

  app.get("/api/builder/meta", (_req: any, res: any) => {
    res.json({ repoRoot: REPO_ROOT, model: MODEL, apiConfigured: API_CONFIGURED });
  });

  app.get("/api/builder/sessions", async (_req: any, res: any) => {
    try {
      res.json(await listSessions());
    } catch (e: any) {
      res.status(500).json({ error: e?.message ?? "Failed to list sessions" });
    }
  });

  app.post("/api/builder/sessions", async (req: any, res: any) => {
    try {
      const session = createSession(String(req.body?.title ?? ""));
      await saveSession(session);
      res.status(201).json({ id: session.id, title: session.title, createdAt: session.createdAt, updatedAt: session.updatedAt });
    } catch (e: any) {
      res.status(500).json({ error: e?.message ?? "Failed to create session" });
    }
  });

  app.delete("/api/builder/sessions/:id", async (req: any, res: any) => {
    try {
      await fs.rm(sessionPath(req.params.id), { force: true });
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e?.message ?? "Failed to delete session" });
    }
  });

  app.get("/api/builder/sessions/:id", async (req: any, res: any) => {
    try {
      const session = await loadSession(req.params.id);
      if (!session) return res.status(404).json({ error: "Session not found" });
      res.json({
        id: session.id,
        title: session.title,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        transcript: session.transcript,
      });
    } catch (e: any) {
      res.status(500).json({ error: e?.message ?? "Failed to load session" });
    }
  });

  // The agentic chat endpoint. Response is a Server-Sent Events stream:
  //   event: tool    / data: {"label":"edit App.tsx","ok":true}
  //   event: text    / data: {"text":"..."}
  //   event: error   / data: {"message":"..."}
  //   event: stopped / data: {"message":"...","files":3}
  //   event: done    / data: {}
  app.post("/api/builder/chat", async (req: any, res: any) => {
    if (!API_CONFIGURED) {
      res.status(503).json({ error: "DEEPSEEK_API_KEY is not configured. Set it in .env.local (or the DSH credentials) and restart." });
      return;
    }
    const { sessionId, message } = req.body ?? {};
    if (!sessionId || typeof message !== "string" || !message.trim()) {
      res.status(400).json({ error: "sessionId and message are required" });
      return;
    }

    const session = await loadSession(sessionId);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }

    if (activeTurns.has(sessionId)) {
      res.status(409).json({ error: "A turn is already running for this session. Stop it first." });
      return;
    }

    if (!session.title || session.title === "New conversation") {
      session.title = message.trim().replace(/\s+/g, " ").slice(0, 60);
    }

    const controller = new AbortController();
    const turn: ActiveTurn = {
      controller,
      signal: controller.signal,
      session,
      startApiLen: session.apiMessages.length,
      startTranscriptLen: session.transcript.length,
      snapshots: new Map(),
      snapshot: async (abs: string) => {
        if (turn.snapshots.has(abs)) return;
        let original: string | null = null;
        try {
          original = await fs.readFile(abs, "utf8");
        } catch {
          original = null;
        }
        turn.snapshots.set(abs, original);
      },
      usage: { uncachedInputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 },
      llmCalls: 0,
    };
    activeTurns.set(sessionId, turn);

    res.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    res.flushHeaders?.();

    const emit = (e: ChatEvent) => {
      res.write(`event: ${e.type}\ndata: ${JSON.stringify(e)}\n\n`);
    };

    try {
      await runTurn(session, message.trim(), emit, turn);
      emit({ type: "done" });
    } catch (e: any) {
      try {
        emit({ type: "error", message: e?.message ?? String(e) });
      } catch {
        /* client already gone */
      }
    } finally {
      // Report this turn's token spend to the DSH cost widget (fail-soft).
      const totalTokens =
        turn.usage.uncachedInputTokens + turn.usage.outputTokens + turn.usage.cacheReadTokens + turn.usage.cacheWriteTokens;
      if (turn.llmCalls > 0 && totalTokens > 0) {
        await appendUsageRecord({
          id: `${BUILDER_SOURCE}:${sessionId}:${Date.now()}:${Math.random().toString(36).slice(2, 6)}`,
          source: BUILDER_SOURCE,
          title: message.trim().replace(/\s+/g, " ").slice(0, 60),
          at: new Date().toISOString(),
          cwd: REPO_ROOT,
          model: MODEL,
          aborted: controller.signal.aborted,
          tokenUsage: turn.usage,
        });
      }
      activeTurns.delete(sessionId);
      try {
        res.end();
      } catch {
        /* ignore */
      }
    }
  });

  // Stop the running turn for a session and roll back every file it touched.
  // The abort is picked up by the chat loop, which restores the snapshots and
  // truncates the conversation, then emits `event: stopped` before closing.
  app.post("/api/builder/chat/stop", async (req: any, res: any) => {
    const { sessionId } = req.body ?? {};
    const turn = sessionId ? activeTurns.get(sessionId) : undefined;
    if (!turn) {
      res.json({ ok: false, error: "No active turn for this session." });
      return;
    }
    turn.controller.abort();
    res.json({ ok: true });
  });

  /* ── git endpoints ─────────────────────────────────────────────────────── */

  let gitBusy = false;
  const guardGit = (res: any) => {
    if (gitBusy) {
      res.status(409).json({ ok: false, output: "A git operation is already running." });
      return true;
    }
    return false;
  };

  app.get("/api/builder/git/status", async (_req: any, res: any) => {
    try {
      const status = await runGit(["status", "--short", "--branch"]);
      const parsed = parseGitStatus(status.output);
      const head = await runGit(["rev-parse", "--short", "HEAD"]);
      res.json({
        ok: true,
        branch: parsed.branch,
        head: head.ok ? head.output.trim() : "",
        dirty: parsed.files.length > 0,
        files: parsed.files,
        ahead: parsed.ahead,
        behind: parsed.behind,
      });
    } catch (e: any) {
      res.status(500).json({ ok: false, output: e?.message ?? String(e) });
    }
  });

  app.get("/api/builder/git/history", async (_req: any, res: any) => {
    try {
      const versions = await gitHistory();
      const head = versions.find((v) => v.current);
      res.json({ ok: true, versions, head: head?.sha ?? null });
    } catch (e: any) {
      res.status(500).json({ ok: false, output: e?.message ?? String(e) });
    }
  });

  // Roll back the working tree to an older or newer version. Uses
  // `git checkout <sha> -- .`: HEAD stays put, the tree + index are restored
  // to that version as pending (staged) changes, and git history is never
  // deleted — so you can roll forward again later and push the rollback.
  app.post("/api/builder/git/rollback", async (req: any, res: any) => {
    if (guardGit(res)) return;
    const { sha } = req.body ?? {};
    if (typeof sha !== "string" || !/^[0-9a-f]{7,40}$/i.test(sha)) {
      res.status(400).json({ ok: false, output: "Invalid commit sha." });
      return;
    }
    gitBusy = true;
    try {
      const exists = await runGit(["cat-file", "-e", `${sha}^{commit}`]);
      if (!exists.ok) {
        res.status(404).json({ ok: false, output: `Version ${sha} not found in this repository.` });
        return;
      }
      const meta = await runGit(["log", "-1", "--pretty=%H%x1f%ad%x1f%s", "--date=iso-strict", sha]);
      const [fullSha, authorDate, ...rest] = meta.ok ? meta.output.split("\x1f") : [sha, "", "(no message)"];
      const result = await runGit(["checkout", fullSha || sha, "--", "."]);
      if (!result.ok) {
        res.status(500).json({ ok: false, output: result.output });
        return;
      }
      // `git checkout <sha> -- .` restores every tracked path in that version
      // but does NOT remove files that were added afterwards — drop them too,
      // so the working tree really matches the target version.
      const added = await runGit(["diff", "--name-only", "--diff-filter=A", fullSha || sha, "HEAD"]);
      if (added.ok) {
        for (const line of added.output.split("\n")) {
          const file = line.trim();
          if (!file) continue;
          await runGit(["rm", "-f", "--", file]);
        }
      }
      await recordRollbackMarker(fullSha || sha, rest.join("\x1f") || "(no message)");
      const head = await runGit(["rev-parse", "--short", "HEAD"]);
      res.json({
        ok: true,
        sha: fullSha || sha,
        short: (fullSha || sha).slice(0, 7),
        message: rest.join("\x1f") || "(no message)",
        authorDate,
        head: head.ok ? head.output.trim() : "",
      });
    } catch (e: any) {
      res.status(500).json({ ok: false, output: e?.message ?? String(e) });
    } finally {
      gitBusy = false;
    }
  });

  app.post("/api/builder/git/push", async (req: any, res: any) => {
    if (guardGit(res)) return;
    gitBusy = true;
    try {
      const result = await gitPush(String(req.body?.message ?? ""));
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ ok: false, output: e?.message ?? String(e) });
    } finally {
      gitBusy = false;
    }
  });

  app.post("/api/builder/git/pull", async (_req: any, res: any) => {
    if (guardGit(res)) return;
    gitBusy = true;
    try {
      const result = await gitPull();
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ ok: false, output: e?.message ?? String(e) });
    } finally {
      gitBusy = false;
    }
  });
}
