import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

function ResetPassword() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired token.");
      setMessage('');
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh'}}>
      <div className="task-form" style={{maxWidth: '400px', width: '100%', padding: '2rem'}}>
        <h2>Enter New Password</h2>
        
        {error && <p style={{color: 'red', marginTop: '1rem'}}>{error}</p>}
        {message && <p style={{color: 'green', marginTop: '1rem'}}>{message}</p>}
        
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
          <input
            type="text"
            className="input-field"
            placeholder="Paste reset token from email/logs"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit" className="btn btn-primary">Update Password</button>
        </form>
        <p style={{marginTop: '1.5rem', textAlign: 'center'}}>
          <Link to="/login" style={{color: 'gray'}}>Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
