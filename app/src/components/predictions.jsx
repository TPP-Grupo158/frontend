import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import styles from './styles.js'

const PROCEDURES_CONFIG = [
  { id: 'alzheimer', label: 'Alzheimer', files: ['Bravo', 'T1', 'T2', 'FLAIR'] },
  { id: 'acv', label: 'ACV', files: ['T1'] },
  { id: 'metastases', label: 'Metastases', files: ['Bravo', 'T1', 'T2', 'FLAIR'] },
  { id: 'aneurysm', label: 'Aneurysm', files: ['Bravo', 'T1', 'T2', 'FLAIR'] },
];

const PredictionRequestForm = () => {
  const [selectedProcs, setSelectedProcs] = useState([]);
  const [files, setFiles] = useState({}); // { T1: File, T2: File ... }

  const handleCheckboxChange = (id) => {
    setSelectedProcs(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  // 1. Determine the UNIQUE set of files required by current selections
  const requiredFiles = Array.from(new Set(
    PROCEDURES_CONFIG
      .filter(p => selectedProcs.includes(p.id))
      .flatMap(p => p.files)
  ));

  const handleFileChange = (fileType, file) => {
    setFiles(prev => ({ ...prev, [fileType]: file }));
  };

  // 2. Validation: Check if all required unique files are uploaded
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
          disabled={!isReady} 
          style={{ marginTop: '20px', width: '100%', padding: '10px', backgroundColor: isReady ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Run Analysis
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