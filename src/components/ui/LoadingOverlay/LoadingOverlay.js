import React from "react";
import PropTypes from "prop-types";

import TransactionMessage from "./TransactionMessage";

import { Loading } from "assets/images";

import "./loadingOverlay.scss";

const propTypes = {
  txHash: PropTypes.string,
};

const defaultProps = {
  txHash: undefined,
};

function LoadingOverlay({ txHash }) {
  return (
    <div className="loading-overlay">
      <img alt="" src={Loading} />
      <div className="transaction">
        {txHash ? <TransactionMessage txHash={txHash} /> : null}
      </div>
    </div>
  );
}

LoadingOverlay.propTypes = propTypes;
LoadingOverlay.defaultProps = defaultProps;

export default LoadingOverlay;
