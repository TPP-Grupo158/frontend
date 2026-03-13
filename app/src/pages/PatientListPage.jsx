import { useEffect, useState } from 'react';
import { usePatients } from '../hooks/usePatients';

const PatientListPage = () => {

    const [dniFilter, setDniFilter] = useState(''); //For now, only search by DNI
    const [debouncedDniFilter, setDebouncedDniFilter] = useState('');
    const { patients, error: _error, loading: _loading, fetchPatients } = usePatients();

  // Added debounce so it doesn't call the API on every keystroke
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedDniFilter(dniFilter.trim());
    }, 500); // 500ms debounce

    return () => clearTimeout(id);
  }, [dniFilter]);

  useEffect(() => {
    fetchPatients(debouncedDniFilter);
  }, [debouncedDniFilter]);


  const handleDniFilterChange = (e) => {
    setDniFilter(e.target.value);
  };

    return (
        <div>
            <h1>Patient List</h1>
            <input 
                type="text"
                placeholder="Search by DNI"
                value={dniFilter}
                onChange={handleDniFilterChange}
            />
            <table>
                <thead>
                    <tr>
                        <th>DNI</th>
                        <th>Full Name</th>
                        <th>Date of Birth</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map(patient => (
                        <tr key={patient.id}>
                            <td>{patient.dni}</td>
                            <td>{patient.fullname}</td>
                            <td>{patient.date_of_birth}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );  

}

export default PatientListPage;