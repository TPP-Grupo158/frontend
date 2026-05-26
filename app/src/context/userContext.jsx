import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext(null);


const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
      const user_info = localStorage.getItem('user_info');
      return user_info ? JSON.parse(user_info) : null;
  });

  const login = (role, must_change_password) => {
    localStorage.setItem('user_info', JSON.stringify({ role, must_change_password }));
    setUser({ role, must_change_password });
  };

  const logout = () => {
    localStorage.removeItem('user_info');
    setUser(null);
  };

  const getUserRole = () => {
    return user ? user.role : null;
  };

  const mustChangePassword = () => {
    return user ? user.must_change_password : false;
  };

  const setPasswordChanged = () => {
    if (user) {
      const updatedUser = { ...user, must_change_password: false };
      localStorage.setItem('user_info', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  }

  return (
    <UserContext.Provider value={{ user, login, logout, getUserRole, mustChangePassword, setPasswordChanged }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};