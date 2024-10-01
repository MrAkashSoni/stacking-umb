import React, { useState, useEffect } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { Info } from "components/ui";
import { findIndex, propEq } from "ramda";

import "./toggle.scss";

const propTypes = {
  onClick: PropTypes.func,
  indicator: PropTypes.object,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      icon: PropTypes.string,
      ariaLabel: PropTypes.string,
      value: PropTypes.any,
    })
  ).isRequired,
  selectedOption: PropTypes.string,
};

const defaultProps = {
  onClick: () => {},
  indicator: undefined,
  selectedOption: undefined,
};

function Toggle({ onClick, options, selectedOption }) {
  const [selected, setSelected] = useState(options[0].name);
  const selectedIndex = findIndex(propEq("name", selected), options);

  const handleClick = () => {
    const nextPossibleIndex = selectedIndex + 1;
    const mayGoToNext = nextPossibleIndex < options.length;

    const nextSelectionIndex = mayGoToNext ? nextPossibleIndex : 0;

    !selectedOption && setSelected(options[nextSelectionIndex].name);

    onClick(
      options[nextSelectionIndex].value ?? options[nextSelectionIndex].name
    );
  };

  useEffect(() => {
    if (selectedOption) {
      setSelected(selectedOption);
    }
  }, [selectedOption]);

  return (
    <button className="toggle" type="button" onClick={handleClick}>
      <div
        className={`toggle__indicator toggle__indicator--selected${selectedIndex}`}
      />
      {options.map((option, index) => {
        return (
          <Info
            key={`${option.name}-selector-button`}
            content={<span>{option.ariaLabel ?? option.name}</span>}
            wrap
            center
            top
          >
            <div
              className={classnames("toggle__item", {
                "toggle__item--selected": index === selectedIndex,
              })}
              aria-label={option.ariaLabel}
            >
              {option.icon ? (
                <img alt="" className="toggle__icon" src={option.icon} />
              ) : (
                <p>{option.name}</p>
              )}
            </div>
          </Info>
        );
      })}
    </button>
  );
}

Toggle.propTypes = propTypes;
Toggle.defaultProps = defaultProps;

export default Toggle;
