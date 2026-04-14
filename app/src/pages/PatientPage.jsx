import { useParams } from "react-router-dom";

const PatientPage = () => {
  const { dni } = useParams();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Patient Details</h1>
      <p>Patient ID: {dni}</p>
    </div>
  );
}

export default PatientPage;