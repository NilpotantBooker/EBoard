const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// 获取所有任务
router.get('/', (req, res) => {
  const db = new sqlite3.Database('./project_management.db');
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ tasks: rows });
  });
  db.close();
});

// 获取指定任务
router.get('/:id', (req, res) => {
  const db = new sqlite3.Database('./project_management.db');
  const { id } = req.params;
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ task: row });
  });
  db.close();
});

// 获取指定项目的所有任务
router.get('/project/:projectId', (req, res) => {
  const db = new sqlite3.Database('./project_management.db');
  const { projectId } = req.params;
  db.all('SELECT * FROM tasks WHERE project_id = ?', [projectId], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ tasks: rows });
  });
  db.close();
});

// 创建新任务
router.post('/', upload.single('attachment'), (req, res) => {
  const db = new sqlite3.Database('./project_management.db');
  const { project_id, name, description, status, due_date } = req.body;
  const attachment = req.file ? req.file.filename : null;
  const query = `
    INSERT INTO tasks (project_id, name, description, status, due_date, attachment)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.run(query, [project_id, name, description, status, due_date, attachment], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
  db.close();
});

// 更新任务
router.put('/:id', upload.single('attachment'), (req, res) => {
  const db = new sqlite3.Database('./project_management.db');
  const { id } = req.params;
  const { project_id, name, description, status, due_date } = req.body;
  const attachment = req.file ? req.file.filename : req.body.attachment;
  const query = `
    UPDATE tasks
    SET project_id = ?, name = ?, description = ?, status = ?, due_date = ?, attachment = ?
    WHERE id = ?
  `;
  db.run(query, [project_id, name, description, status, due_date, attachment, id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
  db.close();
});

// 删除任务
router.delete('/:id', (req, res) => {
  const db = new sqlite3.Database('./project_management.db');
  const { id } = req.params;
  db.get('SELECT attachment FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (row.attachment) {
      fs.unlink(path.join(__dirname, '../uploads', row.attachment), (err) => {
        if (err) console.error('Error deleting attachment:', err.message);
      });
    }
    db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ changes: this.changes });
    });
    db.close();
  });
});

module.exports = router;
