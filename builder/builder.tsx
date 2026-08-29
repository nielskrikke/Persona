import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import ReactMarkdown from "react-markdown";
import "./builder.css";

type TranscriptItem = { kind: "user" | "tool" | "text"; text: string; ok?: boolean; at: string };
type SessionMeta = { id: string; title: string; createdAt: string; updatedAt: string };
type Meta = { repoRoot: string; model: string; apiConfigured: boolean };
type Device = "desktop" | "tablet" | "mobile";
type GitStatus = { ok: boolean; branch: string; head: string; dirty: boolean; files: string[]; ahead: number; behind: number };
type VersionInfo = { sha: string; short: string; message: string; authorDate: string; current?: boolean; rolledBack?: boolean };

const EXAMPLE_PROMPTS = [
  "Add a new homebrew spell to the wizard spell list",
  "Change the landing page hero text and tagline",
  "Make the primary accent color a deep emerald green",
  "Fix the dice roller so dice fade out after 3 seconds",
  "Add a \"Notes\" section to the character sheet layout",
];

const DEVICE_WIDTHS: Record<Device, number | null> = { desktop: null, tablet: 768, mobile: 390 };

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/* ── SSE parsing ───────────────────────────────────────────────────────────── */

type SseEvent = { event: string; data: any };

function parseSse(raw: string): SseEvent | null {
  let event = "message";
  let data = "";
  for (const line of raw.split("\n")) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) data += line.slice(5).trim();
  }
  if (!data) return null;
  try {
    return { event, data: JSON.parse(data) };
  } catch {
    return { event, data };
  }
}

/* ── App ───────────────────────────────────────────────────────────────────── */

const clampChatWidth = (w: number) =>
  Math.max(300, Math.min(Math.max(400, Math.round(window.innerWidth * 0.6)), w));

function App() {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [sessions, setSessions] = useState<SessionMeta[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(() => localStorage.getItem("builder.sidebar") !== "0");
  const [chatWidth, setChatWidth] = useState(() => {
    const saved = localStorage.getItem("builder.chatWidth");
    if (saved) {
      const n = parseInt(saved, 10);
      if (Number.isFinite(n) && n > 0) return clampChatWidth(n);
    }
    // ~30% narrower than the original 1fr chat column on typical screens.
    return Math.max(300, Math.min(620, Math.round(window.innerWidth * 0.24)));
  });
  const [gitBusy, setGitBusy] = useState(false);
  const [gitStatus, setGitStatus] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ── new builder features ──
  const [device, setDevice] = useState<Device>(() => {
    const saved = localStorage.getItem("builder.device");
    return saved === "tablet" || saved === "mobile" ? saved : "desktop";
  });
  const [gitInfo, setGitInfo] = useState<GitStatus | null>(null);
  const [versions, setVersions] = useState<VersionInfo[] | null>(null);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [historyBusy, setHistoryBusy] = useState(false);
  const [stopping, setStopping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLElement>(null);
  const dragRef = useRef<{ startX: number; startW: number } | null>(null);
  const streamCtrlRef = useRef<AbortController | null>(null);
  const streamingRef = useRef(false);
  const stoppingRef = useRef(false);

  useEffect(() => {
    localStorage.setItem("builder.sidebar", sidebarOpen ? "1" : "0");
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem("builder.chatWidth", String(chatWidth));
  }, [chatWidth]);

  useEffect(() => {
    localStorage.setItem("builder.device", device);
  }, [device]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    streamingRef.current = streaming;
  }, [streaming]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    } else {
      previewRef.current?.requestFullscreen?.().catch(() => {});
    }
  };

  const onDividerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startW: chatWidth };
    document.body.classList.add("builder-dragging");
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      setChatWidth(clampChatWidth(dragRef.current.startW + (ev.clientX - dragRef.current.startX)));
    };
    const onUp = () => {
      dragRef.current = null;
      document.body.classList.remove("builder-dragging");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // ── git: pending changes indicator ──
  const refreshGitStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/builder/git/status");
      if (res.ok) {
        const data = await res.json();
        if (data.ok) setGitInfo(data);
      }
    } catch {
      /* keep the last known state */
    }
  }, []);

  useEffect(() => {
    refreshGitStatus();
    const t = setInterval(refreshGitStatus, 20000);
    return () => clearInterval(t);
  }, [refreshGitStatus]);

  const gitAction = useCallback(
    async (kind: "push" | "pull") => {
      if (gitBusy) return;
      setGitBusy(true);
      setGitStatus(kind === "push" ? "Pushing…" : "Pulling…");
      try {
        // Commit message: the latest user request, when available.
        const lastUser = [...transcript].reverse().find((t) => t.kind === "user");
        const message =
          kind === "push" && lastUser ? lastUser.text.replace(/\s+/g, " ").slice(0, 120) : undefined;
        const res = await fetch(`/api/builder/git/${kind}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message ? { message } : {}),
        });
        const data = await res.json();
        if (data.ok) {
          setGitStatus(
            kind === "push"
              ? data.pushed === false
                ? "Nothing to push"
                : "✓ Pushed to GitHub"
              : "✓ Pulled latest"
          );
          setPreviewKey((k) => k + 1);
        } else {
          setGitStatus(`✗ ${String(data.output ?? "failed").split("\n")[0].slice(0, 80)}`);
          setError(data.output ?? "Git operation failed.");
        }
      } catch (e: any) {
        setGitStatus("✗ Git failed");
        setError(e?.message ?? "Git operation failed.");
      } finally {
        setGitBusy(false);
        refreshGitStatus();
        setTimeout(() => setGitStatus(null), 6000);
      }
    },
    [gitBusy, transcript, refreshGitStatus]
  );

  // ── git: version history + rollback ──
  const loadVersions = useCallback(async () => {
    try {
      const res = await fetch("/api/builder/git/history");
      if (res.ok) {
        const data = await res.json();
        if (data.ok) setVersions(data.versions ?? []);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const openVersions = useCallback(() => {
    setVersionsOpen(true);
    loadVersions();
  }, [loadVersions]);

  const rollback = useCallback(
    async (sha: string) => {
      if (
        !window.confirm(
          "Roll back the working tree to this version?\n\n" +
            "The tree is restored to that commit (staged as pending changes). " +
            "Nothing is deleted from git history — you can roll forward again and Push to persist."
        )
      ) {
        return;
      }
      setHistoryBusy(true);
      try {
        const res = await fetch("/api/builder/git/rollback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sha }),
        });
        const data = await res.json();
        if (data.ok) {
          setGitStatus(`↩ Rolled back to ${data.short} — push to persist`);
          setPreviewKey((k) => k + 1);
        } else {
          setGitStatus(`✗ ${String(data.output ?? "rollback failed").split("\n")[0].slice(0, 80)}`);
          setError(data.output ?? "Rollback failed.");
        }
      } catch (e: any) {
        setGitStatus("✗ Rollback failed");
        setError(e?.message ?? "Rollback failed.");
      } finally {
        setHistoryBusy(false);
        refreshGitStatus();
        loadVersions();
        setTimeout(() => setGitStatus(null), 6000);
      }
    },
    [refreshGitStatus, loadVersions]
  );

  const refreshSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/builder/sessions");
      const list = await res.json();
      setSessions(list);
      return list as SessionMeta[];
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    fetch("/api/builder/meta")
      .then((r) => r.json())
      .then((m) => setMeta(m))
      .catch(() => setMeta(null));
    refreshSessions();
  }, [refreshSessions]);

  const loadSession = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/builder/sessions/${id}`);
      if (!res.ok) return;
      const s = await res.json();
      setActiveId(s.id);
      setTitle(s.title);
      setTranscript(s.transcript ?? []);
      setError(null);
    } catch {
      setError("Failed to load session.");
    }
  }, []);

  const newSession = useCallback(async () => {
    try {
      const res = await fetch("/api/builder/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const s = await res.json();
      await refreshSessions();
      await loadSession(s.id);
      setInput("");
      inputRef.current?.focus();
    } catch {
      setError("Failed to create a new conversation.");
    }
  }, [loadSession, refreshSessions]);

  const deleteSession = useCallback(
    async (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      await fetch(`/api/builder/sessions/${id}`, { method: "DELETE" });
      if (id === activeId) {
        setActiveId(null);
        setTranscript([]);
        setTitle("");
      }
      refreshSessions();
    },
    [activeId, refreshSessions]
  );

  // ── stop & roll back a running prompt ──
  const stopTurn = useCallback(async () => {
    if (!activeId || !streaming || stopping) return;
    setStopping(true);
    stoppingRef.current = true;
    try {
      await fetch("/api/builder/chat/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: activeId }),
      });
    } catch {
      /* the server will notice the aborted stream either way */
    }
    // Watchdog: if the server hasn't closed the stream with `stopped` shortly,
    // drop the connection locally and resync from the server-side state.
    setTimeout(() => {
      if (!streamingRef.current || !stoppingRef.current) return;
      streamCtrlRef.current?.abort();
      loadSession(activeId);
      refreshGitStatus();
      setPreviewKey((k) => k + 1);
      setGitStatus("⏹ Stopped — changes rolled back");
      setTimeout(() => setGitStatus(null), 6000);
    }, 5000);
  }, [activeId, streaming, stopping, loadSession, refreshGitStatus]);

  const send = useCallback(
    async (text?: string) => {
      const message = (text ?? input).trim();
      if (!message || streaming) return;
      let id = activeId;
      if (!id) {
        // Auto-create a session on first message.
        try {
          const res = await fetch("/api/builder/sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: message.slice(0, 60) }),
          });
          const s = await res.json();
          id = s.id;
          setActiveId(id);
          setTitle(message.slice(0, 60));
          await refreshSessions();
        } catch {
          setError("Failed to create a new conversation.");
          return;
        }
      }
      setStreaming(true);
      await streamChat(id, message);
    },
    [activeId, input, streaming, refreshSessions]
  );

  const streamChat = useCallback(
    async (sessionId: string, message: string) => {
      setInput("");
      setError(null);
      // Optimistically append the user message.
      const userItem: TranscriptItem = { kind: "user", text: message, at: new Date().toISOString() };
      setTranscript((t) => [...t, userItem]);

      const ctrl = new AbortController();
      streamCtrlRef.current = ctrl;

      try {
        const res = await fetch("/api/builder/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, message }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) {
          const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          setError(err.error ?? `HTTP ${res.status}`);
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          let idx: number;
          while ((idx = buf.indexOf("\n\n")) !== -1) {
            const raw = buf.slice(0, idx);
            buf = buf.slice(idx + 2);
            const ev = parseSse(raw);
            if (!ev) continue;
            if (ev.event === "tool") {
              setTranscript((t) => [
                ...t,
                { kind: "tool", text: ev.data.label, ok: ev.data.ok, at: new Date().toISOString() },
              ]);
            } else if (ev.event === "text") {
              // Merge chunks into the latest assistant text item, skipping tool
              // lines that may have landed between chunks.
              setTranscript((t) => {
                const copy = [...t];
                let i = copy.length - 1;
                while (i >= 0 && copy[i].kind !== "text") i--;
                if (i >= 0) {
                  copy[i] = { ...copy[i], text: copy[i].text + ev.data.text };
                  return copy;
                }
                return [...copy, { kind: "text", text: ev.data.text, at: new Date().toISOString() }];
              });
            } else if (ev.event === "error") {
              setError(ev.data.message ?? "Unknown error");
            } else if (ev.event === "stopped") {
              // The server rolled the turn back and truncated the conversation;
              // resync the transcript from the server so both match.
              setStopping(false);
              stoppingRef.current = false;
              setError(null);
              await loadSession(sessionId);
              refreshGitStatus();
              setPreviewKey((k) => k + 1);
              setGitStatus("⏹ Stopped — changes rolled back");
              setTimeout(() => setGitStatus(null), 6000);
            } else if (ev.event === "done") {
              // Turn finished: refresh history and reload the live preview.
              refreshSessions();
              refreshGitStatus();
              setPreviewKey((k) => k + 1);
            }
          }
        }
      } catch (e: any) {
        if (!stoppingRef.current) {
          setError(e?.message ?? "Network error while talking to the builder.");
        }
      } finally {
        stoppingRef.current = false;
        setStopping(false);
        setStreaming(false);
        refreshSessions();
        refreshGitStatus();
      }
    },
    [refreshSessions, refreshGitStatus, loadSession]
  );

  // Autoscroll to the newest message while streaming.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [transcript, streaming]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const pendingPill =
    gitInfo === null
      ? { text: "…", cls: "", title: "Checking git state…" }
      : gitInfo.dirty
        ? { text: `● ${gitInfo.files.length} uncommitted`, cls: " dirty", title: `${gitInfo.files.length} pending change(s) not committed or pushed` }
        : gitInfo.ahead > 0
          ? { text: `▲ ${gitInfo.ahead} ahead`, cls: " drift", title: `${gitInfo.ahead} commit(s) not pushed to origin` }
          : gitInfo.behind > 0
            ? { text: `▼ ${gitInfo.behind} behind`, cls: " drift", title: `${gitInfo.behind} commit(s) pulled from origin not applied — Pull to sync` }
            : { text: "✓ in sync", cls: " clean", title: "No pending changes" };

  return (
    <div className="builder">
      {/* ── history sidebar ── */}
      <aside className={`builder-sidebar${sidebarOpen ? "" : " collapsed"}`}>
        <div className="sidebar-inner">
          <div className="sidebar-brand">
            <span className="sidebar-logo">◈</span>
            <div>
              <div className="sidebar-title">Persona Builder</div>
              <div className="sidebar-subtitle">{meta ? meta.model : "…"}</div>
            </div>
          </div>
          <button className="new-chat-btn" onClick={newSession} disabled={streaming}>
            + New conversation
          </button>
          <div className="session-list">
            <div className="session-list-label">History</div>
            {sessions.length === 0 && <div className="session-empty">No conversations yet.</div>}
            {sessions.map((s) => (
              <div
                key={s.id}
                className={`session-item${s.id === activeId ? " active" : ""}`}
                onClick={() => !streaming && loadSession(s.id)}
              >
                <div className="session-item-title">{s.title}</div>
                <div className="session-item-meta">
                  <span>{timeAgo(s.updatedAt)}</span>
                  <button
                    className="session-delete"
                    title="Delete conversation"
                    onClick={(e) => deleteSession(e, s.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="sidebar-footer">{meta ? meta.repoRoot : ""}</div>
        </div>
      </aside>

      {/* ── chat ── */}
      <main className="builder-chat" style={{ width: chatWidth }}>
        <header className="chat-header">
          <div className="chat-header-left">
            <button
              className="fold-btn"
              onClick={() => setSidebarOpen((v) => !v)}
              title={sidebarOpen ? "Hide history sidebar" : "Show history sidebar"}
            >
              ☰
            </button>
            <div className="chat-header-title">{title || "Persona App Builder"}</div>
          </div>
          <div className="chat-header-right">
            <div className="git-cluster">
              <span className={`pending-pill${pendingPill.cls}`} title={pendingPill.title}>
                {pendingPill.text}
              </span>
              <button className="git-btn" onClick={openVersions} disabled={streaming} title="Version history — roll back to any commit">
                🕘 Versions
              </button>
              <button className="git-btn" onClick={() => gitAction("push")} disabled={gitBusy || streaming} title="Commit and push all changes to GitHub">
                ⬆ Push
              </button>
              <button className="git-btn" onClick={() => gitAction("pull")} disabled={gitBusy || streaming} title="Pull the latest changes from GitHub">
                ⬇ Pull
              </button>
              {gitStatus && (
                <span className={`git-status${gitStatus.startsWith("✓") || gitStatus.startsWith("↩") || gitStatus.startsWith("⏹") ? " ok" : gitStatus.startsWith("✗") ? " fail" : ""}`}>
                  {gitStatus}
                </span>
              )}
            </div>
            <div className={`status-pill${streaming ? " streaming" : ""}`}>
              <span className="status-dot" />
              {streaming ? "Working…" : meta?.apiConfigured ? "DeepSeek connected" : "API key missing"}
            </div>
          </div>
        </header>

        {error && (
          <div className="error-banner">
            <span>⚠</span> {error}
            <button className="error-close" onClick={() => setError(null)}>
              ✕
            </button>
          </div>
        )}

        <div className="chat-scroll" ref={scrollRef}>
          {transcript.length === 0 && (
            <div className="chat-empty">
              <div className="chat-empty-title">Build Persona with chat</div>
              <p>
                Describe a change in plain language — add a spell, restyle the sheet, fix a bug — and the
                DeepSeek builder agent will edit the code in this repo. The live preview reloads after every
                turn so you can verify.
              </p>
              <div className="example-prompts">
                {EXAMPLE_PROMPTS.map((p) => (
                  <button key={p} className="example-chip" onClick={() => send(p)} disabled={streaming}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {transcript.map((item, i) => {
            if (item.kind === "user") {
              return (
                <div key={i} className="msg user-msg">
                  <div className="msg-bubble">{item.text}</div>
                </div>
              );
            }
            if (item.kind === "tool") {
              return (
                <div key={i} className={`tool-line${item.ok === false ? " failed" : ""}`}>
                  <span className="tool-icon">{item.ok === false ? "✗" : "⚙"}</span>
                  <code>{item.text}</code>
                </div>
              );
            }
            return (
              <div key={i} className="msg assistant-msg">
                <div className="msg-avatar">◈</div>
                <div className="msg-bubble markdown-body">
                  <ReactMarkdown>{item.text}</ReactMarkdown>
                </div>
              </div>
            );
          })}

          {streaming && (
            <div className="streaming-indicator">
              <span className="spinner" />
              The builder agent is working…
            </div>
          )}
        </div>

        <footer className="composer">
          <textarea
            ref={inputRef}
            className="composer-input"
            placeholder='Describe a change, e.g. "Add a Tiefling race option with fire resistance"'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            disabled={streaming}
          />
          <div className="composer-actions">
            {streaming && (
              <button className="stop-btn" onClick={stopTurn} disabled={stopping} title="Stop the agent and roll back every file change it made in this turn">
                {stopping ? "Stopping…" : "■ Stop & roll back"}
              </button>
            )}
            <button className="send-btn" onClick={() => send()} disabled={streaming || !input.trim()}>
              {streaming ? "…" : "Send ↵"}
            </button>
          </div>
          <div className="composer-hint">Enter to send · Shift+Enter for a new line · edits apply to the repo on disk</div>
        </footer>
      </main>

      {/* draggable divider between chat and preview */}
      <div className="divider" onMouseDown={onDividerMouseDown} title="Drag to resize the chat window" />

      {/* ── live preview ── */}
      <section className="builder-preview" ref={previewRef}>
        <header className="preview-header">
          <div className="preview-title">
            <span className="status-dot green" /> Live preview
          </div>
          <div className="preview-actions">
            <div className="device-switcher" role="group" aria-label="Preview device">
              {(["desktop", "tablet", "mobile"] as Device[]).map((d) => (
                <button
                  key={d}
                  className={`device-btn${device === d ? " active" : ""}`}
                  onClick={() => setDevice(d)}
                  title={d === "desktop" ? "Desktop (full width)" : d === "tablet" ? "Tablet (768px)" : "Mobile (390px)"}
                >
                  {d === "desktop" ? "🖥 Desktop" : d === "tablet" ? "▭ Tablet" : "▯ Mobile"}
                </button>
              ))}
            </div>
            <button
              className="preview-btn"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen preview"}
            >
              {isFullscreen ? "✕ ⛶" : "⛶ Fullscreen"}
            </button>
            <button className="preview-btn" onClick={() => setPreviewKey((k) => k + 1)} title="Reload preview">
              ⟳ Reload
            </button>
            <a className="preview-btn" href="/" target="_blank" rel="noreferrer" title="Open app in a new tab">
              ↗ Open
            </a>
          </div>
        </header>
        <div className={`preview-frame device-${device}`}>
          <div className="preview-stage">
            {device !== "desktop" && (
              <div className="device-label">
                {device === "tablet" ? "Tablet · 768px" : "Mobile · 390px"}
              </div>
            )}
            <div className="device-screen">
              <iframe key={previewKey} src="/" title="Persona app preview" />
            </div>
          </div>
        </div>
      </section>

      {/* ── version history overlay ── */}
      {versionsOpen && (
        <div className="versions-overlay" onClick={() => setVersionsOpen(false)}>
          <div className="versions-panel" onClick={(e) => e.stopPropagation()}>
            <div className="versions-head">
              <span>Version history</span>
              <button className="error-close" onClick={() => setVersionsOpen(false)}>
                ✕
              </button>
            </div>
            <div className="versions-list">
              {versions === null ? (
                <div className="session-empty">Loading…</div>
              ) : versions.length === 0 ? (
                <div className="session-empty">No commits yet — push a change to create the first version.</div>
              ) : (
                versions.map((v) => (
                  <div key={v.sha} className={`version-item${v.current ? " current" : ""}`}>
                    <div className="version-item-main">
                      <span className="version-sha">{v.short}</span>
                      <span className="version-msg" title={v.message}>
                        {v.message}
                      </span>
                    </div>
                    <div className="version-item-meta">
                      <span>{timeAgo(v.authorDate)}</span>
                      {v.current && <span className="version-badge">current</span>}
                      {v.rolledBack && !v.current && <span className="version-badge rollback">rolled back</span>}
                      <button
                        className="version-rollback"
                        disabled={historyBusy || v.current || streaming}
                        onClick={() => rollback(v.sha)}
                        title={v.current ? "This is the current HEAD" : "Restore the working tree to this version"}
                      >
                        Roll back
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="versions-note">
              Rolling back restores the working tree to that version as pending changes — git history is never
              deleted, so you can roll forward again, and Push persists the rollback.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const rootEl = document.getElementById("builder-root");
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
