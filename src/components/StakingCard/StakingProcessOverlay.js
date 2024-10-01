import React from "react";
import PropTypes from "prop-types";
import { WAITING, ERROR, SUCCESS, statuses } from "utils/constants";
import classnames from "classnames";
import { TransactionMessage, Button } from "components/ui";
import { Success } from "assets/images";

import "./stakingProcessOverlay.scss";

const propTypes = {
  stakeStatus: PropTypes.oneOf(statuses),
  allowStatus: PropTypes.oneOf(statuses),
  callback: PropTypes.func.isRequired,
  txHash: PropTypes.string,
};

const defaultProps = {
  stakeStatus: undefined,
  allowStatus: undefined,
  txHash: undefined,
};

const iconsProps = {
  icon: PropTypes.string,
};

const iconsDefaultProps = {
  icon: undefined,
};

function Icons({ icon }) {
  switch (icon) {
    case ERROR:
      return <div className="error" />;
    case SUCCESS:
      return <img alt="success" src={Success} />;
    case WAITING:
      return <div className="waiting" />;
    default:
      return <div className="default" />;
  }
}

function StakingProcessOverlay({ allowStatus, stakeStatus, callback, txHash }) {
  const isWaiting = [allowStatus, stakeStatus].includes(WAITING);

  const stakeIcon = () => {
    if (allowStatus === SUCCESS) {
      return stakeStatus;
    } else if (allowStatus === ERROR) {
      return ERROR;
    }
  };

  const finalStatus = () => {
    if ([allowStatus, stakeStatus].every((status) => status === SUCCESS)) {
      return SUCCESS;
    } else if ([allowStatus, stakeStatus].some((status) => status === ERROR)) {
      return ERROR;
    }
  };

  const statusMessage = (status) => {
    switch (status) {
      case ERROR:
        return "Failed";
      case SUCCESS:
        return "Processed";
      case WAITING:
        return "Processing";
      default:
        return "Processing";
    }
  };

  const stakingMessage = () => {
    if (allowStatus === ERROR) {
      return "Not Sent";
    } else if (allowStatus === SUCCESS) {
      return statusMessage(stakeStatus);
    } else {
      return "Waiting For Allowance";
    }
  };

  const finalMessage = () => {
    if (finalStatus() === SUCCESS) {
      return "Congrats! Your tokens have been staked";
    } else if (finalStatus() === ERROR) {
      return "Your transaction failed :c Please try again!";
    }

    return "Processing";
  };

  return (
    <div className="staking-process-overlay">
      <p className="title">Contract Operations in Process</p>
      <div className="progress">
        <div className="progress-bar">
          <Icons icon={allowStatus} />
          <div
            className={classnames("path", {
              "path--success": allowStatus === SUCCESS,
              "path--error": allowStatus === ERROR,
            })}
          />
          <Icons icon={stakeIcon()} />
          <div
            className={classnames("path", {
              "path--success": finalStatus() === SUCCESS,
              "path--error": [allowStatus, stakeStatus].includes(ERROR),
            })}
          />
          <Icons icon={finalStatus()} />
        </div>
        <div className="messages">
          <p>Allowance Transaction {statusMessage(allowStatus)}</p>
          <p>Staking Transaction {stakingMessage()}</p>
          <p>{finalMessage()}</p>
        </div>
      </div>
      {txHash ? <TransactionMessage txHash={txHash} /> : <div />}
      <Button
        type="secondary"
        label="OK"
        disabled={isWaiting}
        onClick={callback}
      />
    </div>
  );
}

StakingProcessOverlay.propTypes = propTypes;
StakingProcessOverlay.defaultProps = defaultProps;

Icons.propTypes = iconsProps;
Icons.defaultProps = iconsDefaultProps;

export default StakingProcessOverlay;
