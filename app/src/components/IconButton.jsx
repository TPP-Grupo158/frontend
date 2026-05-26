import Icon from "./Icons";
import PropTypes from "prop-types";

const IconButton = ({ iconName, onClick, style, iconColor }) => {

  return (
    <button
      type='button'
      onClick={onClick}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        ...style
      }}
    >
      <Icon iconName={iconName} iconColor={iconColor} />
    </button>
  );
}

IconButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  iconColor: PropTypes.string.isRequired,
};

export default IconButton;