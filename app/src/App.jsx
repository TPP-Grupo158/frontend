import NiiVue from './components/Niivue.jsx'
import { useState } from 'react';

function App() {

  const [images, setImages] = useState([]);
  const [segmentationUrl, setSegmentationUrl] = useState(null);

  const onFormSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const bravoFile = formData.get('bravoUpload');
    const flairFile = formData.get('flairUpload');
    const t1gdFile = formData.get('t1gdUpload');
    const t1preFile = formData.get('t1preUpload');

    //segmentation should come from server after processing the images
    const segmentationFile = formData.get('segmentationUpload');
    setSegmentationUrl({file: segmentationFile});
    
    const newImagesUrls = [
      {file: flairFile, name: flairFile.name},
      {file: bravoFile, name: bravoFile.name},
      {file: t1gdFile, name: t1gdFile.name},
      {file: t1preFile, name: t1preFile.name},
    ];

    console.log("Uploaded files:", newImagesUrls);
    setImages(newImagesUrls);
  }

  return (
    <>
      { images.length === 0  &&
      <form onSubmit={onFormSubmit}>
        <h2>Niivue file upload</h2>
        <label>
          Upload Flair:
          <input type="file" id="flairUpload" name="flairUpload" accept=".nii,.nii.gz" />
        </label>
        <br />
        <label>
          Upload Bravo:
          <input type="file" id="bravoUpload" name="bravoUpload" accept=".nii,.nii.gz" />
        </label>
        <br />
        <label>
          Upload T1 GD:
          <input type="file" id="t1gdUpload" name="t1gdUpload" accept=".nii,.nii.gz" />
        </label>
        <br />
        <label>
          Upload T1 PRE:
          <input type="file" id="t1preUpload" name="t1preUpload" accept=".nii,.nii.gz" />
        </label>
        <br />
        <label>
          Upload Segmentation:
          <input type="file" id="segmentationUpload" name="segmentationUpload" accept=".nii,.nii.gz" />
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
