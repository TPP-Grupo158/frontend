import { useState } from "react";
import styles from './styles';
import PropTypes from "prop-types";
import { object, string, date } from 'yup';
import { sanitizeNameInput, getTimeFromToday } from '../helpers';

const MIN_BIRTH_DATE = getTimeFromToday(-120);
const MAX_BIRTH_DATE = getTimeFromToday();

const patientSchema = object({
  email: string().email('Invalid email format').max(150, 'Email cannot exceed 150 characters').required('Email is required'),
  fullname: string().min(3, 'Fullname must be at least 3 characters').max(100, 'Fullname cannot exceed 100 characters').required('Fullname is required'),
  dni: string().matches(/^\d+$/, 'DNI must contain only digits').min(7, 'DNI must be at least 7 characters').max(8, 'DNI cannot exceed 8 characters').required('DNI is required'),
  dateOfBirth: date().transform((value, originalValue) => {
    if (originalValue === '') return null;
    return value;
  })
    .required('Date of Birth is required')
    .min(MIN_BIRTH_DATE, `Date of Birth cannot be before ${MIN_BIRTH_DATE}`)
    .max(MAX_BIRTH_DATE, `Date of Birth cannot be after ${MAX_BIRTH_DATE}`)
});

const PatientForm = ({ onSubmit, onCancel, initialData }) => {
  const [email, setEmail] = useState(initialData?.email || '');
  const [fullname, setFullname] = useState(initialData?.fullname || '');
  const [dni, setDni] = useState(initialData?.dni || '');
  const [dateOfBirth, setDateOfBirth] = useState(initialData?.dateOfBirth || '');

  const [validationErrors, setValidationErrors] = useState({});
  const [isComposingName, setIsComposingName] = useState(false);

  const [dobType, setDobType] = useState(dateOfBirth ? 'date' : 'text');

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
      await patientSchema.validate({ email, fullname, dni, dateOfBirth }, { abortEarly: false })
    } catch (e) {
      const errors = {};
      e.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      setValidationErrors(errors);
      return;
    }
    onSubmit({ email, fullname, dni, dateOfBirth });
  }

  return (
    <div> 
      <form data-testid="patient-form"
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
          <input style={{ ...styles.input, marginBottom: validationErrors.dni ? '0.25rem' : styles.input.marginBottom }}
            type="text" 
            placeholder="DNI" 
            inputMode="numeric"
            value={dni}
            onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
          />
          {validationErrors.dni && <span style={{color: 'red', fontSize: '12px', paddingLeft: '2px'}}>{validationErrors.dni}</span>}
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
        <div style={{ display: 'flex', flexDirection: 'column'}}>
          <input
            style={{
              ...styles.input,
              marginBottom: validationErrors.dateOfBirth ? '0.25rem' : styles.input.marginBottom
            }}
            type={dobType}
            placeholder="Date of Birth"
            value={dateOfBirth}
            onFocus={() => setDobType('date')}
            onBlur={() => {
              if (!dateOfBirth) setDobType('text');
            }}
            onChange={(e) => setDateOfBirth(e.target.value)}
            min={MIN_BIRTH_DATE}
            max={MAX_BIRTH_DATE}
          />
          {validationErrors.dateOfBirth && <span style={{color: 'red', fontSize: '12px', paddingLeft: '2px'}}>{validationErrors.dateOfBirth}</span>}
        </div>
        <div style={{flexDirection:'row', display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem'}}>
          <button type="submit" style={styles.button}>Create</button>
          <button type="button" onClick={() => onCancel()}>
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