import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const NIFTI_BRAVO = "Bravo"
const NIFTI_T1 = "T1"
const NIFTI_T2 = "T2"
const NIFTI_FLAIR = "FLAIR"


const PROCEDURES_CONFIG = [
  { id: 'alzheimer', label: 'Alzheimer', files: [NIFTI_BRAVO, NIFTI_T1, NIFTI_T2, NIFTI_FLAIR] },
  { id: 'acv', label: 'ACV', files: [NIFTI_T1] },
  { id: 'metastases', label: 'Metastases', files:  [NIFTI_BRAVO, NIFTI_T1, NIFTI_T2, NIFTI_FLAIR] },
  { id: 'aneurysm', label: 'Aneurysm', files:  [NIFTI_BRAVO, NIFTI_T1, NIFTI_T2, NIFTI_FLAIR] },
];



const PredictionRequestForm = () => {
  const [selectedProcs, setSelectedProcs] = useState([]);
  const [files, setFiles] = useState({}); // { T1: File, T2: File ... }
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [responseData, setResponseData] = useState(null);
  const navigate = useNavigate();
  const handleCheckboxChange = (id) => {
    setSelectedProcs(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const requiredFiles = Array.from(new Set(
    PROCEDURES_CONFIG
      .filter(p => selectedProcs.includes(p.id))
      .flatMap(p => p.files)
  ));

  const handleFileChange = (fileType, file) => {
    setFiles(prev => ({ ...prev, [fileType]: file }));
  };

  const handleSendFiles = async () => {
  setStatus('loading'); // Trigger that right-side animation
  
  const formData = new FormData();

  // 1. Add the Booleans (PredictionRequest)
  // Even though they are booleans, FormData sends them as strings "true"/"false"
  PROCEDURES_CONFIG.forEach(proc => {
    const isSelected = selectedProcs.includes(proc.id);
    formData.append(proc.id, isSelected); 
  });

  // 2. Add the Files
  // Mapping your internal names to the backend's expected keys
  if (files[NIFTI_T1]) formData.append('file_t1', files[NIFTI_T1]);
  if (files[NIFTI_BRAVO]) formData.append('file_t1ce', files[NIFTI_BRAVO]); // Bravo -> t1ce
  if (files[NIFTI_T2]) formData.append('file_t2', files[NIFTI_T2]);
  if (files[NIFTI_FLAIR]) formData.append('file_flair', files[NIFTI_FLAIR]);
  const labels = ["Label 1", "Label 2", "Label 3"];

  try {
    const response = await fetch(import.meta.env.VITE_GATEWAY_API+"predict", {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Prediction failed');

    const result = await response.json();
    setResponseData(result.data); // Save results for the right panel
    setStatus('success');
    console.log(result.data[0].original_image);
    navigate('/viewer', { 
      state: { 
        "images":[{url: result.data[0].original_image, name: "test"}], 
        "segmentationUrl": result.data[0].prediction_image , 
        labels 
      } 
    })
  } catch (error) {
    console.error("Error uploading:", error);
    setStatus('error');
  }
};

  const isReady = selectedProcs.length > 0 && 
                  requiredFiles.every(f => files[f]);

  return (
    <div style={{ display: 'flex', gap: '40px', padding: '20px' }}>
      {/* LEFT BLOCK */}
      <div style={{ flex: 1 }}>
        <h3>1. Select Procedures</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {PROCEDURES_CONFIG.map(proc => (
            <label key={proc.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={selectedProcs.includes(proc.id)}
                onChange={() => handleCheckboxChange(proc.id)}
              />
              {proc.label}
            </label>
          ))}
        </div>

        {requiredFiles.length > 0 && (
          <>
            <h3 style={{ marginTop: '30px' }}>2. Upload Required Files</h3>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>Shared files will be used across all selected procedures.</p>
            <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
              {requiredFiles.map(fileType => (
                <div key={fileType} style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold' }}>{fileType} (.nii):</label>
                  <input 
                    type="file" 
                    accept=".nii,.nii.gz"
                    onChange={(e) => handleFileChange(fileType, e.target.files[0])} 
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <button 
          disabled={!isReady || status === 'loading'} 
          onClick={handleSendFiles}
          style={{ 
            marginTop: '20px', 
            width: '100%', 
            padding: '12px', 
            backgroundColor: isReady ? '#2ecc71' : '#ccc', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            cursor: isReady ? 'pointer' : 'not-allowed',
            fontWeight: 'bold'
          }}
        >
          {status === 'loading' ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </div>

      {/* RIGHT BLOCK */}
      <div style={{ flex: 1, borderLeft: '1px solid #eee', paddingLeft: '40px' }}>
         {/* Animation goes here */}
         <h3>Analysis Status</h3>
         <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #eee' }}>
            <p>Waiting for selection...</p>
         </div>
      </div>
    </div>
  );
};

export default PredictionRequestForm;