import React, { useState, useEffect } from 'react';

const PredictionResult = ({ data }) => {
  const [jsonContent, setJsonContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si data es un string (URL), vamos a buscarlo
    if (typeof data === 'string' && data.startsWith('http')) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch(data);
          if (!response.ok) throw new Error('Error al cargar el JSON desde MinIO');
          const result = await response.json();
          setJsonContent(result);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      // Si ya es un objeto (caso anterior), lo usamos directamente
      setJsonContent(data);
    }
  }, [data]);

  if (loading) return <div style={{padding: '20px'}}>Cargando resultados...</div>;
  if (error) return <div style={{padding: '20px', color: 'red'}}>Error: {error}</div>;
  if (!jsonContent) return null;

  const styles = {
    container: {
      width: '100%',
      marginTop: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      overflow: 'hidden',
      fontFamily: 'sans-serif'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#fff',
    },
    th: {
      backgroundColor: '#f4f4f4',
      borderBottom: '2px solid #ccc',
      borderRight: '1px solid #ccc',
      padding: '12px 15px',
      textAlign: 'left',
      fontSize: '13px',
      color: '#333',
      textTransform: 'uppercase'
    },
    td: {
      padding: '10px 15px',
      borderBottom: '1px solid #eee',
      borderRight: '1px solid #eee',
      fontSize: '14px',
      color: '#555'
    },
    valueCell: {
      fontFamily: 'monospace',
      textAlign: 'center',
      fontWeight: 'bold'
    }
  };

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Parameter</th>
            <th style={{...styles.th, borderRight: 'none'}}>Result</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(jsonContent).map(([key, value], index) => (
            <tr key={key} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' }}>
              <td style={styles.td}>
                {key.replace(/_/g, ' ')}
              </td>
              <td style={{ ...styles.td, ...styles.valueCell, borderRight: 'none' }}>
                {typeof value === 'number' ? value.toFixed(4) : String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PredictionResult;