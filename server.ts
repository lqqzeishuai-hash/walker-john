import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("community.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    phone TEXT,
    password TEXT,
    room_number TEXT
  );

  CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    type TEXT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS repairs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    description TEXT,
    status TEXT DEFAULT 'pending',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT,
    image_url TEXT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  -- Seed some data if empty
  INSERT OR IGNORE INTO notices (title, content, type) VALUES 
  ('关于本周末停水的通知', '因管道维修，本周末上午8点至12点将停水，请各位居民做好储水准备。', '物业通知'),
  ('社区广场舞大赛报名开始', '欢迎各位居民积极参与，展示风采。', '活动通知');
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);
    if (user) {
      res.json({ success: true, user: { id: user.id, username: user.username, phone: user.phone } });
    } else {
      res.status(401).json({ success: false, message: "用户名或密码错误" });
    }
  });

  app.post("/api/register", (req, res) => {
    const { username, password, phone } = req.body;
    try {
      const info = db.prepare("INSERT INTO users (username, password, phone) VALUES (?, ?, ?)").run(username, password, phone);
      res.json({ success: true, userId: info.lastInsertRowid });
    } catch (e) {
      res.status(400).json({ success: false, message: "注册失败，用户名可能已存在" });
    }
  });

  app.get("/api/notices", (req, res) => {
    const notices = db.prepare("SELECT * FROM notices ORDER BY create_time DESC").all();
    res.json(notices);
  });

  app.get("/api/repairs", (req, res) => {
    const { userId } = req.query;
    const repairs = db.prepare("SELECT * FROM repairs WHERE user_id = ? ORDER BY create_time DESC").all(userId);
    res.json(repairs);
  });

  app.post("/api/repairs", (req, res) => {
    const { userId, description } = req.body;
    db.prepare("INSERT INTO repairs (user_id, description) VALUES (?, ?)").run(userId, description);
    res.json({ success: true });
  });

  app.get("/api/posts", (req, res) => {
    const posts = db.prepare(`
      SELECT posts.*, users.username 
      FROM posts 
      JOIN users ON posts.user_id = users.id 
      ORDER BY create_time DESC
    `).all();
    res.json(posts);
  });

  app.post("/api/posts", (req, res) => {
    const { userId, content, imageUrl } = req.body;
    db.prepare("INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)").run(userId, content, imageUrl);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
