import React from "react";

import { uniqBy } from "lodash";
import { isEmpty } from "ramda";
import { Card, Heading, Info } from "components/ui";
import Transaction from "./Transaction";
import { QustionInfoAlt } from "assets/images";
import { useContract } from "utils/store";
import { useWallet } from "utils/store/Wallet";

import { useParams } from "react-router-dom";

import "./transactions.scss";

function Transactions() {
  const {
    state: {
      user: { transactions },
    },
  } = useContract();

  const { chainId: currentChain } = useWallet();
  const { stream, id } = useParams();

  const currentStream = stream ?? id;

  const contractTransactions = uniqBy(
    transactions.filter(
      ({ stakingContractSymbol, chainId }) =>
        stakingContractSymbol === currentStream && chainId === currentChain
    ),
    "hash"
  );

  return (
    <Card className="transactions-card">
      <div className="transactions-card__header">
        <Heading type="plain" highlightSpan size={3}>
          Recent <span>Transactions</span>
        </Heading>
        <Info body="Recent transactions sent on this device will be shown here. Older transactions, as well as the ones you dismiss, will not be shown.">
          <img alt="Recent transactions info" src={QustionInfoAlt} />
        </Info>
      </div>
      <div className="titles">
        <p>Date</p>
        <p>Type</p>
        <p>Hash/status</p>
      </div>
      {!isEmpty(contractTransactions) ? (
        <div className="wrapper">
          {contractTransactions.map((transaction, index) => (
            <Transaction
              key={`transaction-${index}-${JSON.stringify(transaction)}`}
              transaction={transaction}
            />
          ))}
        </div>
      ) : (
        <p className="empty-state">no recent transactions</p>
      )}
    </Card>
  );
}

export default Transactions;
