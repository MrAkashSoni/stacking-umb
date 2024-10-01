import React from "react";
import PropTypes from "prop-types";

import "./card.scss";

const propTypes = {
  className: PropTypes.string,
};

const defaultProps = {
  className: "",
};

function Card({ children, className, ...rest }) {
  return (
    <div className={`card ${className}`} {...rest}>
      {children}
    </div>
  );
}

Card.propTypes = propTypes;
Card.defaultProps = defaultProps;

export default Card;
