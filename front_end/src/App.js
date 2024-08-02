import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import TaskList from './components/TaskList';
import CommentList from './components/CommentList';
import ProjectBoard from './components/ProjectBoard';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks/:projectId" element={<TaskList />} />
          <Route path="/comments/:taskId" element={<CommentList />} />
          <Route path="/board/:projectId" element={<ProjectBoard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
