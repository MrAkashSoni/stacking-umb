import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useWallet } from "utils/store/Wallet";
import { web3Provider } from "utils/services";
import { truncate } from "utils/formatters";
import {
  WAITING,
  ERROR,
  SUCCESS,
  TX_FAILED_STATUS,
  chainData,
} from "utils/constants";

import "./transaction.scss";
import { getScanUrlFromChain } from "utils/urls";

const propTypes = {
  transaction: PropTypes.shape({
    hash: PropTypes.string,
    method: PropTypes.string,
    address: PropTypes.string,
    timestamp: PropTypes.string,
  }).isRequired,
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
      return <div className="icon icon--error" />;
    case SUCCESS:
      return <div className="icon icon--success" />;
    case WAITING:
      return <div className="icon icon--waiting" />;
    default:
      return <div className="icon icon--waiting" />;
  }
}

function Transaction({ transaction }) {
  const [status, setStatus] = useState(WAITING);

  const { chainId } = useWallet();

  const scanUrl = getScanUrlFromChain(chainData, chainId);

  useEffect(() => {
    const waitForTransaction = async () =>
      (await web3Provider())
        .waitForTransaction(transaction.hash)
        .then(({ status }) =>
          setStatus(status === TX_FAILED_STATUS ? ERROR : SUCCESS)
        )
        .catch(() => setStatus(ERROR));

    waitForTransaction();
  }, [transaction.hash]);

  return (
    <div className="transaction">
      <p className="transaction__label">Date</p>
      <p className="transaction__info">
        {transaction.timestamp.split("Sent on ")[1]}
      </p>
      <p className="transaction__label">Type</p>
      <p className="transaction__info">
        {`${transaction.method
          .charAt(0)
          .toUpperCase()}${transaction.method.slice(1)}`}
      </p>
      <p className="transaction__label">Hash/status</p>
      <div className="status">
        <a
          href={`${scanUrl}/tx/${transaction.hash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {truncate(transaction.hash, 6)}
        </a>
        <Icons icon={status} />
      </div>
    </div>
  );
}

Transaction.propTypes = propTypes;

Icons.propTypes = iconsProps;
Icons.defaultProps = iconsDefaultProps;

export default Transaction;
