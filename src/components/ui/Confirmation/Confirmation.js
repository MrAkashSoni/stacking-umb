import React from "react";

import PropTypes from "prop-types";
import classnames from "classnames";

import { Layer, Button } from "components/ui";

import "./confirmation.scss";

const propTypes = {
  callback: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  warning: PropTypes.string,
  className: PropTypes.string,
};

const defaultProps = {
  warning: undefined,
  className: undefined,
};

function Confirmation({ className, callback, close, title, children }) {
  const handleConfirm = () => {
    callback();
    close();
  };

  return (
    <Layer
      className={classnames("confirmation-layer", {
        [className]: Boolean(className),
      })}
      fillMobile
      close={close}
      title={title}
    >
      <div className="confirmation-layer__content">{children}</div>
      <div className="confirmation-layer__actions">
        <Button label="Cancel" type="secondary" handleClick={close} />
        <Button label="Confirm" handleClick={handleConfirm} />
      </div>
    </Layer>
  );
}

Confirmation.propTypes = propTypes;
Confirmation.defaultProps = defaultProps;

export default Confirmation;
