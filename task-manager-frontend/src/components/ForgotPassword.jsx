import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
    } catch (err) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh'}}>
      <div className="task-form" style={{maxWidth: '400px', width: '100%', padding: '2rem'}}>
        <h2>Reset Password</h2>
        <p style={{color: 'gray', fontSize: '0.9rem', margin: '1rem 0'}}>Enter your email address to request a password reset.</p>
        
        {message && <p style={{color: 'green', marginTop: '1rem', padding: '1rem', backgroundColor: '#e8f5e9', borderRadius: '4px'}}>{message}</p>}
        
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
          <input
            type="email"
            className="input-field"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">Send Reset Request</button>
        </form>
        <p style={{marginTop: '1.5rem', textAlign: 'center'}}>
            <Link to="/reset-password" style={{color: 'var(--primary)'}}>Have a token? Reset here</Link>
            <br/><br/>
            <Link to="/login" style={{color: 'gray'}}>Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
