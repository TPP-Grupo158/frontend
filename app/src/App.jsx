import NiiVue from './components/Niivue/Niivue.jsx'
import Login from './components/Login.jsx'
import Predict from './components/predictions.jsx'
import ImageUploadForm from './components/ImageUploadForm.jsx'
import { useState , useEffect} from 'react';
import {
  BrowserRouter as Router,
  Routes, Route, Navigate, Outlet
} from 'react-router-dom'

function App() {
  const [_isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/viewer" element={<NiiVue />} />
        <Route element={<ProtectedRoute />}>
            <Route path="/upload" element={<ImageUploadForm />} />
            <Route path="/" />
        </Route>
        
      </Routes>
    </Router>
  )
}

const ProtectedRoute = () => {
  const [isValid, setIsValid] = useState(null); // null = checking, true = ok, false = fail

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_GATEWAY_API + "auth", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: null,
          credentials: 'include'
        });

        if (response.ok) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsValid(false);
      }
    };

    verifyToken();
  }, []);

  if (isValid === null) {
    return <div>Verifying session...</div>; 
  }

  if (isValid === false) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};


export default App
