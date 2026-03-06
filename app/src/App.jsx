import NiiVue from './components/Niivue/Niivue.jsx'
import Login from './components/Login.jsx'
import styles from './components/styles.js'
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes, Route, useNavigate
} from 'react-router-dom'

const labels = ["Label 1", "Label 2", "Label 3"];

const ImageUploadForm = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [segmentationFile, setSegmentationFile] = useState(null);

  const onFormSubmit = (e) => {
    e.preventDefault();

    if (!images.length) return;

    navigate('/viewer', { 
      state: { 
        images, 
        segmentationUrl: { file: segmentationFile }, 
        labels 
      } 
    });
  }

  return (
    <div style={styles.container}>
      <form onSubmit={onFormSubmit} style={styles.form}>
        <h2>Niivue file upload</h2>
        <label>
          Upload files
          <input 
            type="file" 
            accept=".nii,.nii.gz" 
            multiple 
            onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setImages(files.map(file => ({ file, name: file.name })));
            }} 
          />
        </label>
        <br />
        <label>
          Upload Segmentation:
          <input 
            type="file" 
            accept=".nii,.nii.gz" 
            onChange={(e) => setSegmentationFile(e.target.files[0])} 
            />
        </label>
        <br />
        <button type="submit"  style={styles.button}>Load Files</button>
      </form>
    </div>
  )
}

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
