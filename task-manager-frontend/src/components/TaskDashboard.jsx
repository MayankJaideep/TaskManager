import React, { useState, useEffect } from 'react';
import api, { setupAxiosInterceptors } from '../api/axiosConfig';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { CheckCircle2, LogOut, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
      const isAdmin = user?.roles?.includes('ROLE_ADMIN');
      const endpoint = isAdmin ? '/admin/tasks' : '/tasks';
      const response = await api.get(`${endpoint}?page=0&size=20`);
      setTasks(response.data.content || []);
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
        console.log("Updating task:", editingTask);

        const payload = {
          title: taskData.title,
          description: taskData.description,
          status: taskData.status
        };

        const res = await api.put(
          `/tasks/${editingTask.id}`,
          payload
        );

        console.log("Updated:", res.data);
        setEditingTask(null);
      } else {
        await api.post('/tasks', taskData);
      }
      fetchTasks();
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
    }
  };

  const handleApprove = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}/approve`);
      fetchTasks();
    } catch (error) {
      console.error("Error approving task:", error);
    }
  };

  const handleReject = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}/reject`);
      fetchTasks();
    } catch (error) {
      console.error("Error rejecting task:", error);
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
      const payload = {
        title: task.title,
        description: task.description,
        status: task.status === 'FINISHED' ? 'PENDING' : 'FINISHED'
      };
      await api.put(`/tasks/${task.id}`, payload);
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
          <p>Welcome back, {user?.username}! {user?.roles?.includes('ROLE_ADMIN') && <span style={{fontSize: '0.8rem', backgroundColor: '#e74c3c', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px'}}>Admin</span>}</p>
        </div>
        <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
          {user?.roles?.includes('ROLE_CHECKER') && (
            <Link to="/pending" className="btn" style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <ClipboardList size={16} /> Pending
            </Link>
          )}
          <button onClick={handleLogout} className="btn" style={{backgroundColor: '#e74c3c', display: 'flex', gap: '0.5rem'}}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main>
        {(!user?.roles?.includes('ROLE_ADMIN') || editingTask) && (
          <TaskForm 
            onSubmit={handleCreateOrUpdate} 
            initialData={editingTask} 
          />
        )}
        
        <h2 style={{marginTop: '3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          {user?.roles?.includes('ROLE_ADMIN') ? 'All Tasks' : 'Your Tasks'}
          <span style={{fontSize: '0.9rem', padding: '0.2rem 0.6rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '1rem'}}>
            {tasks.length}
          </span>
        </h2>
        
        <TaskList 
          tasks={tasks} 
          onEdit={(t) => setEditingTask(t)} 
          onDelete={handleDelete}
          onToggleComplete={handleToggleComplete}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </main>
    </>
  );
}

export default TaskDashboard;
