import NiiVue from './components/Niivue/Niivue.jsx'
import Login from './components/Login.jsx'
import { useState } from 'react';

const labels = ["Label 1", "Label 2", "Label 3"];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [images, setImages] = useState([]);
  const [segmentationUrl, setSegmentationUrl] = useState(null);

  const [segmentationFile, setSegmentationFile] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const onFormSubmit = (e) => {
    e.preventDefault();
    setSegmentationUrl({ file: segmentationFile });
    setFormSubmitted(true);
  }
  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div style={styles.container}>
      { !formSubmitted &&
      <form onSubmit={onFormSubmit} style={styles.form}>
        <h2>Niivue file upload</h2>
        <label>
          upload files
          <input type="file" accept=".nii,.nii.gz" multiple onChange={(e) => {
            const files = Array.from(e.target.files);
            setImages(files.map(file => ({ file, name: file.name })));
          }} />
        </label>
        <br />
        <label>
          Upload Segmentation:
          <input type="file" accept=".nii,.nii.gz" onChange={(e) => setSegmentationFile(e.target.files[0])} />
        </label>
        <br />
        <button type="submit"  style={styles.button}>Load Files</button>
      </form>
      }
      {  formSubmitted &&
        <NiiVue images={images} segmentationUrl={segmentationUrl} labels={labels}/>
      }
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
  form: { padding: '2rem', background: 'white', borderRadius: '8px', gap: '1rem',boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', width: '300px' },
  input: { marginBottom: '1rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' },
  button: { padding: '0.7rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default App
