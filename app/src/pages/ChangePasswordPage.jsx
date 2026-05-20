import { useUserContext } from "../hooks/useUserContext.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePasswordForm from "../components/changePasswordForm.jsx";
import Message from "../components/Message.jsx";
import styles from "../components/styles.js";

const ChangePasswordPage = () => {
  const { setPasswordChanged } = useUserContext();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(true);

  const handleChangePassword = async ({current_password, new_password}) => {
    setError('');
    setIsErrorVisible(false);
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
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to change password');
        setIsErrorVisible(true);
      }
    } catch {
      setError('An error occurred while changing the password');
      setIsErrorVisible(true);
    }
  }

  const onErrorMessage = (message) => {
    setError(message);
    setIsErrorVisible(true);
  }

  return (
    <div style={{
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      backgroundColor: styles.container.backgroundColor
    }}>
      <div style={{...styles.form, flexDirection: 'column', alignContent: 'center', gap: '4px'} }>
        <h2>Change Password</h2>
        <p>You must change your password before proceeding.</p>
        {error && <Message isError message={error} visible={isErrorVisible} onClick={() => setIsErrorVisible(false)} />}
        <ChangePasswordForm onSubmit={handleChangePassword} onErrorMessage={onErrorMessage} />
      </div>
    </div>
    
  );
};

export default ChangePasswordPage;