import React, { useState } from "react";

import PropTypes from "prop-types";
import classnames from "classnames";
import { useClickOutsideListenerRef } from "utils/hooks";

import { Dropdown } from "assets/images";

import "./dropdownSelect.scss";

const propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

const defaultProps = {
  disabled: false,
};

function DropdownSelect({ label, disabled, children }) {
  const [selected, setSelected] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  const dropDownRef = useClickOutsideListenerRef(close);

  const handleChildClick = (index, { props: { onClick } }, args) => {
    onClick(args);
    setSelected(index + 1);
    setIsOpen(false);
  };

  return (
    <div
      className={classnames("dropdown-select", {
        "dropdown-select--open": isOpen,
        "dropdown-select--disabled": !children.length || disabled,
      })}
      ref={dropDownRef}
    >
      <div className="dropdown-select__label" onClick={toggle}>
        {selected ? (
          React.cloneElement(children[selected - 1], {
            onClick: open,
          })
        ) : (
          <p className="label__text">{label}</p>
        )}
        <Dropdown />
      </div>
      {isOpen && (
        <div className="dropdown-select__options">
          {children.map((child, index) =>
            React.cloneElement(child, {
              ...child.props,
              className: `${child.props.className} dropdown-select-options__option`,
              onClick: (args) => handleChildClick(index, child, args),
            })
          )}
        </div>
      )}
    </div>
  );
}

DropdownSelect.propTypes = propTypes;
DropdownSelect.defaultProps = defaultProps;

export default DropdownSelect;
