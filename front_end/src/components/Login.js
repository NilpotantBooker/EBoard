import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users/login', formData);
      localStorage.setItem('userid', response.data.id);
      alert('登录成功！');
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('登录失败，请重试！');
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">登录</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <input
          type="email"
          name="email"
          placeholder="邮箱"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="密码"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          登录
        </button>
      </form>
      <div className="text-center">
        <Link to="/register" className="text-blue-500 hover:underline">没有账号？注册</Link>
      </div>
    </div>
  );
};

export default Login;
