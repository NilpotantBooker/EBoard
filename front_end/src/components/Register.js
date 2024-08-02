import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
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
      const response = await axios.post('http://localhost:3000/users/register', formData);
      localStorage.setItem('userid', response.data.id);
      alert('注册成功！');
      navigate('/login');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('注册失败，请重试！');
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">注册</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <input
          type="text"
          name="name"
          placeholder="姓名"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
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
          注册
        </button>
      </form>
      <div className="text-center">
        <Link to="/login" className="text-blue-500 hover:underline">已有账号？登录</Link>
      </div>
    </div>
  );
};

export default Register;
