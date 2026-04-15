import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2 } from 'lucide-react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      login(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh'}}>
      <div style={{display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
        <CheckCircle2 size={48} color="var(--primary)" />
        <h1>TaskFlow</h1>
      </div>
      <div className="task-form" style={{maxWidth: '400px', width: '100%', padding: '2rem'}}>
        <h2>Login</h2>
        {error && <p style={{color: 'red', marginTop: '1rem'}}>{error}</p>}
        <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
          <input
            type="text"
            className="input-field"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" style={{marginTop: '1rem'}}>Login</button>
        </form>
        <div style={{marginTop: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <p>Don't have an account? <Link to="/register" style={{color: 'var(--primary)'}}>Register here</Link></p>
            <p><Link to="/forgot-password" style={{color: 'var(--primary)', fontSize: '0.9rem'}}>Forgot Password?</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
