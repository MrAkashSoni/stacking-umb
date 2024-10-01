import React from "react";
import PropTypes from "prop-types";
import { ethers } from "ethers";

import { Button, Info, Layer } from "components/ui";
import { toUint256 } from "utils/formatters";
import { UmbToken } from "assets/images";
import { verifyCurrentAllowance } from "utils";

import "./stakingConfirmationLayer.scss";

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  tokenAmount: PropTypes.string.isRequired,
  currentAllowance: PropTypes.object.isRequired,
};

const defaultProps = {
  stakeStatus: undefined,
  allowStatus: undefined,
  txHash: undefined,
};

function StakingConfirmationLayer({
  isOpen,
  setIsOpen,
  tokenAmount,
  currentAllowance,
}) {
  const shouldOverrideAllowance =
    tokenAmount !== "" &&
    currentAllowance.gt(ethers.constants.Zero) &&
    verifyCurrentAllowance(toUint256(tokenAmount), currentAllowance);

  return (
    isOpen && (
      <Layer
        className="submit-transfer-layer"
        title={
          shouldOverrideAllowance
            ? "Increase in Allowance is Required"
            : "Staking"
        }
        close={() => setIsOpen(false)}
        fillMobile
      >
        <div className="submit-transfer-layer__token-info">
          <Info center body={ethers.utils.parseEther(tokenAmount).toString()}>
            <p className="submit-transfer-layer__token-amount">
              {parseFloat(tokenAmount).toFixed(2).toLocaleString()}
            </p>
          </Info>
          <img
            src={UmbToken}
            className="submit-transfer-layer__asset-icon"
            alt=""
          />
          <p className="submit-transfer-layer__asset">UMB</p>
        </div>
        {shouldOverrideAllowance ? (
          <p className="submit-transfer-layer__instructions">
            The amount you are trying to stake is higher than your current
            allowance{" "}
            <span>( {ethers.utils.formatEther(currentAllowance)} )</span>. In
            order to proceed with the Staking transaction, a new Allowance
            transaction will be required. Please make sure the amount is correct
            before continuing.
          </p>
        ) : (
          <p className="submit-transfer-layer__instructions">
            Please review the amount of tokens you are trying to stake before
            continuing. To proceed with the Staking process, click the button
            below.
          </p>
        )}
        <Button
          className="cta-button"
          isSubmit
          label={
            shouldOverrideAllowance
              ? "Increase Allowance & Stake Tokens"
              : "Stake Tokens"
          }
        />
      </Layer>
    )
  );
}

StakingConfirmationLayer.propTypes = propTypes;
StakingConfirmationLayer.defaultProps = defaultProps;

export default StakingConfirmationLayer;
