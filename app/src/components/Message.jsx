import PropTypes from 'prop-types';

const Message = ({ message, isError, visible, onClick }) => {

  if (!message || !visible) return null;

  return (
    <div style={{ 
      padding: '4px 6px',
      backgroundColor: isError ? '#f8d7da' : '#d1e7dd',
      border: `1px solid ${isError ? '#f5c2c7' : '#badbcc'}`,
      borderRadius: '4px',
      marginBottom: '1rem',
      flexDirection: 'row',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span style={{
        color: isError ? '#842029' : '#0f5132',
        fontSize: '14px',
      }}>
        {message}
      </span>
        <div style={{
          flexDirection: 'column',
          display: 'flex',
          marginLeft: 'auto',
        }}>
          <button style={{
          background: 'transparent',
          borderRadius: '4px',
          border: `1px solid ${isError ? '#f5c2c7' : '#badbcc'}`,
          fontSize: '14px',
          cursor: 'pointer',
        }}
        onClick={onClick}
        >
          &times;
        </button>
      </div>
    </div>
  );
};


Message.propTypes = {
  message: PropTypes.string,
  isError: PropTypes.bool,
  visible: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Message;