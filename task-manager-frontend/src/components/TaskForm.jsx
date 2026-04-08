import React, { useState, useEffect } from 'react';
import { Calendar, AlignLeft, Type, Plus } from 'lucide-react';

export default function TaskForm({ onSubmit, initialData }) {
    const [task, setTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        completed: false
    });

    useEffect(() => {
        if (initialData) {
            setTask({
                ...initialData,
                dueDate: initialData.dueDate ? initialData.dueDate.substring(0, 16) : ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(task);
        if (!initialData) {
            setTask({ title: '', description: '', dueDate: '', completed: false });
        }
    };

    return (
        <div className="glass-card">
            <h2 style={{marginTop: 0}}>{initialData ? 'Edit Task' : 'Add New Task'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Task Title</label>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <Type size={18} style={{color: 'var(--text-muted)'}} />
                        <input
                            required
                            type="text"
                            name="title"
                            value={task.title}
                            onChange={handleChange}
                            className="form-input"
                            style={{flex: 1}}
                            placeholder="What needs to be done?"
                        />
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Description</label>
                    <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.5rem'}}>
                        <AlignLeft size={18} style={{color: 'var(--text-muted)', marginTop: '0.8rem'}} />
                        <textarea
                            name="description"
                            value={task.description}
                            onChange={handleChange}
                            className="form-input"
                            style={{flex: 1, minHeight: '80px', resize: 'vertical'}}
                            placeholder="Add details..."
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Due Date</label>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <Calendar size={18} style={{color: 'var(--text-muted)'}} />
                        <input
                            type="datetime-local"
                            name="dueDate"
                            value={task.dueDate}
                            onChange={handleChange}
                            className="form-input"
                            style={{flex: 1}}
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{marginTop: '1rem'}}>
                    <Plus size={20} />
                    {initialData ? 'Update Task' : 'Create Task'}
                </button>
            </form>
        </div>
    );
}
