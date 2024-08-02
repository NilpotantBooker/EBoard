const sqlite3 = require('sqlite3').verbose();

function initDB() {
  const db = new sqlite3.Database('./project_management.db');

  db.serialize(() => {
    // 检查并创建用户表
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        info TEXT
      )
    `, (err) => {
      if (err) {
        console.error("Error creating users table:", err.message);
      } else {
        console.log("Users table already exists or created successfully.");
      }
    });

    // 检查并创建项目表
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        start_date TEXT,
        end_date TEXT
      )
    `, (err) => {
      if (err) {
        console.error("Error creating projects table:", err.message);
      } else {
        console.log("Projects table already exists or created successfully.");
      }
    });

    // 检查并创建任务表
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL,
        due_date TEXT,
        attachment TEXT,
        FOREIGN KEY(project_id) REFERENCES projects(id)
      )
    `, (err) => {
      if (err) {
        console.error("Error creating tasks table:", err.message);
      } else {
        console.log("Tasks table already exists or created successfully.");
      }
    });

    // 检查并创建评论表
    db.run(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        comment TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(task_id) REFERENCES tasks(id),
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) {
        console.error("Error creating comments table:", err.message);
      } else {
        console.log("Comments table already exists or created successfully.");
      }
    });

    console.log("Database initialization complete.");
  });

  db.close();
}

module.exports = { initDB };
