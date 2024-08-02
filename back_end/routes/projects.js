const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// 获取所有项目
router.get('/', (req, res) => {
  const db = new sqlite3.Database('./project_management.db');
  db.all('SELECT * FROM projects', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ projects: rows });
  });
  db.close();
});

// 获取指定项目
router.get('/:id', (req, res) => {
  const db = new sqlite3.Database('./project_management.db');
  const { id } = req.params;
  db.get('SELECT * FROM projects WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ project: row });
  });
  db.close();
});

// 创建新项目
router.post('/', (req, res) => {
  const db = new sqlite3.Database('./project_management.db');
  const { name, description, start_date, end_date } = req.body;
  const query = `
    INSERT INTO projects (name, description, start_date, end_date)
    VALUES (?, ?, ?, ?)
  `;
  db.run(query, [name, description, start_date, end_date], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
  db.close();
});

// 更新项目
router.put('/:id', (req, res) => {
  const db = new sqlite3.Database('./project_management.db');
  const { id } = req.params;
  const { name, description, start_date, end_date } = req.body;
  const query = `
    UPDATE projects
    SET name = ?, description = ?, start_date = ?, end_date = ?
    WHERE id = ?
  `;
  db.run(query, [name, description, start_date, end_date, id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
  db.close();
});

// 删除项目
router.delete('/:id', (req, res) => {
  const db = new sqlite3.Database('./project_management.db');
  const { id } = req.params;
  db.run('DELETE FROM projects WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
  db.close();
});

module.exports = router;
