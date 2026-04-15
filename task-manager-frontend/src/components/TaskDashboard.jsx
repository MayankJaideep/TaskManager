import React, { useState, useEffect } from 'react';
import api, { setupAxiosInterceptors } from '../api/axiosConfig';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { CheckCircle2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function TaskDashboard() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const { user, token, setToken, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Setup axios interceptors once we're in the dashboard and have access to the context functions
    setupAxiosInterceptors(() => token, setToken, () => {
        logout();
        navigate('/login');
    });
  }, [token, setToken, logout, navigate]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateOrUpdate = async (taskData) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, taskData);
        setEditingTask(null);
      } else {
        await api.post('/tasks', taskData);
      }
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await api.put(`/tasks/${task.id}`, updatedTask);
      fetchTasks();
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  const handleLogout = async () => {
      await logout();
      navigate('/login');
  };

  return (
    <>
      <header className="header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: '1rem'}}>
            <CheckCircle2 size={48} color="var(--primary)" />
            <h1>TaskFlow</h1>
          </div>
          <p>Welcome back, {user?.username}!</p>
        </div>
        <button onClick={handleLogout} className="btn" style={{backgroundColor: '#e74c3c', display: 'flex', gap: '0.5rem'}}>
          <LogOut size={16} /> Logout
        </button>
      </header>

      <main>
        <TaskForm 
          onSubmit={handleCreateOrUpdate} 
          initialData={editingTask} 
        />
        
        <h2 style={{marginTop: '3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          Your Tasks
          <span style={{fontSize: '0.9rem', padding: '0.2rem 0.6rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '1rem'}}>
            {tasks.length}
          </span>
        </h2>
        
        <TaskList 
          tasks={tasks} 
          onEdit={(t) => setEditingTask(t)} 
          onDelete={handleDelete}
          onToggleComplete={handleToggleComplete}
        />
      </main>
    </>
  );
}

export default TaskDashboard;
