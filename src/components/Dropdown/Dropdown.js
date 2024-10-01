import React, { useState } from "react";
import PropTypes from "prop-types";

import { useClickOutsideListenerRef } from "utils/hooks";

import { DropdownDark as DropdownIcon } from "assets/images";

import { availableStreams, contracts, avaliableRedeem } from "utils/constants";

import "./dropdown.scss";

const propTypes = {
  closeMenu: PropTypes.func,
  type: PropTypes.oneOf(["staking", "rewards"]),
  title: PropTypes.string.isRequired,
};

const defaultProps = {
  closeMenu: () => {},
};

function handleDropdownType(type) {
  const isRedeem = type === "redeem";

  if (isRedeem) {
    return avaliableRedeem.map((option) => ({
      title: option,
      href: `/redeem/${option.toLowerCase()}`,
    }));
  }

  return availableStreams.map((option) => {
    return {
      title: contracts[option].name,
      href: contracts[option].path,
    };
  });
}

function Dropdown({ closeMenu, title, type }) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  const closeDropdown = () => {
    setOpen(false);
    closeMenu();
  };

  const ref = useClickOutsideListenerRef(closeDropdown);

  const dropdownOptions = handleDropdownType(type);

  return (
    <div className="dropdown" ref={ref}>
      <div onClick={toggle} className="dropdown__header">
        <span className="dropdown__label">{title}</span>
        <img
          className="dropdown__icon"
          src={DropdownIcon}
          alt="dropdown icon"
        />
      </div>

      {open && (
        <div className="dropdown__list">
          {dropdownOptions.map((option) => {
            return (
              <div
                key={`dropdown-option-${option.title}`}
                className="dropdown__item"
              >
                <a
                  className="dropdown__link"
                  onClick={closeDropdown}
                  href={option.href}
                >
                  {option.title}
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;

export default Dropdown;
