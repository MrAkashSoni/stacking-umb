import React from "react";
import PropTypes from "prop-types";
import { truncate } from "utils/formatters";
import { useWallet } from "utils/store/Wallet";
import { chainData } from "utils/constants";

import "./transactionMessage.scss";
import { getScanUrlFromChain } from "utils/urls";

const propTypes = {
  txHash: PropTypes.string,
};

const defaultProps = {
  txHash: undefined,
};

function TransactionMessage({ txHash }) {
  const { chainId } = useWallet();

  const scanUrl = getScanUrlFromChain(chainData, chainId);

  return (
    <div className="transaction-message">
      <p>
        Waiting for pending transaction{" "}
        <a
          href={`${scanUrl}/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {truncate(txHash)}
        </a>
      </p>
      <div className="waiting" />
    </div>
  );
}

TransactionMessage.propTypes = propTypes;
TransactionMessage.defaultProps = defaultProps;

export default TransactionMessage;
