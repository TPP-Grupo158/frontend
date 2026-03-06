import { useState } from 'react';
import styles from './styles.js'
import PropTypes from 'prop-types';

import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [_error, setError] = useState('');
  const [_loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_GATEWAY_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:');
        onLoginSuccess(); // Pass the token up to App.jsx if needed
        
        navigate('/upload');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch {
      setError('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };
return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Medical Image Processor</h2>
        <p>Please sign in to continue</p>
        
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required 
        />
        
        <button type="submit" style={styles.button}>Login</button>
      </form>
    </div>
  );
}


Login.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
}

export default Login;