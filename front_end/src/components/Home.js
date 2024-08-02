import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/projects');
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const createProject = async () => {
    try {
      await axios.post('http://localhost:3000/projects', newProject);
      fetchProjects();
      setNewProject({ name: '', description: '', start_date: '', end_date: '' });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Eboard</h1>
      
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">创建新项目</h2>
        <input
          type="text"
          name="name"
          placeholder="项目名称"
          value={newProject.name}
          onChange={handleProjectInputChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <textarea
          name="description"
          placeholder="项目描述"
          value={newProject.description}
          onChange={handleProjectInputChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="date"
          name="start_date"
          placeholder="开始日期"
          value={newProject.start_date}
          onChange={handleProjectInputChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="date"
          name="end_date"
          placeholder="截止日期"
          value={newProject.end_date}
          onChange={handleProjectInputChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={createProject}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          创建项目
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">项目列表</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id} className="border-b border-gray-200 p-4 last:border-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{project.name}</h3>
                  <p className="text-gray-700 mt-2">{project.description}</p>
                  <p className="text-gray-500 mt-2">开始日期: {project.start_date}</p>
                  <p className="text-gray-500 mt-2">截止日期: {project.end_date}</p>
                </div>
                <div className="flex space-x-2">
                  <Link to={`/tasks/${project.id}`}>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
                      任务列表
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    删除
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
