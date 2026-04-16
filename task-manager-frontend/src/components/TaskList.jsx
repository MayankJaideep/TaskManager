import React from 'react';
import { Pencil, Trash2, Calendar, Check, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TaskList({ tasks, onEdit, onDelete, onToggleComplete, onApprove, onReject }) {
    const { user } = useAuth();
    const isChecker = user?.roles?.includes('ROLE_CHECKER');
    
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
    };

    const getApprovalIcon = (status) => {
        switch (status) {
            case 'APPROVED':
                return <CheckCircle size={16} color="green" />;
            case 'REJECTED':
                return <XCircle size={16} color="red" />;
            case 'PENDING':
            default:
                return <Clock size={16} color="orange" />;
        }
    };

    const getApprovalBadge = (status) => {
        const color = {
            APPROVED: 'green',
            REJECTED: 'red',
            PENDING: 'orange'
        }[status] || 'gray';
        return (
            <span className="badge" style={{ backgroundColor: `var(--${color})`, color: 'white', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }} title="Approval Status">
                Approval: {getApprovalIcon(status)} {status}
            </span>
        );
    };

    const getTaskStatusBadge = (status) => {
        const color = {
            FINISHED: 'var(--primary)',
            IN_PROGRESS: '#3498db',
            PENDING: 'gray'
        }[status] || 'gray';
        return (
            <span className="badge" style={{ backgroundColor: color, color: 'white', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }} title="Task Status">
                {status}
            </span>
        );
    };

    return (
        <div className="task-list">
            {tasks.map(task => (
                <div key={task.id} className={`glass-card task-item ${task.status === 'FINISHED' ? 'completed' : ''}`} style={{marginBottom: '0'}}>
                    
                    <label className="checkbox-wrapper">
                        <input 
                            type="checkbox" 
                            checked={task.status === 'FINISHED'} 
                            onChange={() => onToggleComplete(task)} 
                        />
                        <div className="custom-checkbox">
                            {task.status === 'FINISHED' && <Check size={14} color="white" strokeWidth={3} />}
                        </div>
                    </label>

                    <div className="task-content" style={{marginLeft: '1rem'}}>
                        <h3 className="task-title">
                            {task.title}
                            {task.ownerName && user?.roles?.includes('ROLE_ADMIN') && (
                                <span style={{fontSize: '0.8rem', color: 'var(--primary)', marginLeft: '0.5rem', fontWeight: 'normal'}}>
                                    (by {task.ownerName})
                                </span>
                            )}
                        </h3>
                        {task.description && <p className="task-desc">{task.description}</p>}
                        
                        <div className="task-meta" style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center'}}>
                            {getTaskStatusBadge(task.status)}
                            {getApprovalBadge(task.approvalStatus)}
                            {task.dueDate && (
                                <span className="badge">
                                    <Calendar size={14} />
                                    {formatDate(task.dueDate)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="task-actions" style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                        {isChecker && task.approvalStatus === 'PENDING' && (
                            <>
                                <button className="btn-icon" onClick={() => onApprove(task.id)} title="Approve Task" style={{backgroundColor: 'green', color: 'white'}}>
                                    <CheckCircle size={18} />
                                </button>
                                <button className="btn-icon" onClick={() => onReject(task.id)} title="Reject Task" style={{backgroundColor: 'red', color: 'white'}}>
                                    <XCircle size={18} />
                                </button>
                            </>
                        )}
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
