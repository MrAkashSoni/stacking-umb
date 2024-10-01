import React from "react";
import PropTypes from "prop-types";

import "./button.scss";

const buttonComponentPropTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.oneOf(["primary", "secondary", "plain", "warn", "weak"]),
  isSubmit: PropTypes.bool,
  reverse: PropTypes.bool,
  handleClick: PropTypes.func,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

const buttonComponentDefaultProps = {
  className: "",
  type: "primary",
  handleClick: () => {},
  isSubmit: false,
  icon: undefined,
  reverse: false,
  label: undefined,
};

const propTypes = {
  ...buttonComponentPropTypes,
  isNewTab: PropTypes.bool,
  url: PropTypes.string,
};

const defaultProps = {
  ...buttonComponentDefaultProps,
  isNewTab: true,
  url: undefined,
};

function ButtonComponent({
  label,
  type,
  isSubmit,
  handleClick,
  className,
  children,
  icon,
  reverse,
  ...rest
}) {
  const IconComponent = icon;

  return (
    <button
      type={isSubmit ? "submit" : "button"}
      className={`button button--${type} ${className} ${
        reverse ? "button--reverse" : ""
      }`}
      onClick={handleClick}
      {...rest}
    >
      {children || (
        <>
          {typeof icon === "string" && <img alt="" src={icon} />}
          {typeof icon === "object" && <IconComponent />}
          {label}
        </>
      )}
    </button>
  );
}

function Button({
  label,
  type,
  handleClick,
  isSubmit,
  url,
  className,
  children,
  icon,
  isNewTab,
  ...rest
}) {
  const urlProps = isNewTab
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const buttonComponent = (
    <ButtonComponent
      icon={icon}
      isSubmit={isSubmit}
      label={label}
      type={type}
      handleClick={handleClick}
      className={className}
      {...rest}
    >
      {children}
    </ButtonComponent>
  );

  if (url) {
    return (
      <a className="url-button" href={url} {...urlProps}>
        {buttonComponent}
      </a>
    );
  }

  return buttonComponent;
}

ButtonComponent.propTypes = buttonComponentPropTypes;
ButtonComponent.defaultProps = buttonComponentDefaultProps;

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
