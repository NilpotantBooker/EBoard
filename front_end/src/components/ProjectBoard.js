import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import { useParams, Link } from 'react-router-dom';

const ProjectBoard = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);

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

  const getChartData = () => {
    const statusCount = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    return {
      title: {
        text: '任务状态分布',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: 'bottom',
      },
      series: [
        {
          name: '任务状态',
          type: 'pie',
          radius: '50%',
          data: Object.entries(statusCount).map(([status, count]) => ({
            name: status,
            value: count,
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  };

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">项目任务看板</h2>
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <ReactECharts option={getChartData()} style={{ height: '400px', width: '100%' }} />
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="border-b border-gray-200 p-4 last:border-0">
            <h3 className="text-2xl font-bold text-gray-800">{task.name}</h3>
            <p className="text-gray-700 mt-2">{task.description}</p>
            <p className="text-gray-500 mt-2">截止日期: {task.due_date}</p>
            <p className="text-gray-500 mt-2">状态: {task.status}</p>
          </li>
        ))}
      </ul>
      <Link to={`/tasks/${projectId}`}>
        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
          返回任务列表
        </button>
      </Link>
    </div>
  );
};

export default ProjectBoard;
