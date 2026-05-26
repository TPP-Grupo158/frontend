import UserRegistrationForm from "../components/UserRegistrationForm";
import styles from "../components/styles.js";

import Message from "../components/Message.jsx";
import Overlay from "../components/Overlay.jsx";
import { useState } from "react";
import IconButton from "../components/IconButton.jsx";

const UserRegistrationPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const [userInfo, setUserInfo] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const [isCloseButtonHovered, setIsCloseButtonHovered] = useState(false);


  const in_style = {
    passwordContainer: { 
        display: 'flex', 
        flexDirection: 'row', 
        flexGrow: 1,
        backgroundColor: '#f0f0f0',
        paddingRight: '8px',
        borderRadius: '4px'
        },
    passwordInput: { 
        padding: '8px', 
        fontSize: '16px', 
        width: '100%', 
        boxSizing: 'border-box',
        backgroundColor: 'transparent',
        border: '0px',
      },
    iconButton: {
          background: 'transparent', 
          border: 'none', 
          cursor: 'pointer',
          padding: '4px', 
          display: 'flex', 
          alignItems: 'center'
      },
    copyButton: {
        padding: '8px 12px',
        fontSize: '16px',
        backgroundColor: styles.button.backgroundColor,
        color: styles.button.color,
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      },
    closeOverlayButton: {
        background: isCloseButtonHovered ? '#eee' : '#fff',
        padding: '2px 8px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }
    
  };

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
        setRegistrationSuccess(true);
        setUserInfo(responseData);
        setOverlayVisible(true);
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
    <>
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
      { registrationSuccess && overlayVisible &&
        <Overlay>
          <div
            style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '20px',
              width: 'min(420px, 80vw)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
            }}
          > 
          <div
            style={{display: 'flex',flexDirection: 'row-reverse', alignItems: 'flex-end'}}>
            <button
                style={in_style.closeOverlayButton}
                onClick={() => {
                  setOverlayVisible(false);
                  setIsPasswordVisible(false);
                }}
                onMouseEnter={() => setIsCloseButtonHovered(true)}
                onMouseLeave={() => setIsCloseButtonHovered(false)}
              >
                &times;
              </button>
            </div>
            <h2 style={{ marginTop: 0 }}>Registration successful</h2>
            <p>Below you can find the temporary password for the new user.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>

              <div style={in_style.passwordContainer}>
                <input style={in_style.passwordInput}
                type= {isPasswordVisible ? 'text' : 'password'}
                readOnly 
                disabled
                value={userInfo.temp_password} />

                <IconButton 
                data-testid="toggle-password-visibility"
                style={in_style.iconButton}
                iconName={isPasswordVisible ? 'eyeOff' : 'eye'}
                iconColor='#666'
                onClick={() => setIsPasswordVisible(prev => !prev)} 
                />
              </div>
              
              <button
                style={in_style.copyButton}
                onClick={() => {
                  navigator.clipboard.writeText(userInfo.temp_password);
                }}
              >
                Copy
              </button>
            </div>
            <p style={{ marginTop: '16px' }}>Please make sure to save the temporary password, as it will not be shown again.</p>
          </div>
        </Overlay>
      }
    </>
    
  );
};

export default UserRegistrationPage;