import { useState } from "react";
import styles from './styles';
import PropTypes from "prop-types";


const PatientForm = ({ onSubmit, onCancel, initialData }) => {
  const [email, setEmail] = useState(initialData?.email || '');
  const [fullname, setFullname] = useState(initialData?.fullname || '');
  const [dni, setDni] = useState(initialData?.dni || '');
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.dateOfBirth || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, fullname, dni, dateOfBirth });
  }

  return (
    <div> 
      <form
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        onSubmit={handleSubmit}
      >
        <input 
          type="text" 
          placeholder="Fullname" 
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          style={styles.input}
          required 
        />
        <input 
          type="text" 
          placeholder="DNI" 
          inputMode="numeric"
          value={dni}
          onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
          style={styles.input}
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required 
        />
        <input 
          type="date" 
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          style={styles.input}
          required 
        />
        <div style={{flexDirection:'row', display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
          <button type="submit" style={styles.button}>Create</button>
          <button onClick={() => onCancel()}>
            Cancel 
          </button>
        </div>
      </form>
    </div>
  )
}

PatientForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    email: PropTypes.string,
    fullname: PropTypes.string,
    dni: PropTypes.string,
    dateOfBirth: PropTypes.string,
  }),
};

PatientForm.defaultProps = {
  initialData: undefined,
};

export default PatientForm;