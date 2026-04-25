import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../components/styles";
import Message from "../components/Message";

import { useNavigate } from "react-router-dom";
import { getAge, formatTimestamp } from "../helpers";

const PatientPage = () => {
  const { dni } = useParams();
  const navigate = useNavigate();

  const [patientInfo, setPatientInfo] = useState(null);
  const [patientHistory, _setPatientHistory] = useState([
    {
      'id': '69de9439332f0f7ad216736f',
      'created_at': '2023-01-15T14:32:10.123Z',
      'task': 'metastasis',
      'original_images': [{url: 'http://localhost:9000/medical-images/gateway_user_001/metastasis/6c96c645-9a85-4d76-9e34-aa0b13e30ce1/input_t1.nii.gz', name: 'T1'}], 
      'prediction_image': 'http://localhost:9000/medical-images/gateway_user_001/metastasis/6c96c645-9a85-4d76-9e34-aa0b13e30ce1/prediction.nii.gz',
      'labels': ['Label 1'],
      'solicited_by': 'Dr. Smith'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [fetchPatientError, setFetchPatientError] = useState(null);

  const [isMessageVisible, setIsMessageVisible] = useState(true);

  useEffect(() => {
    
    const fetchPatientData = async () => {
      setIsLoading(true);
      setFetchPatientError(null);
      setIsMessageVisible(true);

      try {
        const response = await fetch(import.meta.env.VITE_GATEWAY_API + `patients/${dni}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setPatientInfo(data);
          setIsLoading(false);
        } else {
          setFetchPatientError('Failed to retrieve patient information');
          setIsLoading(false);
        }

        //FOR NOW, its mocked here since its not yet implemented on the backend
        // const historyResponse = await fetch(import.meta.env.VITE_GATEWAY_API + `history/${dni}`, {
        //   method: 'GET',
        //   headers: { 'Content-Type': 'application/json' },
        //   credentials: 'include'
        // });

        // if (historyResponse.ok) {
        //   const historyData = await historyResponse.json();
        //   setPatientHistory(historyData.history);
        // } else {
        //   // Handle error 
        // }
      } catch {
        setFetchPatientError('Failed to retrieve patient information. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
  
    fetchPatientData();
  }, [])

  const onViewPrediction = (prediction) => {
    navigate(`/patients/${dni}/predictions/${prediction.id}`, {
      state: { 
        images: prediction.original_images,
        segmentationUrl: prediction.prediction_image,
        labels: prediction.labels
      }
    });
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1 style={{margin: 0}}>Patient Details</h1>
      {fetchPatientError && 
      <Message isError 
      message={fetchPatientError}  
      visible={isMessageVisible}
      onClick={() => setIsMessageVisible(false)} 
      />}

      <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>General Information</h2>
        <dl style={{ display: 'grid', gridTemplateColumns: '160px 1fr', rowGap: 8, margin: 0 }}>
          <dt><b>Name</b></dt><dd data-testid="patient-name">{patientInfo?.fullname || '-'}</dd>
          <dt><b>DNI</b></dt><dd data-testid="patient-dni">{dni}</dd>
          <dt><b>Age</b></dt><dd data-testid="patient-age">{getAge(patientInfo?.date_of_birth)} ({patientInfo?.date_of_birth})</dd>
          <dt><b>Email</b></dt><dd data-testid="patient-email">{patientInfo?.email || '-'}</dd>
        </dl>
      </section>
      <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
        <h2>Patient History</h2>
        <table style={styles.table.container}>
          <colgroup>
            <col style={{ width: '15%' }} />{/* Date */}
            <col style={{ width: '10%' }} />{/* Prediction task */}
            <col style={{ width: '20%' }} />{/* Solicited By */}
            <col style={{ width: '10%' }} />{/* Actions */}
            <col style={{ width: '30%' }} />{/* Empty space for now */}
          </colgroup>
          <thead style={styles.table.header}>
            <tr>
              <th>Date</th>
              <th>Task</th>
              <th>Solicited By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patientHistory.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '16px' }}>No history available</td>
              </tr>
            )}
            {patientHistory.length !== 0 &&  (
              patientHistory.map((prediction, index) => (
              <tr key={prediction.id} style={{...styles.table.row, backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white'}}>
                <td>{formatTimestamp(prediction.created_at)}</td>
                <td>{prediction.task}</td>
                <td>{prediction.solicited_by}</td>
                <td>
                  <button style={{ padding: '4px 8px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #a4a3a3' }}
                  onClick={() => onViewPrediction(prediction)}
                  >
                    View
                  </button>
                </td>
              </tr>
              )
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default PatientPage;