import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { TabsContext } from "./TabsContext";

import "./tab.scss";

const propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

const defaultProps = {
  label: undefined,
  disabled: false,
  onClick: () => {},
};

function Tab({ children, title, disabled, onClick }) {
  const { active, onActivate, setActiveContent } = useContext(TabsContext);

  useEffect(() => {
    if (active) {
      setActiveContent(children);
    }
  }, [active, children, setActiveContent, title]);

  const onClickTab = (event) => {
    event.preventDefault();
    onActivate();
    onClick && onClick(event);
  };

  return (
    <button
      className={classnames("tab", {
        "tab--active": active,
      })}
      disabled={disabled}
      onClick={onClickTab}
    >
      {title}
    </button>
  );
}

Tab.propTypes = propTypes;
Tab.defaultProps = defaultProps;

export default Tab;
