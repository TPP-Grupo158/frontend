import { useEffect, useState } from 'react';

import { usePatients } from '../hooks/usePatients'
import { useDebounce } from '../hooks/useDebounce';

import styles from '../components/styles';

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

  const handleDniChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    setDniFilter(onlyDigits);
  };

  const handleNameChange = (e) => {
    const onlyLetters = e.target.value.replace(/[^\p{L}\s'-]/gu, '');
    setNameFilter(onlyLetters);
  }

    return (
      <div style={{padding: '0% 5%', display: 'flex', flexDirection: 'column'}}> 
        <h1 style={{margin: '0 0 16px 0' }}>Patient Search</h1>
        <div>
          <div style={{display: 'flex', gap: '0.5rem', marginBottom: '4px'}}>
            {currentFilters === 'dni' && 
              <input 
                type="text"
                inputMode="numeric"
                placeholder="Search by DNI"
                value={dniFilter}
                onChange={(e) => handleDniChange(e)}
            />
            }
            {currentFilters === 'name' && 
              <input 
                type="text"
                placeholder="Search by Name"
                value={nameFilter}
                onChange={(e) => handleNameChange(e)}
            />
            }
            <select value={currentFilters} onChange={(e) => setCurrentFilters(e.target.value)}>
              <option value="dni">DNI</option>
              <option value="name">Name</option>
            </select>
          </div>
          <table style={styles.table.container}>
            <colgroup>
              <col style={{ width: '20%' }} />{/* DNI */}
              <col style={{ width: '50%' }} />{/* Full Name */}
              <col style={{ width: '20%' }} />{/* Date of Birth */}
            </colgroup>
            <thead style={styles.table.header}>
              <tr>
                <th>DNI</th>
                <th>Full Name</th>
                <th>Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {patients.length !== 0 && patients.map((patient, index) => (
                <tr key={patient.id} style={{...styles.table.row, backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white'}}>
                  <td>{patient.dni}</td>
                  <td>{patient.fullname}</td>
                  <td>{patient.date_of_birth}</td>
                </tr>
              ))}
              { patients.length === 0 && 
              <tr>
                <td></td>
                <td style={{textAlign: 'center'}}>No patients found.</td>
                <td></td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    );  

}

export default PatientListPage;