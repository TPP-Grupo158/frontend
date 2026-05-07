import PropTypes from 'prop-types';

const SegmentationStatsDisplay = ({ stats }) => {

  if (!stats) {
    return null;
  }

  return (
    <details open style={{ paddingLeft: 0, marginLeft: 0, border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, width: "fit-content" }}>
        <summary style={{
            cursor: "pointer",
            fontSize: "22px",
            fontWeight: "bold",
            paddingLeft: 0,
            marginLeft: 0,
        }}>
            Segmentation Stats
        </summary>
        <dl style={{ display: 'grid', rowGap: 8, gridTemplateColumns: 'max-content 1fr', columnGap: 12, margin: 0 }}>
            <dt><b>Volume (mL)</b></dt><dd>{stats.volumeML}</dd>
            <dt><b>Volume (mm³)</b></dt><dd>{stats.volumeMM3}</dd>
            <dt><b>Intensity (max)</b></dt><dd>{stats.intensityMax}</dd>
            <dt><b>Intensity (min)</b></dt><dd>{stats.intensityMin}</dd>
            <dt><b>Intensity (mean)</b></dt><dd>{stats.intensityMean}</dd>
            <dt><b>Intensity (stdev)</b></dt><dd>{stats.intensityStdev}</dd>
        </dl>
      </details>
  );
}

export default SegmentationStatsDisplay;

SegmentationStatsDisplay.propTypes = {
  stats: PropTypes.shape({
    volumeML: PropTypes.number,
    volumeMM3: PropTypes.number,
    intensityMax: PropTypes.number,
    intensityMin: PropTypes.number,
    intensityMean: PropTypes.number,
    intensityStdev: PropTypes.number
  })
};