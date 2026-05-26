
import PropTypes from "prop-types";
import './Tooltip.css';
import { useState } from "react";

const Tooltip = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  if (!text) return children;

  return (
    <div className="tooltip-container"
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}    
    >
      {children}
      <div className={`tooltip ${visible ? 'open' : ''}`} >
        {text}
      </div>
    </div>
  );
};

export default Tooltip;

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};