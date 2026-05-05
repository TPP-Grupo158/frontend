import PropTypes from 'prop-types';


const PaginationControls = ({ handleNext, handlePrevious, hasMorePages, currentPageNumber }) => {

  const handleNextPageButton = () => {

    handleNext(currentPageNumber + 1)

  }

  const handlePrevPageButton = () => {
    handlePrevious(currentPageNumber - 1)
  }

  return (
    <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center', marginTop: '16px'}}>
      <button 
        onClick={handlePrevPageButton}
        disabled={currentPageNumber <= 1}
      >
        &lt;
      </button>
      <span data-testid="patient-pagination-page-num" style={{ margin: '0 8px' }}> {currentPageNumber}</span>
      <button 
        onClick={handleNextPageButton}
        disabled={!hasMorePages}
      >
        &gt;
      </button>
    </div>
  )

}

export default PaginationControls

PaginationControls.propTypes = {
  handleNext: PropTypes.func.isRequired,
  handlePrevious: PropTypes.func.isRequired,
  hasMorePages: PropTypes.bool.isRequired,
  currentPageNumber: PropTypes.number.isRequired
};