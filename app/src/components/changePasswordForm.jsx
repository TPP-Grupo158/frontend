import { useState } from "react";
import { object, string } from 'yup';
import styles from './styles';
import PropTypes from "prop-types";

const passwordSchema = object({
  password: string()
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password cannot exceed 32 characters')
    .uppercase('Password must contain at least one uppercase letter')
    .lowercase('Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[#$%&@*¡!¿?()<>=+]/, 'Password must contain at least one special character (#$%&@*¡!¿?()<>=+)')
    .required('Password is required'),
});

const ChangePasswordForm = ({ onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await passwordSchema.validate({ password: newPassword }, { abortEarly: false })
      if (newPassword !== newPasswordConfirm) {
        return;
      }
    } catch (e) {
      const errors = {};
      e.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      setValidationErrors(errors);
      return;
    }
    onSubmit({ current_password: currentPassword, new_password: newPassword });
  }

  //TODO: Add password requirements (min length, special chars, etc) and option to see password while typing.
  return (
    <div> 
      <form data-testid="change-password-form"
        noValidate //validate using yup
        style={{ display: 'flex', flexDirection: 'column', gap: '4px'}}
        onSubmit={handleSubmit}
      >
        <input style={{ ...styles.input, marginBottom: validationErrors.password ? '0.25rem' : styles.input.marginBottom }}
          type="password" 
          placeholder="Current Password" 
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input style={{ ...styles.input, marginBottom: validationErrors.password ? '0.25rem' : styles.input.marginBottom }}
          type="password" 
          placeholder="New Password" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input style={{ ...styles.input, marginBottom: validationErrors.password ? '0.25rem' : styles.input.marginBottom }}
          type="password" 
          placeholder="Confirm New Password" 
          value={newPasswordConfirm}
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
        />
        <div style={{flexDirection:'row', display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem'}}>
          <button type="submit" style={styles.button}>Change Password</button>
        </div>
      </form>
    </div>
  )
}

ChangePasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default ChangePasswordForm;