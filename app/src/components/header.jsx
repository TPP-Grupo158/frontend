import { Link, Outlet } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';

import LogoutButton from './LogoutButton';

const Header = () => {
  const { getUserRole, logout } = useUserContext();
    const navigate = useNavigate();
  
    const handle_logout = async () => {
  
      try {
        const response = await fetch(import.meta.env.VITE_GATEWAY_API + "logout", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: null,
          credentials: 'include'
        });
  
        if (response.ok) {
          logout();
          navigate('/login');
        } else {
          console.error('Logout failed.');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header / Dashboard */}
      <nav style={styles.nav}>
        <ul style={styles.links}>
          <li><Link to="/patients" style={styles.link}>Patients</Link></li>
          <li><Link to="/predict" style={styles.link}>Predict</Link></li>
          {getUserRole() === 'admin' && <li><Link to="/users" style={styles.link}>Users</Link></li>}
        </ul>
        <LogoutButton 
        style={{ 
          ...styles.link,
          border: 'none',
          background: 'transparent', 
          padding: '4px',
        }}
        onClick={handle_logout}
        />
      </nav>

      <main style={{ padding: '20px', flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  nav: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '1rem 2rem', 
    background: '#007bff', 
    color: 'white',
    alignItems: 'center'
  },
  links: { display: 'flex', listStyle: 'none', gap: '20px', margin: 0 },
  link: { color: 'white', textDecoration: 'none', fontWeight: 'bold' },
};

export default Header;