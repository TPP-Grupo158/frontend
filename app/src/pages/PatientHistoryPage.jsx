import { useState,useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NiiVue_comp from '../components/Niivue/Niivue_comp';
import PredictionResult from '../components/PredictionResults';
import '../components/HistorialPaciente.css';

const PatientHistoryPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Extracting patient data from router state
    const currentPatient = location.state?.currentPatient;
  
    // States for API data and Pagination
    const [studies, setStudies] = useState([]);
    const [selectedStudy, setSelectedStudy] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
  
    // API Call logic
    const fetchPatientStudies = useCallback(async () => {
      if (!currentPatient?.dni || loading) return;
  
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`${import.meta.env.VITE_GATEWAY_API}patients/history/${currentPatient.dni}?page=${page}`,{
            method: 'GET',
            credentials: 'include'
          });
        var data = await response.json();
  
        setHasMore(data.meta.has_next);
        setStudies(data.data);
        // Default selection for the first load
        if (page === 1 && data.data.length > 0) {
          setSelectedStudy(data.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch studies:", error);
      } finally {
        setLoading(false);
      }
    }, [currentPatient, page]);
  
    // Security Check: Redirect if accessed without patient state
    useEffect(() => {
      if (!currentPatient) {
        navigate('/patients', { replace: true });
      } else {
        fetchPatientStudies();
      }
    }, [currentPatient, navigate, fetchPatientStudies]);

    const handleOriginalImages = () => {
      const imageList = Object.entries(selectedStudy.original_images).map(([key, value]) => {
        return {
          url: value,
          name: key
        };
      });
      return imageList
    };

    if (!currentPatient) return null;
  
    return (
      <div className="history-container">
        {/* LEFT SIDEBAR: STUDY LIST */}
        <aside className="study-list-aside">
          <div className="list-header">
            <h2>{currentPatient.fullname}</h2>
            <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Medical History</p>
          </div>
  
          <div className="studies-scroll-area">
            {studies.map((study, index) => (
              <div
                key={`${study.id}-${index}`}
                className={`study-item ${selectedStudy?.id === study.id ? 'active' : ''}`}
                onClick={() => setSelectedStudy(study)}
              >
                <strong>{study.task_type}</strong>
                <p style={{ fontSize: '0.85rem', color: '#666', margin: '5px 0 0' }}>
                  {(new Date(study.created_at)).toLocaleDateString('en-GB')}
                </p>
              </div>
            ))}
  
            {hasMore && (
              <button 
                className="load-more-btn" 
                onClick={() => setPage(prev => prev + 1)}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load Older Studies'}
              </button>
            )}
          </div>
        </aside>
  
        {/* RIGHT CONTENT: STUDY DETAILS */}
        <main className="study-viewer-main">
          {selectedStudy ? (
            <div className="detail-card">
              <h1 style={{ marginTop: 0 }}>
              <p>Medical Report Details {(new Date(selectedStudy.created_at)).toLocaleDateString('en-GB')}</p>
              </h1>
              <div>
                  <span className="field-label">Doctor</span>
                  <p>{selectedStudy.doctor_id}</p>
                </div>
  
              <div className="report-box">
                <span className="field-label">Results</span>
                {selectedStudy.task_type === 'aneurysm' ? (
                  <PredictionResult data={selectedStudy.prediction_image} />
                ) : (
                  <NiiVue_comp
                    key={selectedStudy.task_type} 
                    images = {handleOriginalImages(selectedStudy.original_images)}
                    segmentationUrl={ selectedStudy.prediction_image}
                    //labels={selectedProcs} 
                  />
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '100px', color: '#999' }}>
              {loading ? 'Loading data...' : 'Select a study from the list to view details.'}
            </div>
          )}
        </main>
      </div>
    );
  };
  
  export default PatientHistoryPage;