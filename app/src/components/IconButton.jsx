import Icon from "./Icons";
import PropTypes from "prop-types";

const IconButton = ({ iconName, onClick, style, iconColor, text, testId }) => {

  return (
    <button
      data-testid={testId || "icon-button"}
      type='button'
      onClick={onClick}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      <Icon iconName={iconName} iconColor={iconColor} />
      {text && <span style={{ 
        marginLeft: '4px', 
        color: iconColor, 
        fontWeight: 'bold',
        ...style,
        padding: 0,
        paddingBottom: '2px'
        }}>{text}</span>}
    </button>
  );
}

IconButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  iconColor: PropTypes.string.isRequired,
  text: PropTypes.string,
  testId: PropTypes.string
};

export default IconButton;