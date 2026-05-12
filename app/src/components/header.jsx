import { Link, Outlet } from 'react-router-dom';

const Header = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header / Dashboard */}
      <nav style={styles.nav}>
        <ul style={styles.links}>
          <li><Link to="/patients" style={styles.link}>Patients</Link></li>
          <li><Link to="/upload" style={styles.link}>Upload Image</Link></li>
          <li><Link to="/predict" style={styles.link}>Predict</Link></li>
        </ul>
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