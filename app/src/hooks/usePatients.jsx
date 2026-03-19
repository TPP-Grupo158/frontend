import { useState } from 'react';

export const usePatients = () => {
    const [patients, setPatients] = useState([]);
    const [hasMorePages, setHasMorePages] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchPatients = async (dni = '', name = '', offset = 0, limit = 10) => {

      try {
        const response = await fetch(
          import.meta.env.VITE_GATEWAY_API + 'patients'  + `?offset=${offset}&limit=${limit}` + (dni ? `&dni=${dni}` : '') + (name ? `&name=${name}` : ''),
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }
        );
        const data = await response.json();

        if (response.ok) {
          setPatients(data.patients);
          setHasMorePages(data.hasMore);
        } else {
          setError(data.message || 'Invalid credentials');
        }
      } catch {
        setError('Could not connect to the server.');
      } finally {
        setLoading(false);
      }
    };

    return { patients, hasMorePages, error, loading, fetchPatients };

}