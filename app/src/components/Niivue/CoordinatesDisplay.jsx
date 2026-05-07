import propTypes from 'prop-types';

const CoordinatesDisplay = ({ coordinates }) => {
    if (!coordinates) return null;

    const { x, y, z } = coordinates;

    return (
        <div style={{
          display: 'inline-flex', 
          gap: '12px',
          marginLeft: "auto",
          whiteSpace: "nowrap",
          paddingRight: "12px",
        }}>
          <strong style={{color: "#ffffff"}}>{`X: ${x}`}</strong>
          <strong style={{color: "#ffffff"}}>{`Y: ${y}`}</strong>
          <strong style={{color: "#ffffff"}}>{`Z: ${z}`}</strong>
      </div>
    );
}

export default CoordinatesDisplay;

CoordinatesDisplay.propTypes = {
    coordinates: propTypes.shape({
        x: propTypes.number.isRequired,
        y: propTypes.number.isRequired,
        z: propTypes.number.isRequired
    }).isRequired
}