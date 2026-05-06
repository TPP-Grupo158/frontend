import { useState } from "react";
import { internalFetch, getErrorMessage } from "./helpers";

export const usePatientHistory = (patientId) => {
  const [history, setHistory] = useState([]);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ message: "", status_code: null });

  const fetchHistory = async ({ page = 0, limit = 10 } = {}) => {
    if (loading) return;
    setLoading(true);
    try {
      const PATH = `/history/patient/${patientId}?page=${page}&limit=${limit}`;
      
      const onResponseSuccess = (data) => {
        setHistory(data.data)
        setHasMorePages(data.metadata.has_next);
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
      setError({ message: "There was a problem communicating with the server.", status_code: 500 });
    } finally {
      setLoading(false);
    }
  };

  return { history, hasMorePages, loading, error, fetchHistory };
};