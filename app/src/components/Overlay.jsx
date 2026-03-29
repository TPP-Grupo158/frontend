import PropTypes from 'prop-types';

const Overlay = ({children}) => {

  return (
    <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
      }}
    >
      {children}
    </div>
  );
}

Overlay.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Overlay;
