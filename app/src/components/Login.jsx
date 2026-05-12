import { useState, useEffect } from 'react';
import styles from './styles.js'
import PropTypes from 'prop-types';
import Message from './Message.jsx';

import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [_loading, setLoading] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_GATEWAY_API + "auth", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: null,
          credentials: 'include'
        });

        if (response.ok) {
          onLoginSuccess(); // Pass the token up to App.jsx if needed
          navigate('/patients');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setIsErrorVisible(false);

    try {
      const response = await fetch(import.meta.env.VITE_GATEWAY_API + "login", {
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
        
        navigate('/patients');
      } else {
        setError(data.message || 'Invalid credentials');
        setIsErrorVisible(true);
      }
    } catch {
      setError('Could not connect to the server.');
      setIsErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <h2>Medical Image Processor</h2>
          <p>Please sign in to continue</p>
          {error && (
            <Message isError message={error} visible={isErrorVisible} onClick={() => setIsErrorVisible(false)}/>
          )}
        </div>
        
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