import PropTypes from 'prop-types';

const LabelsDisplay = ({ coloredLabels }) => {

    if (!coloredLabels || Object.keys(coloredLabels).length === 0) {
        return null; // No labels to display
    }

    return (
        <div style={{
            display: 'flex', 
            flexDirection: 'row',
            justifyContent: 'left',
            alignItems: 'flex-start',
            gap: '12px',
            width: "100%",
            paddingLeft: "12px",
        }}>
            { Object.entries(coloredLabels).map(([label, color]) => (
                <div key={label}>
                    <span style={{
                        display: "inline-block",
                        width: 12,
                        height: 12,
                        backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
                        borderRadius: 2,
                        marginRight: 6
                    }}/>
                    <strong style={{color: "#ffffff"}}>{label}</strong>
                </div>
             ))}
        </div>
    );
}

export default LabelsDisplay;

LabelsDisplay.propTypes = {
    coloredLabels: PropTypes.objectOf(
        PropTypes.arrayOf(PropTypes.number)
    ).isRequired
};