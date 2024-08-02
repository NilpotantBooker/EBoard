import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    status: 'pending',
    due_date: '',
    attachment: null,
  });
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/tasks/project/${projectId}`);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewTask({ ...newTask, attachment: e.target.files[0] });
  };

  const createTask = async () => {
    try {
      const formData = new FormData();
      formData.append('project_id', projectId);
      formData.append('name', newTask.name);
      formData.append('description', newTask.description);
      formData.append('status', newTask.status);
      formData.append('due_date', newTask.due_date);
      if (newTask.attachment) {
        formData.append('attachment', newTask.attachment);
      }

      await axios.post('http://localhost:3000/tasks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchTasks(); // refresh tasks to reflect new task
      setNewTask({ name: '', description: '', status: 'pending', due_date: '', attachment: null });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${taskId}`);
      fetchTasks(); // refresh tasks to reflect deletion
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const navigateToComments = (taskId) => {
    navigate(`/comments/${taskId}`);
  };

  const navigateToBoard = () => {
    navigate(`/board/${projectId}`);
  };

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">任务列表</h2>
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">创建新任务</h3>
        <input
          type="text"
          name="name"
          placeholder="任务名称"
          value={newTask.name}
          onChange={handleTaskInputChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <textarea
          name="description"
          placeholder="任务描述"
          value={newTask.description}
          onChange={handleTaskInputChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="date"
          name="due_date"
          placeholder="截止日期"
          value={newTask.due_date}
          onChange={handleTaskInputChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="file"
          name="attachment"
          onChange={handleFileChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={createTask}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          创建任务
        </button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="border-b border-gray-200 p-4 last:border-0">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{task.name}</h3>
                <p className="text-gray-700 mt-2">{task.description}</p>
                <p className="text-gray-500 mt-2">截止日期: {task.due_date}</p>
                <p className="text-gray-500 mt-2">状态: {task.status}</p>
                {task.attachment && (
                  <a
                    href={`http://localhost:3000/uploads/${task.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    查看附件
                  </a>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigateToComments(task.id)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  查看评论
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  删除
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={navigateToBoard}
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 mr-4"
      >
        查看看板
      </button>
      <Link to="/">
        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
          返回项目列表
        </button>
      </Link>
    </div>
  );
};

export default TaskList;
