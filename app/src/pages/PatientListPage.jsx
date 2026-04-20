import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { usePatients } from '../hooks/usePatients'
import { useDebounce } from '../hooks/useDebounce';

import Overlay from '../components/Overlay';
import styles from '../components/styles';
import PatientForm from '../components/PatientForm';
import Message from '../components/Message';

import { sanitizeNameInput } from '../helpers';

const DEBOUNCE_DELAY = 500; // ms
const ITEMS_PER_PAGE = 10;

const PatientListPage = () => {
  const navigate = useNavigate();

  const [dniFilter, setDniFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  const debouncedDniFilter = useDebounce(dniFilter, DEBOUNCE_DELAY);
  const debouncedNameFilter = useDebounce(nameFilter, DEBOUNCE_DELAY);
  const [currentFilters, setCurrentFilters] = useState('dni'); // 'dni' or 'name'

  const [isComposingName, setIsComposingName] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const [createPatientShowForm, setCreatePatientShowForm] = useState(false);
  
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const { 
    patients, 
    hasMorePages, 
    error, 
    fetchPatients, 
    createPatient 
  } = usePatients();
  
  useEffect(() => {
    setCurrentPageNumber(1);
    if (currentFilters === 'dni') {
      setNameFilter('');
    } else if (currentFilters === 'name') {
      setDniFilter('');
    }
  }, [currentFilters]);

  useEffect(() => {
    setCurrentPageNumber(1);
    setSuccessMessage('');
    setIsMessageVisible(true);
    if (currentFilters === 'dni') {
      fetchPatients(debouncedDniFilter, '');
    } else if (currentFilters === 'name' && !isComposingName) {
      fetchPatients('', debouncedNameFilter, 0, ITEMS_PER_PAGE);
    }
  }, [debouncedDniFilter, debouncedNameFilter]);

  const handleDniChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    setDniFilter(onlyDigits);
  };

  const handleNameChange = (e) => {
    if (isComposingName) {
      setNameFilter(e.target.value);
      return;
    }
    setNameFilter(sanitizeNameInput(e.target.value));
  }

  const handlePageChange = async (newPageNumber) => {
    const offset = (newPageNumber - 1) * ITEMS_PER_PAGE;
    setSuccessMessage('');
    if (currentFilters === 'dni') {
      await fetchPatients(debouncedDniFilter, '', offset, ITEMS_PER_PAGE);
    } else if (currentFilters === 'name') {
      await fetchPatients('', debouncedNameFilter, offset, ITEMS_PER_PAGE);
    }
    setCurrentPageNumber(newPageNumber);
    setIsMessageVisible(true);
  }

  const handlePatientCreation = async ({ email, fullname, dni, dateOfBirth }) => {

    const sanitizedFullname = sanitizeNameInput(fullname);
    const response = await createPatient(sanitizedFullname, dni, email, dateOfBirth);
    setIsMessageVisible(true);
    if (response.error?.status_code === 409) {
      return;
    }

    if (!response.error?.status_code) {
      setSuccessMessage('Patient created successfully.');
    }
    setCreatePatientShowForm(false);
  }

  const handleMessageClose = () => {
    setIsMessageVisible(false);
    setSuccessMessage('');
  }

    return (
      <div style={{padding: '0% 5%', display: 'flex', flexDirection: 'column'}}> 
        <h1 style={{margin: '0 0 16px 0' }}>Patient Search</h1>
        <div>
          <Message
            isError={!!error?.status_code}
            message={error?.message || successMessage}
            visible={isMessageVisible && !!error}
            onClick={handleMessageClose}
          />
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
                onCompositionStart={() => setIsComposingName(true)}
                onCompositionEnd={() => {
                  setIsComposingName(false);
                  setNameFilter(sanitizeNameInput(nameFilter));
                }}
            />
            }
            <select value={currentFilters} onChange={(e) => setCurrentFilters(e.target.value)}>
              <option value="dni">DNI</option>
              <option value="name">Name</option>
            </select>
            <button style={{ marginLeft: 'auto', padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #a4a3a3' }} 
              onClick={() => setCreatePatientShowForm(true)}
            >
              New Patient
            </button>
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
                <tr key={patient.dni} style={{...styles.table.row, backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white'}}>
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
              {
                Array( patients.length !== 0 ? ITEMS_PER_PAGE - patients.length : ITEMS_PER_PAGE-1).fill().map((_, index) => (
                  <tr key={`empty-${index}`} style={{...styles.table.row, backgroundColor: 'white'}}>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center', marginTop: '16px'}}>
            <button 
              onClick={() => handlePageChange(currentPageNumber - 1)}
              disabled={currentPageNumber <= 1}
            >
              &lt;
            </button>
            <span style={{ margin: '0 8px' }}> {currentPageNumber}</span>
            <button 
              onClick={() => handlePageChange(currentPageNumber + 1)}
              disabled={!hasMorePages}
            >
              &gt;
            </button>
          </div>
        </div>
        { createPatientShowForm && (
          <Overlay>
            <div style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '20px',
                width: 'min(420px, 80vw)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}
            > 
            <h2 style={{ marginTop: 0 }}>Create new patient</h2>
            {error && error.status_code === 409 && (
              <Message isError 
              message="A patient with the same DNI has already been registered." 
              visible={isMessageVisible}
              onClick={handleMessageClose}
              />
            )}
            <PatientForm
              onSubmit={({ email, fullname, dni, dateOfBirth }) => handlePatientCreation({ email, fullname, dni, dateOfBirth })}
              onCancel={() => setCreatePatientShowForm(false)}
            />
            </div>
          </Overlay>
        )}
        { error?.status_code === 401 && (
          <Overlay>
            <div
              style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '20px',
                width: 'min(420px, 80vw)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}
            >
              <h2 style={{ marginTop: 0 }}>Session expired</h2>
              <p>Your session has expired. Please log in again.</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button onClick={() => navigate('/login')}>
                  Go to Login
                </button>
              </div>
            </div>
          </Overlay>
        )}
      </div>
    );  

}

export default PatientListPage;