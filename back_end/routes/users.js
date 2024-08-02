const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// 注册用户
router.post('/register', (req, res) => {
  const db = new sqlite3.Database('./project_management.db');
  const { name, email, password } = req.body;

  const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  db.run(query, [name, email, password], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
  db.close();
});

// 登录用户
router.post('/login', (req, res) => {
  const db = new sqlite3.Database('./project_management.db');
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, user) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (!user) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }
    res.json({ id: user.id });
  });
  db.close();
});

module.exports = router;
