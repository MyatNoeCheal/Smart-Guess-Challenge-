import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

let facts = [];

(async () => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'facts.json'), 'utf-8');
    facts = JSON.parse(data);
    console.log("✅ facts.json loaded successfully");
  } catch (err) {
    console.error("❌ Failed to load facts.json", err);
  }
})();

app.get('/facts', (req, res) => {
  if (!facts.length) {
    return res.status(500).json({ error: "No facts available." });
  }
  res.json(facts);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
