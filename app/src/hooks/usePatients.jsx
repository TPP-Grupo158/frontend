import { useState } from 'react';

const getErrorMessage = (data, response) => {
  if (data && data.message) return data.message;
  if (response.status >= 500) return 'There was a problem communicating with the server.';
  return `An unknown error occurred (${response.status}).`;
}
  
export const usePatients = () => {
    const [patients, setPatients] = useState([]);
    const [hasMorePages, setHasMorePages] = useState(false);
    const [error, setError] = useState({'message': '', status_code: null});
    const [loading, setLoading] = useState(false);

    async function internalFetch(method, url,  body, onResponseSuccess, onResponseFailure) {

      const headers = { Accept: 'application/json' };
      if (body !== null) {
        headers['Content-Type'] = 'application/json';
      }
      
      const response = await fetch(
        import.meta.env.VITE_GATEWAY_API + url,
        {
          method: method,
          headers,
          body: body ? JSON.stringify(body) : null,
          credentials: 'include',
        }
      );
      const data = await response.json();

      if (response.ok) {
        onResponseSuccess(data);
      } else {
        onResponseFailure(data, response);
      }
      return { data, response };
    } 

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