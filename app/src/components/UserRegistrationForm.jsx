import { useState } from "react";
import styles from './styles';
import PropTypes from "prop-types";
import { object, string } from 'yup';
import { sanitizeNameInput } from '../helpers';


const patientSchema = object({
  email: string().email('Invalid email format').max(150, 'Email cannot exceed 150 characters').required('Email is required'),
  fullname: string().min(3, 'Fullname must be at least 3 characters').max(100, 'Fullname cannot exceed 100 characters').required('Fullname is required'),
});

const UserRegistrationForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');

  const [validationErrors, setValidationErrors] = useState({});
  const [isComposingName, setIsComposingName] = useState(false);

   const handleNameChange = (e) => {
    if (isComposingName) {
      setFullname(e.target.value);
      return;
    }
    setFullname(sanitizeNameInput(e.target.value));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await patientSchema.validate({ email, fullname }, { abortEarly: false })
    } catch (e) {
      const errors = {};
      e.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      setValidationErrors(errors);
      return;
    }
    onSubmit({ email, fullname });
  }

  return (
    <form data-testid="user-registration-form"
      noValidate //validate using yup
      style={{ display: 'flex', flexDirection: 'column', gap: '4px'}}
      onSubmit={handleSubmit}
    >
      <div style={{ display: 'flex', flexDirection: 'column'}}>
        <input style={{ ...styles.input, marginBottom: validationErrors.fullname ? '0.25rem' : styles.input.marginBottom }}
          type="text" 
          placeholder="Fullname" 
          value={fullname}
            onChange={(e) => handleNameChange(e)}
            onCompositionStart={() => setIsComposingName(true)}
            onCompositionEnd={() => {
              setIsComposingName(false);
              setFullname(sanitizeNameInput(fullname));
            }}
        />
        {validationErrors.fullname && <span style={{color: 'red', fontSize: '12px', margin: 0, paddingLeft: '2px'}}>{validationErrors.fullname}</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column'}}>
        <input style={{ ...styles.input, marginBottom: validationErrors.email ? '0.25rem' : styles.input.marginBottom }}
          type="text" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {validationErrors.email && <span style={{color: 'red', fontSize: '12px', paddingLeft: '2px'}}>{validationErrors.email}</span>}
      </div>
      <div style={{flexDirection:'row', display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem'}}>
        <button type="submit" style={styles.button}>Create</button>
      </div>
    </form>
  )
}

UserRegistrationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default UserRegistrationForm;