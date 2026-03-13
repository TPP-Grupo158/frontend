import { useEffect, useState } from 'react';

import { usePatients } from '../hooks/usePatients'
import { useDebounce } from '../hooks/useDebounce';

const DEBOUNCE_DELAY = 500; // ms


const PatientListPage = () => {

  const [dniFilter, setDniFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  const debouncedDniFilter = useDebounce(dniFilter, DEBOUNCE_DELAY);
  const debouncedNameFilter = useDebounce(nameFilter, DEBOUNCE_DELAY);
  const [currentFilters, setCurrentFilters] = useState('dni'); // 'dni' or 'name'
  
  const { patients, error: _error, loading: _loading, fetchPatients } = usePatients();

  useEffect(() => {
    fetchPatients(debouncedDniFilter, '');
  }, [debouncedDniFilter]);
  
  useEffect(() => {
    fetchPatients('', debouncedNameFilter );
  }, [debouncedNameFilter]);

    return (
        <div>
            <h1>Patient List</h1>
            <div>
              {currentFilters === 'dni' && 
                <input 
                  type="text"
                  placeholder="Search by DNI"
                  value={dniFilter}
                  onChange={(e) => setDniFilter(e.target.value)}
              />
              }
              {currentFilters === 'name' && 
                <input 
                  type="text"
                  placeholder="Search by Name"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
              />
              }
              <select value={currentFilters} onChange={(e) => setCurrentFilters(e.target.value)}>
                <option value="dni">DNI</option>
                <option value="name">Name</option>
              </select>
            </div>
            
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