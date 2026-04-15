import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../components/styles";
import Message from "../components/Message";

const PatientPage = () => {
  const { dni } = useParams();
  
  const [patientInfo, setPatientInfo] = useState(null);
  const [patientHistory, _setPatientHistory] = useState([
    {
      'id': '69de9439332f0f7ad216736f',
      'date': '2023-01-15',
      'task': 'metastasis',
      'original_image': 'http://localhost:9000/medical-images/gateway_user_001/metastasis/6c96c645-9a85-4d76-9e34-aa0b13e30ce1/input_t1.nii.gz', 
      'prediction_image': 'http://localhost:9000/medical-images/gateway_user_001/metastasis/6c96c645-9a85-4d76-9e34-aa0b13e30ce1/prediction.nii.gz',
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

  const getAge = (dateOfBirth) => {
    return Math.floor((new Date() - new Date(dateOfBirth)) / (1000 * 60 * 60 * 24 * 365.25));
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
          <dt><b>Name</b></dt><dd>{patientInfo?.fullname || '-'}</dd>
          <dt><b>DNI</b></dt><dd>{dni}</dd>
          <dt><b>Age</b></dt><dd>{getAge(patientInfo?.date_of_birth)} ({patientInfo?.date_of_birth})</dd>
          <dt><b>Email</b></dt><dd>{patientInfo?.email || '-'}</dd>
        </dl>
      </section>
      <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
        <h2>Patient History</h2>
        <table style={styles.table.container}>
          <colgroup>
            <col style={{ width: '10%' }} />{/* DNI */}
            <col style={{ width: '10%' }} />{/* Full Name */}
            <col style={{ width: '10%' }} />{/* Date of Birth */}
            <col style={{ width: '50%' }} />{/* Empty space for now */}
          </colgroup>
          <thead style={styles.table.header}>
            <tr>
              <th>Date</th>
              <th>Task</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patientHistory.map((prediction, index) => (
              <tr key={prediction.id} style={{...styles.table.row, backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white'}}>
                <td>{prediction.date}</td>
                <td>{prediction.task}</td>
                <td><button>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default PatientPage;