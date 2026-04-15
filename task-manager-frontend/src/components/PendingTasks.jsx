import React, { useState, useEffect } from 'react';
import api, { setupAxiosInterceptors } from '../api/axiosConfig';
import TaskList from './TaskList';
import { useAuth } from '../context/AuthContext';

export default function PendingTasks() {
  const [tasks, setTasks] = useState([]);
  const { user, token, setToken, logout } = useAuth();

  useEffect(() => {
    setupAxiosInterceptors(() => token, setToken, () => {
      logout();
    });
  }, [token, setToken, logout]);

  const fetchPending = async () => {
    try {
      const response = await api.get('/tasks/pending?page=0&size=20');
      setTasks(response.data.content || []);
    } catch (error) {
      console.error("Error fetching pending tasks:", error);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}/approve`);
      fetchPending();
    } catch (error) {
      console.error("Error approving task:", error);
    }
  };

  const handleReject = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}/reject`);
      fetchPending();
    } catch (error) {
      console.error("Error rejecting task:", error);
    }
  };

  return (
    <div className="glass-card">
      <h2>Pending Tasks (Checker View)</h2>
      <TaskList
        tasks={tasks}
        onEdit={null}
        onDelete={null}
        onToggleComplete={null}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
