import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { CheckCircle2 } from 'lucide-react';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { 
         username: username.trim(), 
         email: email.trim(), 
         password 
      });
      setSuccess('Registration successful! You can now login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
        if(err.response?.data?.message) {
            setError(err.response.data.message);
        } else if (err.response?.data) {
            // Validation errors
            const msgs = Object.values(err.response.data).join(', ');
            setError(msgs || 'Registration failed');
        } else {
            setError('Registration failed');
        }
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh'}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
        <CheckCircle2 size={48} color="var(--primary)" />
        <h1>TaskFlow</h1>
      </div>
      <div className="task-form" style={{maxWidth: '400px', width: '100%', padding: '2rem'}}>
        <h2>Create an Account</h2>
        {error && <p style={{color: 'red', marginTop: '1rem'}}>{error}</p>}
        {success && <p style={{color: 'green', marginTop: '1rem'}}>{success}</p>}
        <form onSubmit={handleRegister} style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
          <input
            type="text"
            className="input-field"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
          />
          <input
            type="email"
            className="input-field"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit" className="btn btn-primary" style={{marginTop: '1rem'}}>Register</button>
        </form>
        <p style={{marginTop: '1.5rem', textAlign: 'center'}}>
          Already have an account? <Link to="/login" style={{color: 'var(--primary)'}}>Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
