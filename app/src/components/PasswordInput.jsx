import { useState } from 'react';
import default_styles from './styles';
import PropTypes from "prop-types";

import IconButton from "./IconButton";
import Tooltip from "./Tooltip/Tooltip";

const PasswordInput = ({ value, onChange, containerStyle, placeholder, tooltip }) => {

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
        padding: '4px', 
        width: '100%', 
        boxSizing: 'border-box',
        backgroundColor: 'transparent',
        border: '0px',
        outline: 'none'
      },
    iconButton: {
          background: 'transparent', 
          border: 'none', 
          cursor: 'pointer',
          padding: '4px', 
          display: 'flex', 
          alignItems: 'center'
      },
  }
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div style={{ 
      ...default_styles.input, 
      ...containerStyle,
      display: 'flex', 
      flexDirection: 'row', 
      }}>
      <Tooltip 
        text={tooltip}
      >
      <input style={in_style.passwordInput}
        type={isPasswordVisible ? 'text' : 'password'} 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      </Tooltip>
    
      <IconButton 
        data-testid="toggle-password-visibility"
        style={in_style.iconButton}
        iconName={isPasswordVisible ? 'eyeOff' : 'eye'}
        iconColor='#666'
        onClick={() => setIsPasswordVisible(prev => !prev)} 
        />
    </div>
  )
};

export default PasswordInput;

PasswordInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
  placeholder: PropTypes.string,
  tooltip: PropTypes.node
}
