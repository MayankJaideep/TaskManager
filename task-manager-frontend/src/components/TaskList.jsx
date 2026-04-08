import React from 'react';
import { Pencil, Trash2, Calendar, Check } from 'lucide-react';

export default function TaskList({ tasks, onEdit, onDelete, onToggleComplete }) {
    
    if (tasks.length === 0) {
        return (
            <div className="glass-card" style={{textAlign: 'center', padding: '3rem 1rem'}}>
                <p style={{color: 'var(--text-muted)'}}>No tasks yet. Create one above to get started!</p>
            </div>
        );
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleString();
    }

    return (
        <div className="task-list">
            {tasks.map(task => (
                <div key={task.id} className={`glass-card task-item ${task.completed ? 'completed' : ''}`} style={{marginBottom: '0'}}>
                    
                    <label className="checkbox-wrapper">
                        <input 
                            type="checkbox" 
                            checked={task.completed} 
                            onChange={() => onToggleComplete(task)} 
                        />
                        <div className="custom-checkbox">
                            {task.completed && <Check size={14} color="white" strokeWidth={3} />}
                        </div>
                    </label>

                    <div className="task-content" style={{marginLeft: '1rem'}}>
                        <h3 className="task-title">{task.title}</h3>
                        {task.description && <p className="task-desc">{task.description}</p>}
                        
                        <div className="task-meta">
                            {task.dueDate && (
                                <span className="badge">
                                    <Calendar size={14} />
                                    {formatDate(task.dueDate)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="task-actions">
                        <button className="btn-icon" onClick={() => onEdit(task)} title="Edit Task">
                            <Pencil size={18} />
                        </button>
                        <button className="btn-icon danger" onClick={() => onDelete(task.id)} title="Delete Task">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
