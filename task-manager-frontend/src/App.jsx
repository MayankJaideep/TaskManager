import React, { useState, useEffect } from 'react';
import api from './api/axiosConfig';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { CheckCircle2 } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await api.get('');
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
        await api.put(`/${editingTask.id}`, taskData);
        setEditingTask(null);
      } else {
        await api.post('', taskData);
      }
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      await api.put(`/${task.id}`, updatedTask);
      fetchTasks();
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div style={{display: 'inline-flex', alignItems: 'center', gap: '1rem'}}>
          <CheckCircle2 size={48} color="var(--primary)" />
          <h1>TaskFlow</h1>
        </div>
        <p>Your intelligent, reactive task manager.</p>
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
    </div>
  );
}

export default App;
