import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NiiVue_comp from '../components/Niivue/Niivue_comp';
import PredictionResult from '../components/PredictionResults';
import '../components/HistorialPaciente.css';

const HISTORY_TABS_VIEWER = "viewer";
const HISTORY_TABS_PREVIEW = "preview";

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
    const [activeTab, setActiveTab] = useState(HISTORY_TABS_PREVIEW);
    const [selectedStudyDoctor, setSelectedStudyDoctor] = useState("Loading...");
  
    const fetchPatientStudies = useCallback(async () => {
      if (!currentPatient?.dni || loading) return;
  
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_GATEWAY_API}patients/history/${currentPatient.dni}?page=${page}`, {
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
  
    useEffect(() => {
      if (!currentPatient) {
        navigate('/patients', { replace: true });
      } else {
        fetchPatientStudies();
      }
    }, [currentPatient, navigate, fetchPatientStudies]);

    // Effect to fetch doctor details when selected study changes
    useEffect(() => {
      const fetchDoctor = async () => {
        if (!selectedStudy?.doctor_id) {
          setSelectedStudyDoctor("Missing");
          return;
        }

        setSelectedStudyDoctor("Loading..."); // Reset status for the new study

        try {
          const response = await fetch(`${import.meta.env.VITE_GATEWAY_API}doctor/${selectedStudy.doctor_id}`, {
            method: 'GET',
            credentials: 'include'
          });

          if (!response.ok) {
            if (response.status === 404) {
              setSelectedStudyDoctor("Missing");
            } else {
              setSelectedStudyDoctor("ERROR");
            }
            return;
          }

          const data = await response.json();
          setSelectedStudyDoctor(data.fullname);
        } catch (error) {
          console.error("Failed to fetch doctor:", error);
          setSelectedStudyDoctor("ERROR");
        }
      };

      fetchDoctor();
    }, [selectedStudy?.doctor_id]); // Re-runs only when the doctor ID changes

    const handleOriginalImages = () => {
      if (!selectedStudy?.original_images) return [];
      const imageList = Object.entries(selectedStudy.original_images).map(([key, value]) => {
        return {
          url: value,
          name: key
        };
      });
      return imageList;
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
            <div className="pagination-container">
            { page > 1 &&(
                <button 
                  className="load-more-btn" 
                  onClick={() => setPage(prev => prev -1)}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Prev'}
                </button>
                )
            }
            {hasMore && (
              <button 
                className="load-more-btn" 
                onClick={() => setPage(prev => prev + 1)}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Next'}
              </button>
            )}
            </div>
            
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
                <p>{selectedStudyDoctor}</p>
              </div>
  
              <div className="report-box">
                <span className="field-label">Results</span>
                
                {selectedStudy.task_type === 'aneurysm' ? (
                  <PredictionResult data={selectedStudy.prediction_image} />
                ) : (
                  <div className="tabs-container">
                    {/* Botones de las pestañas */}
                    <div className="tabs-header">
                      <button
                        type="button"
                        className={`tab-button ${activeTab === HISTORY_TABS_VIEWER ? 'active' : ''}`}
                        onClick={() => setActiveTab(HISTORY_TABS_VIEWER)}
                      >
                        Viewer
                      </button>
                      <button
                        type="button"
                        className={`tab-button ${activeTab === HISTORY_TABS_PREVIEW ? 'active' : ''}`}
                        onClick={() => setActiveTab(HISTORY_TABS_PREVIEW)}
                      >
                        Imagen
                      </button>
                    </div>

                    {/* Contenido de las pestañas */}
                    <div className="tab-content">
                      {activeTab === HISTORY_TABS_VIEWER ? (
                        <NiiVue_comp
                          key={selectedStudy.task_type} 
                          images={handleOriginalImages()}
                          segmentationUrl={selectedStudy.prediction_image}
                          labels={[selectedStudy.task_type]} 
                        />
                      ) : (
                        <div className="image-viewer-tab">
                          {selectedStudy.visualization_image ? (
                            <img 
                              src={selectedStudy.visualization_image} 
                              alt="Visualization Study" 
                              className="tab-static-image"
                            />
                          ) : (
                            <p className="no-image-placeholder">No Image</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
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