import NiiVue from './components/Niivue.jsx'
import { useState } from 'react';

function App() {

  const [images, setImages] = useState([]);
  const [segmentationUrl, setSegmentationUrl] = useState(null);

  const [flairFile, setFlairFile] = useState(null);
  const [bravoFile, setBravoFile] = useState(null);
  const [t1gdFile, setT1gdFile] = useState(null);
  const [t1preFile, setT1preFile] = useState(null);
  const [segmentationFile, setSegmentationFile] = useState(null);

  const onFormSubmit = (e) => {
    e.preventDefault();

    const newImagesUrls = [
      {file: flairFile, name: flairFile.name},
      {file: bravoFile, name: bravoFile.name},
      {file: t1gdFile, name: t1gdFile.name},
      {file: t1preFile, name: t1preFile.name},
    ];

    console.debug("Uploaded files:", newImagesUrls);

    setImages(newImagesUrls);
    setSegmentationUrl({ file: segmentationFile });
  }

  return (
    <>
      { images.length === 0  &&
      <form onSubmit={onFormSubmit}>
        <h2>Niivue file upload</h2>
        <label>
          Upload Flair:
          <input type="file" accept=".nii,.nii.gz" onChange={(e) => setFlairFile(e.target.files[0])} />
        </label>
        <br />
        <label>
          Upload Bravo:
          <input type="file" accept=".nii,.nii.gz" onChange={(e) => setBravoFile(e.target.files[0])} />
        </label>
        <br />
        <label>
          Upload T1 GD:
          <input type="file" accept=".nii,.nii.gz" onChange={(e) => setT1gdFile(e.target.files[0])} />
        </label>
        <br />
        <label>
          Upload T1 PRE:
          <input type="file" accept=".nii,.nii.gz" onChange={(e) => setT1preFile(e.target.files[0])} />
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
      {  images.length > 0 &&
        <NiiVue images={images} segmentationUrl={segmentationUrl} />
      }
    </>
  )
}

export default App
