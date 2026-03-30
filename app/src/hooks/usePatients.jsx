import { useState } from 'react';

export const usePatients = () => {
    const [patients, setPatients] = useState([]);
    const [hasMorePages, setHasMorePages] = useState(false);
    const [error, setError] = useState({'message': '', status_code: null});
    const [loading, setLoading] = useState(false);

    const fetchPatients = async (dni = '', name = '', offset = 0, limit = 10) => {

      setLoading(true);
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
          setError({ 'message': '', 'status_code': null });
        } else {
          setError({ 'message': data.message, 'status_code': response.status });
        }
      } catch {
        setError({ 'message': 'There was a problem communicating with the server.', 'status_code': 500 });
      } finally {
        setLoading(false);
      }
    };

    const createPatient = async (fullname, dni, email, dateOfBirth) => {
      try {
        const response = await fetch(
          import.meta.env.VITE_GATEWAY_API + 'patients/',
          {
            method: 'POST',
            body: JSON.stringify({ fullname, dni, email, date_of_birth: dateOfBirth }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }
        );
        const data = await response.json();

        console.log('Create patient response:', data);

        if (response.ok) {
          setError({ 'message': '', 'status_code': null });
        } else {
          setError({ 'message': data.message, 'status_code': response.status });
        }
      } catch {
        setError({ 'message': 'There was a problem communicating with the server.', 'status_code': 500 });
      }
    }

    return { patients, hasMorePages, error, loading, fetchPatients, createPatient };

}