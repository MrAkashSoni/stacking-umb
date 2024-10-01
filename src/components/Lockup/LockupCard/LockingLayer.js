import React from "react";

import PropTypes from "prop-types";

import { currencyIcons } from "utils";

import { Button, Layer } from "components/ui";

import "./lockingLayer.scss";

const propTypes = {
  currency: PropTypes.string.isRequired,
  rewardCurrency: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  period: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

function LockingLayer({
  currency,
  rewardCurrency,
  close,
  value,
  period,
  callback,
}) {
  return (
    <Layer
      className="locking-layer"
      close={close}
      title="Lock Tokens"
      fillMobile
    >
      <div className="locking-layer__content">
        <div className="locking-amount">
          <p>{parseFloat(value).toFixed(2).toLocaleString()}</p>
          <div className="currency">
            <img src={currencyIcons(currency)} alt="" /> {currency}
          </div>
        </div>
        <p className="disclaimer">
          You're locking your tokens for <span>{period}</span>. You will{" "}
          <span>not be able to unlock your tokens</span> for the selected
          duration.
        </p>
        <div className="actions">
          <Button type="secondary" handleClick={close} label="Cancel" />
          <Button handleClick={callback} label="Confirm" />
        </div>
      </div>
    </Layer>
  );
}

LockingLayer.propTypes = propTypes;

export default LockingLayer;
