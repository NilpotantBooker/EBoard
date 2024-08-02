const express = require('express');
const bodyParser = require('body-parser');
const { initDB } = require('./init_db');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 初始化数据库
initDB();

// 项目路由
app.use('/projects', projectRoutes);

// 任务路由
app.use('/tasks', taskRoutes);

// 评论路由
app.use('/comments', commentRoutes);

// 用户路由
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
