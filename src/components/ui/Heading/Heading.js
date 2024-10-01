import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import "./heading.scss";

const propTypes = {
  size: PropTypes.oneOf([1, 2, 3, 4]),
  highlightSpan: PropTypes.bool,
  type: PropTypes.oneOf([
    "primary",
    "secondary",
    "highlight",
    "plain",
    "title",
  ]),
  id: PropTypes.string,
};

const defaultProps = {
  size: 1,
  type: "primary",
  highlightSpan: true,
  id: undefined,
};

function Heading({ size, type, highlightSpan, children, id }) {
  return (
    <h1
      id={id}
      className={classnames(`heading heading--${size} heading--${type}`, {
        "heading--highilight-span": highlightSpan,
      })}
    >
      {children}
    </h1>
  );
}

Heading.propTypes = propTypes;
Heading.defaultProps = defaultProps;

export default Heading;
