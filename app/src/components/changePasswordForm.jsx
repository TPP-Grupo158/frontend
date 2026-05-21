import { useState } from "react";
import { object, string } from 'yup';
import styles from './styles';
import PropTypes from "prop-types";

import PasswordInput from "./PasswordInput";

const passwordSchema = object({
  password: string()
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password cannot be longer than 32 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase character')
    .matches(/[a-z]/, 'Password must contain at least one lowercase character')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[#$%&@*¡!¿?()<>=+]/, 'Password must contain at least one special character (#$%&@*¡!¿?()<>=+)')
    .required('Password is required'),
  currentPassword: string().required('Current password is required'),
});

const ChangePasswordForm = ({ onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const [error, setError] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});

    try {
      await passwordSchema.validate({ password: newPassword, currentPassword }, { abortEarly: false })
      if (newPassword !== newPasswordConfirm) {
        setError({passwordConfirm: 'Passwords do not match'});
        return;
      }
    } catch (e) {
      const errors = {};
      e.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      setError(errors);
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
        <div style={{ display: 'flex', flexDirection: 'column'}}>
          <PasswordInput 
            value={currentPassword}
            placeholder="Current Password"
            onChange={setCurrentPassword}
            containerStyle={{ marginBottom: error?.currentPassword ? '0.25rem' : styles.input.marginBottom }}
          />          
          {error?.currentPassword && 
            <span style={{color: 'red', fontSize: '12px', paddingLeft: '2px'}}>{error?.currentPassword}</span>
          }
        </div>
        <div style={{ display: 'flex', flexDirection: 'column'}}>
          <PasswordInput 
            value={newPassword}
            placeholder="New Password"
            onChange={setNewPassword}
            containerStyle={{ marginBottom: error?.password ? '0.25rem' : styles.input.marginBottom }}
          />   
          {error?.password && 
            <span style={{color: 'red', fontSize: '12px', paddingLeft: '2px'}}>{error?.password}</span>
          }
        </div>

        <div style={{ display: 'flex', flexDirection: 'column'}}>
          <PasswordInput 
            value={newPasswordConfirm}
            placeholder="Confirm New Password"
            onChange={setNewPasswordConfirm}
            containerStyle={{ marginBottom: error?.passwordConfirm ? '0.25rem' : styles.input.marginBottom }}
          />   
          {error?.passwordConfirm && 
            <span style={{color: 'red', fontSize: '12px', paddingLeft: '2px'}}>{error?.passwordConfirm}</span>
          }
        </div>
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