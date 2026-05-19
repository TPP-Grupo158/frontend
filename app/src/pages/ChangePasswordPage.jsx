import { useUserContext } from "../hooks/useUserContext.jsx";
import { useNavigate } from "react-router-dom";
import ChangePasswordForm from "../components/changePasswordForm.jsx";

import styles from "../components/styles.js";

const ChangePasswordPage = () => {
  const { setPasswordChanged } = useUserContext();
  const navigate = useNavigate();

  const handleChangePassword = async ({current_password, new_password}) => {
    console.log('Changing password with current_password:', current_password, 'and new_password:', new_password);
    try {
      const response = await fetch(import.meta.env.VITE_GATEWAY_API + "change-password", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ current_password, new_password }),
        credentials: 'include'
      });

      if (response.ok) {
        setPasswordChanged();
        navigate('/patients');
      } else {
        console.error('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  }

  return (
    <div style={{
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      backgroundColor: styles.container.backgroundColor
    }}>
      <div style={{...styles.form, flexDirection: 'column', alignContent: 'center', gap: '1rem'} }>
        <h2>Change Password</h2>
        <p>You must change your password before proceeding.</p>
        <ChangePasswordForm onSubmit={handleChangePassword} />
      </div>
    </div>
    
  );
};

export default ChangePasswordPage;