import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { taskId } = useParams();

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/comments/task/${taskId}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentInputChange = (e) => {
    setNewComment(e.target.value);
  };

  const createComment = async () => {
    try {
      const comment = {
        task_id: taskId,
        user_id: 1, // 假设 user_id 为 1，请根据实际情况修改
        comment: newComment,
        created_at: new Date().toISOString()
      };
      await axios.post('http://localhost:3000/comments', comment);
      fetchComments(); // refresh comments to reflect new comment
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">评论列表</h2>
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">提交新评论</h3>
        <textarea
          name="comment"
          placeholder="输入你的评论"
          value={newComment}
          onChange={handleCommentInputChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={createComment}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          提交评论
        </button>
      </div>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className="border-b border-gray-200 p-4 last:border-0">
            <p className="text-gray-700">{comment.comment}</p>
            <p className="text-gray-500 mt-2">评论时间: {comment.created_at}</p>
          </li>
        ))}
      </ul>
      <Link to={`/tasks/${taskId}`}>
        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
          返回任务列表
        </button>
      </Link>
    </div>
  );
};

export default CommentList;
