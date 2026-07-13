import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { createClient } from '@supabase/supabase-js';
import { ALL_ITEMS } from './data/items';
import { COMMON_CREATURES } from './data/beasts';
import { STANDARD_FAMILIARS } from './data/familiars';
import { getLocalSpells } from './data/spells';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://pducitlqzhcjjeqthkof.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkdWNpdGxxemhjamplcXRoa29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNjQ5MjksImV4cCI6MjA4NTc0MDkyOX0.akpxEEytntkNy8rDjfp4FDOLuQW2LjdYqED1F-Z811g';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function startServer() {
  const app = express();
  const PORT = 4000;

  app.use(express.json({ limit: '10mb' }));

  // CSV Export endpoint for manual Supabase import
  app.get("/api/export-csv/:table", (req, res) => {
    const { table } = req.params;
    let items: any[] = [];
    if (table === 'custom_equipment') items = ALL_ITEMS;
    else if (table === 'custom_beasts') items = COMMON_CREATURES;
    else if (table === 'custom_familiars') items = STANDARD_FAMILIARS;
    else if (table === 'custom_spells') items = getLocalSpells('wizard');
    else return res.status(404).json({ error: "Table not found or already imported" });

    // Build CSV content: columns: name, is_public, data, user_id
    let csv = "name,is_public,data,user_id\n";
    for (const item of items) {
      const name = `"${(item.name || '').replace(/"/g, '""')}"`;
      const is_public = "TRUE";
      const jsonStr = JSON.stringify(item).replace(/"/g, '""');
      const data = `"${jsonStr}"`;
      const user_id = `"b0027d9e-13eb-41a7-b3ee-1da5f52c9599"`;
      csv += `${name},${is_public},${data},${user_id}\n`;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${table}.csv`);
    res.send(csv);
  });

  // Heuristic Scraper Endpoint (No AI)
  app.post("/api/scrape", async (req, res) => {
    const { url, type } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
      const { default: axios } = await import("axios");
      const cheerio = await import("cheerio");

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const result: any = {};

      // Generic extraction
      result.name = $("h1").first().text().trim() || $("title").text().split("-")[0].trim();
      
      // Try to find description (first few paragraphs that aren't navigation)
      const paragraphs = $("p").map((i, el) => $(el).text().trim()).get().filter(p => p.length > 50);
      result.description = paragraphs.slice(0, 3).join("\n\n");

      const fullText = $("body").text();

      // Heuristic parsing based on type
      if (type === 'spell') {
        const levelMatch = fullText.match(/(\d+)(?:st|nd|rd|th)[- ]level/i) || fullText.match(/level (\d+)/i);
        if (levelMatch) result.level = parseInt(levelMatch[1]);
        else if (fullText.toLowerCase().includes("cantrip")) result.level = 0;

        const schoolMatch = fullText.match(/(Abjuration|Conjuration|Divination|Enchantment|Evocation|Illusion|Necromancy|Transmutation)/i);
        if (schoolMatch) result.school = schoolMatch[1];

        const castTimeMatch = fullText.match(/Casting Time:\s*([^\n.]+)/i);
        if (castTimeMatch) result.casting_time = castTimeMatch[1].trim();

        const rangeMatch = fullText.match(/Range:\s*([^\n.]+)/i);
        if (rangeMatch) result.range = rangeMatch[1].trim();

        const componentsMatch = fullText.match(/Components:\s*([^\n.]+)/i);
        if (componentsMatch) result.components = componentsMatch[1].trim().split(/,\s*/);

        const durationMatch = fullText.match(/Duration:\s*([^\n.]+)/i);
        if (durationMatch) result.duration = durationMatch[1].trim();
      } 
      else if (type === 'item') {
        const rarityMatch = fullText.match(/(Common|Uncommon|Rare|Very Rare|Legendary|Artifact)/i);
        if (rarityMatch) result.rarity = rarityMatch[1];

        const weightMatch = fullText.match(/(\d+(?:\.\d+)?)\s*(?:lb|pound)/i);
        if (weightMatch) result.weight = parseFloat(weightMatch[1]);

        const attunementMatch = fullText.match(/requires attunement/i);
        if (attunementMatch) result.requires_attunement = true;
      }
      else if (type === 'race') {
        const sizeMatch = fullText.match(/(Small|Medium|Large)\s+size/i) || fullText.match(/Size:\s*(Small|Medium|Large)/i);
        if (sizeMatch) result.size = sizeMatch[1];

        const speedMatch = fullText.match(/speed is (\d+) feet/i) || fullText.match(/Speed:\s*(\d+)/i);
        if (speedMatch) result.speed = parseInt(speedMatch[1]);
      }

      res.json(result);
    } catch (error: any) {
      console.error("Scraping error:", error.message);
      res.status(500).json({ error: "Failed to scrape URL. The site might be blocking automated access." });
    }
  });

  // Supabase Proxy Endpoints
  app.get("/api/homebrew/:table", async (req, res) => {
    try {
      const { table } = req.params;
      const { userId } = req.query;
      
      let query = supabase.from(table).select('*');
      
      // Validate userId is a valid UUID if provided
      const isValidUUID = (uuid: any) => {
        if (typeof uuid !== 'string') return false;
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
      };

      if (userId && isValidUUID(userId)) {
        query = query.or(`is_public.eq.true,user_id.eq.${userId}`);
      } else {
        query = query.eq('is_public', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error(`Error loading homebrew from ${table}:`, error);
        return res.status(500).json({ error: error.message });
      }
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  app.post("/api/homebrew/:table", async (req, res) => {
    try {
      const { table } = req.params;
      const { userId, payload, isPublic, id } = req.body;

      const isValidUUID = (uuid: any) => {
        if (typeof uuid !== 'string') return false;
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
      };

      if (id && isValidUUID(id)) {
        // Check if row belongs to user
        const { data: existing } = await supabase.from(table).select('user_id').eq('id', id).maybeSingle();
        if (existing && existing.user_id === userId) {
          const { data, error } = await supabase
            .from(table)
            .update({ 
              name: payload.name, 
              data: payload,
              is_public: isPublic
            })
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .maybeSingle();
            
          if (error) return res.status(500).json({ error: error.message });
          return res.json(data);
        }
      }

      // Insert as new row (or user override copy)
      const { data, error } = await supabase
        .from(table)
        .insert([{ 
          user_id: userId,
          name: payload.name, 
          data: payload,
          is_public: isPublic
        }])
        .select()
        .maybeSingle();
        
      if (error) return res.status(500).json({ error: error.message });
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  app.delete("/api/homebrew/:table/:id", async (req, res) => {
    try {
      const { table, id } = req.params;
      const { userId } = req.query;

      // Validate UUID format for userId to prevent "The string did not match the expected pattern" error
      const isValidUUID = (uuid: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);

      if (!userId || typeof userId !== 'string' || !isValidUUID(userId)) {
        return res.status(400).json({ error: "Valid User ID required" });
      }

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) return res.status(500).json({ error: error.message });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Character Endpoints
  app.get("/api/characters", async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    try {
      // Fetch owned
      const { data: owned, error: ownedError } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', userId);
      if (ownedError) throw ownedError;

      // Fetch shared
      const { data: sharedEntries, error: sharedError } = await supabase
        .from('character_shares')
        .select('character_id')
        .eq('shared_with_user_id', userId);

      let shared: any[] = [];
      if (!sharedError && sharedEntries && sharedEntries.length > 0) {
        const sharedIds = sharedEntries.map(s => s.character_id);
        const { data: sharedChars, error: sharedCharsError } = await supabase
          .from('characters')
          .select('*')
          .in('id', sharedIds);
        if (!sharedCharsError && sharedChars) {
          shared = sharedChars.map(c => ({ ...c, isShared: true }));
        }
      }
      
      const all = [...owned, ...shared].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      res.json(all);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/characters", async (req, res) => {
    const { character, userId } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const { id, user_id, ...charData } = character;
    
    try {
      if (!id) {
        const { data, error } = await supabase
          .from('characters')
          .insert([{ user_id: userId, name: character.name || 'Unnamed Hero', data: charData }])
          .select().maybeSingle();
        if (error) throw error;
        res.json(data);
      } else {
        const { data, error } = await supabase
          .from('characters')
          .update({ name: character.name, data: charData, updated_at: new Date().toISOString() })
          .eq('id', id).select().maybeSingle();
        if (error) throw error;
        res.json(data);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/characters/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { error } = await supabase.from('characters').delete().eq('id', id);
      if (error) return res.status(500).json({ error: error.message });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // User Endpoints
  app.get("/api/users", async (req, res) => {
    try {
      const { username } = req.query;
      if (username) {
        const { data, error } = await supabase.from('app_users').select('*').eq('username', username).maybeSingle();
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
      }
      const { data, error } = await supabase.from('app_users').select('id, username').order('username');
      if (error) return res.status(500).json({ error: error.message });
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Share Endpoints
  app.get("/api/shares/:characterId", async (req, res) => {
    try {
      const { characterId } = req.params;
      const { data, error } = await supabase.from('character_shares').select('shared_with_user_id').eq('character_id', characterId);
      if (error) return res.json([]);
      res.json(data.map(d => d.shared_with_user_id));
    } catch (error: any) {
      res.json([]);
    }
  });

  app.post("/api/shares", async (req, res) => {
    try {
      const { characterId, sharedWithUserId } = req.body;
      const { error } = await supabase.from('character_shares').insert([{ character_id: characterId, shared_with_user_id: sharedWithUserId }]);
      if (error) return res.status(500).json({ error: error.message });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  app.delete("/api/shares", async (req, res) => {
    try {
      const { characterId, sharedWithUserId } = req.body;
      const { error } = await supabase.from('character_shares').delete().eq('character_id', characterId).eq('shared_with_user_id', sharedWithUserId);
      if (error) return res.status(500).json({ error: error.message });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });



  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
        watch: {
          usePolling: true,
          interval: 1000
        }
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
