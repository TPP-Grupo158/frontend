import NiiVue from './components/Niivue/Niivue.jsx'
import Login from './components/Login.jsx'
import Predict from './components/predictions.jsx'
import ImageUploadForm from './components/ImageUploadForm.jsx'
import Header from './components/header.jsx'

import { useState , useEffect} from 'react';
import { useUserContext } from './hooks/useUserContext.jsx'

import PatientListPage from './pages/PatientListPage.jsx'
import PatientHistoryPage from './pages/PatientHistoryPage.jsx'
import ChangePasswordPage from './pages/ChangePasswordPage.jsx'

import {
  BrowserRouter as Router,
  Routes, Route, Navigate, Outlet,
  useLocation
} from 'react-router-dom'
import UserRegistrationPage from './pages/UserRegistrationPage.jsx'

function App() {
  const [_isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route element={<Header />}>
            <Route path="/upload" element={<ImageUploadForm />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/viewer" element={<NiiVue />} />
            <Route path="/patients" element={<PatientListPage />} />
            <Route path="/patients/history" element={<PatientHistoryPage />} />
            <Route path="/users" element={<UserRegistrationPage />} />
            <Route path="/" element={<Navigate to="/patients" />} />
            <Route path="*" element={<Navigate to="/patients" />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

const ProtectedRoute = () => {
  const [isValid, setIsValid] = useState(null); // null = checking, true = ok, false = fail
  const { logout, mustChangePassword, getUserRole } = useUserContext();
  const location = useLocation();
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
          logout();
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

  if (mustChangePassword() && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  if (getUserRole() !== 'admin' && location.pathname === '/users') {
    return <Navigate to="/patients" replace />;
  }

  return <Outlet />;
};


export default App
