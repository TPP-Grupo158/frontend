import UserRegistrationForm from "../components/UserRegistrationForm";
import styles from "../components/styles.js";

const UserRegistrationPage = () => {

  const handleSubmit = async (data) => {

    console.log("Submitting user registration:", data);

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
        console.log('User registration successful:', responseData);//NO imprime nada por algun motivo
      } else {
        console.log('Failed to create user: ' + (responseData.detail || response.statusText));
      }
    } catch (error) {
      console.error('Error creating user:', error);
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
        <UserRegistrationForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default UserRegistrationPage;