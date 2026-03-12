import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
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
