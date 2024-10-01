import React, { useState } from "react";

import PropTypes from "prop-types";

import classnames from "classnames";

import "./info.scss";

const propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  enabled: PropTypes.bool,
  body: PropTypes.string,
  wrap: PropTypes.bool,
  content: PropTypes.node,
  top: PropTypes.bool,
  left: PropTypes.bool,
  right: PropTypes.bool,
  center: PropTypes.bool,
};

const defaultProps = {
  className: "",
  body: undefined,
  content: undefined,
  enabled: true,
  title: "",
  wrap: false,
  top: false,
  left: false,
  right: false,
  center: false,
};

function Info({
  className,
  title,
  body,
  enabled,
  content,
  children,
  wrap,
  top,
  left,
  right,
  center,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={`info-box ${className}`}>
        {React.cloneElement(children, {
          ...children.props,
          className: `children ${
            children.props.className ? children.props.className : ""
          }`,
          onMouseEnter: () => setIsOpen(true),
          onMouseLeave: () => setIsOpen(false),
          onTouchStart: () => setIsOpen(!isOpen),
        })}
        <div
          className={classnames(`info-box__content`, {
            "info-box__content--open": isOpen && enabled,
            "info-box__content--wrap": wrap,
            "info-box__content--top": top,
            "info-box__content--left": left,
            "info-box__content--right": right,
            "info-box__content--center": center,
          })}
        >
          {title ? <p className="info-box-content-title">{title}</p> : null}
          {body ? <p className="info-box-content-body">{body}</p> : null}
          {content ? content : null}
        </div>
      </div>
    </>
  );
}

Info.propTypes = propTypes;
Info.defaultProps = defaultProps;

export default Info;
