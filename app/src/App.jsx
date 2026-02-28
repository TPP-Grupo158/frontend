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
    <>
      { !formSubmitted &&
      <form onSubmit={onFormSubmit}>
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
        <button type="submit">Load Files</button>
      </form>
      }
      {  formSubmitted &&
        <NiiVue images={images} segmentationUrl={segmentationUrl} labels={labels}/>
      }
    </>
  )
}

export default App
