const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// 获取所有评论
router.get('/', (req, res) => {
  const db = new sqlite3.Database('./project_management.db');
  db.all('SELECT * FROM comments', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ comments: rows });
  });
  db.close();
});

// 获取指定任务的所有评论
router.get('/task/:taskId', (req, res) => {
  const db = new sqlite3.Database('./project_management.db');
  const { taskId } = req.params;
  db.all('SELECT * FROM comments WHERE task_id = ?', [taskId], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ comments: rows });
  });
  db.close();
});

// 创建新评论
router.post('/', (req, res) => {
  const db = new sqlite3.Database('./project_management.db');
  const { task_id, user_id, comment, created_at } = req.body;
  const query = `
    INSERT INTO comments (task_id, user_id, comment, created_at)
    VALUES (?, ?, ?, ?)
  `;
  db.run(query, [task_id, user_id, comment, created_at], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
  db.close();
});

// 更新评论
router.put('/:id', (req, res) => {
  const db = new sqlite3.Database('./project_management.db');
  const { id } = req.params;
  const { task_id, user_id, comment, created_at } = req.body;
  const query = `
    UPDATE comments
    SET task_id = ?, user_id = ?, comment = ?, created_at = ?
    WHERE id = ?
  `;
  db.run(query, [task_id, user_id, comment, created_at, id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
  db.close();
});

// 删除评论
router.delete('/:id', (req, res) => {
  const db = new sqlite3.Database('./project_management.db');
  const { id } = req.params;
  db.run('DELETE FROM comments WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
  db.close();
});

module.exports = router;
