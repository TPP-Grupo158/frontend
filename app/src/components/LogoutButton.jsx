import IconButton from './IconButton';
import PropTypes from 'prop-types';


const LogoutButton = ({ style, onClick }) => {


  return (
      <IconButton 
        testId="logout-button"
        iconName="logout" 
        iconColor="white"
        text="Logout"
        style={{ 
          fontWeight: 'normal',
          border: 'none',
          background: 'transparent', 
          padding: '4px', 
          ...style
        }}
        onClick={onClick} 
      />
  )
}

export default LogoutButton;

LogoutButton.propTypes = {
  style: PropTypes.object,
  onClick: PropTypes.func
};

LogoutButton.defaultProps = {
  style: {}
};