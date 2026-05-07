import { useState } from 'react';
import NiiVue_comp from './Niivue/Niivue_comp';
import PredictionResult from './PredictionResults';
const NIFTI_BRAVO = "Bravo"
const NIFTI_T1 = "T1"
const NIFTI_T2 = "T2"
const NIFTI_FLAIR = "FLAIR"


const PROCEDURES_CONFIG = [
  { id: 'alzheimer', label: 'Alzheimer', files: [NIFTI_BRAVO, NIFTI_T1, NIFTI_T2, NIFTI_FLAIR] },
  { id: 'acv', label: 'ACV', files: [NIFTI_T1] },
  { id: 'metastases', label: 'Metastases', files:  [NIFTI_BRAVO, NIFTI_T1, NIFTI_T2, NIFTI_FLAIR] },
  { id: 'aneurysm', label: 'Aneurysm', files:  [NIFTI_T1] },
];



const PredictionRequestForm = () => {
  const [selectedProcs, setSelectedProcs] = useState([]);
  const [files, setFiles] = useState({}); // { T1: File, T2: File ... }
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [task, setTask] =useState('idle')
  const [responseData, setResponseData] = useState({});
  const [dniError, setDniError] = useState("");
  const [dniInput, setDniInput] = useState('');
  const [apiData, setApiData] = useState(null);
  const handleCheckboxChange = (id) => {
    console.log(apiData)
    setSelectedProcs(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };
  const fetchPatientData = async (dni) => {
    try {
      const response = await fetch(import.meta.env.VITE_GATEWAY_API+"patients/"+ dni, {
        method: 'GET',
        credentials: 'include'
      });  
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 404) {
          setDniError("Patient not found");
        } else if (response.status === 500) {
          setDniError("Server error. Please try again later");
        } else {
          setDniError(`Error: ${response.status}`);
        }
        
        setApiData(null);
        return;
      }
      setApiData(data);
    } catch (error) {
      console.error("Error al traer datos:", error);
      setDniError("Error while fetching patient")
      setApiData(null);
  }};
  const handleDniChange = () => {
    const onlyDigits = dniInput.replace(/\D/g, '');
    if (onlyDigits.length >= 7) {
      console.log(onlyDigits.length )
      fetchPatientData(onlyDigits);
    }else{
      setDniError("DNI must be 7 digits")
    }
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
  formData.append("patient", apiData.dni); 

  try {
    const response = await fetch(import.meta.env.VITE_GATEWAY_API+"predict", {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Prediction failed');

    const result = await response.json();
    await setResponseData(result.data);
    setTask(Object.keys(responseData)[0])
    console.log(task);
    setStatus('success');
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
      {/* ESTADO 1: Elegir paciente*/}
      {apiData === null &&(
        <div style={{ flex: 1, minWidth: '250px' }}>
        <h3>1. Select Patient</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text"
            inputMode="numeric"
            placeholder="Search by DNI"
            value={dniInput} // Usamos el estado temporal
            onChange={(e) => setDniInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleDniChange();
            }} // Opcional: buscar al presionar Enter
          />
          <button onClick={handleDniChange}>
            Search
          </button>
        </div>
        {dniError && <p style={{ color: 'red', fontSize: '12px' }}>{dniError}</p>}
      </div>)
      }
      {/* ESTADO 2: Agregar files */}
      {apiData !== null &&
      <div style={{ flex: 1,  minWidth: '250px' }}>
        <h3>1. Select Procedures</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {PROCEDURES_CONFIG.map(proc => (
            <label key={proc.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
              <input 
                type="radio"
                name="procedure-group"
                checked={selectedProcs === proc.id} 
                onChange={() => setSelectedProcs(proc.id)} 
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
             {/*Botones para cambiar que resultado se quiere ver*/}
       {status === 'success' && responseData && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>Available Results:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {Object.keys(responseData)
              .filter(key => responseData[key] !== null && key !== 'status') 
              .map(res => (
                <button 
                  key={res} 
                  onClick={() => setTask(res)} 
                  style={{ 
                    padding: '10px', 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    backgroundColor: task === res ? '#2ecc71' : '#f8f9fa',
                    color: task === res ? 'white' : 'black',
                    border: '1px solid #ddd',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}
                >
                  {res}
                </button>
            ))}
          </div>
        </div>
      )}
      </div>
      }

      {/* RIGHT BLOCK */}
      <div style={{ 
        flex: 4, 
        borderLeft: '1px solid #eee', 
        paddingLeft: '40px',
        display: 'flex', 
        flexDirection: 'column' 
      }}>
         <h3>Analysis results</h3>
         
         <div style={{ 
            flex:1,
            height: '700px', 
            background: '#fff',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderRadius: '12px',
            overflow: 'hidden' 
         }}>
            {/* ESTADO 1: Esperando */}
            {status === 'idle' && <p style={{color: '#000'}}>Select Studies and press Run Analysis</p>}

            {/* ESTADO 2: Cargando */}
            {status === 'loading' && <p style={{color: '#000'}}>Processing studies please wait...</p>}

            {/* ESTADO 3: Éxito*/}
            {status === 'success' && responseData &&task && responseData[task] &&(
              <>
                {task === 'aneurysm' ? (
                  <PredictionResult data={responseData[task].prediction_result} />
                ) : (
                  <NiiVue_comp
                    key={task} 
                    images={[{ url: responseData[task].original_image, name: "test" }]}
                    segmentationUrl={responseData[task].prediction_image}
                    labels={selectedProcs} 
                  />
                )}
              </>
            )}

            {/* ESTADO 4: Error */}
            {status === 'error' && <p style={{color: '#ff4d4d'}}>Error while precessing images</p>}
         </div>
      </div>
    </div>
  );
};

export default PredictionRequestForm;