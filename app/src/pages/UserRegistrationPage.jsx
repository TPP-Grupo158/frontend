import UserRegistrationForm from "../components/UserRegistrationForm";
import styles from "../components/styles.js";

import Message from "../components/Message.jsx";
import { useState } from "react";

const UserRegistrationPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const handleSubmit = async (data) => {

    setErrorMessage('');
    try {
      const response = await fetch(import.meta.env.VITE_GATEWAY_API + "register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      const responseData = await response.json();
      if (response.ok) {
        setIsErrorVisible(false);
      } else {
        setErrorMessage(responseData.detail || 'Failed to create user');
        setIsErrorVisible(true);
      }
    } catch {
      setErrorMessage('Failed to create user');
      setIsErrorVisible(true);
    }

  };

  return (
    <div style={{
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        backgroundColor: styles.container.backgroundColor
    }}>
      <div style={{...styles.form, flexDirection: 'column', alignContent: 'center', gap: '4px'} }>
        <h2>Create new user</h2>
        {errorMessage && 
          <Message isError message={errorMessage} visible={isErrorVisible} onClick={() => setIsErrorVisible(false)} 
        />}

        <UserRegistrationForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default UserRegistrationPage;