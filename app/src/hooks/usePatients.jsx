import { useState, useEffect } from 'react';

export const usePatients = () => {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const fetchPatients = async (dni = '') => {
      try {
        const response = await fetch(
          import.meta.env.VITE_GATEWAY_API + 'patients' + (dni ? `?dni=${dni}` : ''),
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }
        );
        const data = await response.json();

        if (response.ok) {
          setPatients(data);
        } else {
          setError(data.message || 'Invalid credentials');
        }
      } catch {
        setError('Could not connect to the server.');
      } finally {
        setLoading(false);
      }
    };


    useEffect(() => {
        fetchPatients();
    }, []);

    return { patients, error, loading, fetchPatients };

}