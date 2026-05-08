import { useState } from 'react';

import { internalFetch, getErrorMessage } from './helpers';

export const usePatients = () => {
    const [patients, setPatients] = useState([]);
    const [hasMorePages, setHasMorePages] = useState(false);
    const [error, setError] = useState({'message': '', status_code: null});
    const [loading, setLoading] = useState(false);

    const fetchPatients = async (dni = '', name = '', offset = 0, limit = 10) => {

      if (loading) return;
      setLoading(true);

      try {
        const PATH = `patients?offset=${offset}&limit=${limit}` + (dni ? `&dni=${dni}` : '') + (name ? `&name=${name}` : '');

        const onResponseSuccess = (data) => {
          setPatients(data.patients);
          setHasMorePages(data.hasMore);
          setError({ 'message': '', 'status_code': null });
        };

        const onResponseFailure = (data, response) => {
          setError({
            message: getErrorMessage(data, response),
            status_code: response.status,
          });
        };

        await internalFetch('GET', PATH, null, onResponseSuccess, onResponseFailure);

      } catch {
        setError({ 'message': 'There was a problem communicating with the server.', 'status_code': 500 });
      } finally {
        setLoading(false);
      }
    };

    const createPatient = async (fullname, dni, email, dateOfBirth) => {
      
      if (loading) return;
      setLoading(true);

      try {
        const body = { fullname, dni, email, date_of_birth: dateOfBirth };

        const onResponseSuccess = (_data) => {
          setError({ 'message': '', 'status_code': null });
        }

        const onResponseFailure = (data, response) => {
          setError({
            message: getErrorMessage(data, response),
            status_code: response.status,
          });
        };

        const { data, response } = await internalFetch(
          'POST', 
          'patients/', 
          body,
          onResponseSuccess,
          onResponseFailure
        );

        return response.ok ? { error: {} } : { error: { 'message': data.message, 'status_code': response.status } };
        
      } catch {
        const error = { 'message': 'There was a problem communicating with the server.', 'status_code': 500 };
        setError(error);
        return { error };
      } finally {
        setLoading(false);
      }
    }

    return { patients, hasMorePages, error, loading, fetchPatients, createPatient };

}