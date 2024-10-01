import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

import { Checked } from "assets/images";

import "./checkbox.scss";

const propTypes = {
  isChecked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  label: PropTypes.string,
  name: PropTypes.string,
};

const defaultProps = {
  onClick: () => {},
  disabled: false,
  label: undefined,
  name: undefined,
};

function Checkbox({ disabled, isChecked, onClick, label, name }) {
  return (
    <div
      onClick={onClick}
      className={classnames("ui-checkbox", {
        "ui-checkbox--checked": isChecked,
        "ui-checkbox--disabled": disabled,
      })}
    >
      <div
        className={classnames("ui-checkbox__box", {
          "ui-checkbox__box--checked": isChecked,
        })}
      />
      {isChecked && <img src={Checked} alt="" />}
      {label && <p className="ui-checkbox__label">{label}</p>}
      <input
        aria-label={label}
        type="checkbox"
        checked={isChecked}
        readOnly
        name={name}
        id={name}
        disabled={disabled}
      />
    </div>
  );
}

Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;

export default Checkbox;
