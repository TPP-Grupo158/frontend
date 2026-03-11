import NiiVue from './components/Niivue/Niivue.jsx'
import Login from './components/Login.jsx'
import ImageUploadForm from './components/ImageUploadForm.jsx'
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'


function App() {
  const [_isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/upload" element={<ImageUploadForm />} />
        <Route path="/viewer" element={<NiiVue />} />
        <Route path="/" element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />} />
      </Routes>
    </Router>
  )
}

export default App
