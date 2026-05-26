export const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
  form: { padding: '2rem', background: 'white', borderRadius: '8px', gap: '1rem',boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', width: '300px' },
  input: { marginBottom: '1rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' },
  button: { padding: '0.7rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  table:{
    container : { tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: '2px 2px', width: '100%', overflow: 'hidden' },
    header: { backgroundColor: '#007bff', color: 'white' },
    row: { textAlign: 'center' }
  }
}

export default styles;