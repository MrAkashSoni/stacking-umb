import React from "react";

import PropTypes from "prop-types";

import { currencyIcons } from "utils";

import { Button, Layer } from "components/ui";

import "./unlockingLayer.scss";
import { ethers } from "ethers";

const propTypes = {
  currency: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  locks: PropTypes.array.isRequired,
};

function UnlockingLayer({ currency, close, callback, selected, locks }) {
  const amountToUnlock = selected
    .reduce((acc, lock) => acc.add(locks[lock].amount), ethers.constants.Zero)
    .toString();

  return (
    <Layer
      className="unlocking-layer"
      close={close}
      title="Withdraw Tokens"
      fillMobile
    >
      <div className="unlocking-layer__content">
        <div className="unlocking-amount">
          <p>
            {parseFloat(ethers.utils.formatEther(amountToUnlock))
              .toFixed(2)
              .toLocaleString()}
          </p>
          <div className="currency">
            <img src={currencyIcons(currency)} alt="" /> {currency}
          </div>
        </div>

        <p>
          You are unlocking your tokens associated with{" "}
          <span>{selected.length}</span> selected Locks. Your locked balance and
          your rewards will be available under your Wallet once the process is
          finished.
        </p>

        <p>
          <span>Note:</span> The withdrawing process consists in two sequential
          transactions: first, your rewards will be claimed, followed by the
          withdrawal of the tokens under the selected <span>Locks</span>. By
          withdrawing, all your current <span>claimable rewards</span> will be
          claimed.
        </p>

        <div className="actions">
          <Button type="secondary" handleClick={close} label="Cancel" />
          <Button handleClick={callback} label="Confirm" />
        </div>
      </div>
    </Layer>
  );
}

UnlockingLayer.propTypes = propTypes;

export default UnlockingLayer;
