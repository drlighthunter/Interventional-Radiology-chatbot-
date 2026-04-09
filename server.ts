import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import cors from 'cors';

const db = new Database('analytics.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS chat_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT,
    language TEXT,
    symptoms TEXT,
    diagnosis TEXT,
    procedure TEXT,
    raw_message TEXT
  )
`);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 7860;

  app.use(cors());
  app.use(express.json());

  // Analytics API
  app.post('/api/analytics/log', (req, res) => {
    const { userId, language, symptoms, diagnosis, procedure, rawMessage } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO chat_logs (user_id, language, symptoms, diagnosis, procedure, raw_message)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run(userId, language, symptoms, diagnosis, procedure, rawMessage);
      res.json({ success: true });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to log analytics' });
    }
  });

  app.get('/api/analytics/summary', (req, res) => {
    try {
      const logs = db.prepare('SELECT * FROM chat_logs ORDER BY timestamp DESC LIMIT 100').all();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
