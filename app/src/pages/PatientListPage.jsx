import { useEffect, useState } from 'react';
import { usePatients } from '../hooks/usePatients';
import { useDebounce } from '../hooks/useDebounce';

const DELAY = 500; // ms

const PatientListPage = () => {

  const [dniFilter, setDniFilter] = useState(''); //For now, only search by DNI
  const debouncedDniFilter = useDebounce(dniFilter, DELAY);
  const { patients, error: _error, loading: _loading, fetchPatients } = usePatients();

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
            {patients.length !== 0 && 
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
            }
            { patients.length === 0 && <p>No patients found.</p> }
        </div>
    );  

}

export default PatientListPage;