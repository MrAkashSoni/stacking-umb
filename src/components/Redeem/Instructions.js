import React from "react";
import PropTypes from "prop-types";
import { Heading, Card } from "components/ui";

import "./instructions.scss";

const propTypes = {
  token: PropTypes.string.isRequired,
};

const Instructions = ({ token }) => {
  return (
    <Card className="redeem-instructions">
      <Heading type="plain" size={3}>
        Instructions
      </Heading>

      <ol>
        <li>Connect your wallet containing {token}.</li>
        <li>
          If Unclaimed Rewards shows any {token} balance, that means you still
          have unclaimed {token} and you shoud click on{" "}
          <span>'Claim Rewards'</span>.
        </li>
        <li>
          When ready, click on <span>'Redeem Tokens'</span>, review the values
          and confirm the transaction.
        </li>
        <p>
          <span>Note 1:</span> {token} is <span>ONLY</span> available to be
          redeemed on <span>Ethereum Network</span>. If you have not brought
          your tokens over to ethereum network, please use our{" "}
          <a
            href="https://bridge.umb.network"
            target="_blank"
            rel="noopener noreferrer"
          >
            bridge
          </a>
          .
        </p>
        <p>
          <span>Note 2:</span> It is only possible to redeem <span>ALL</span>{" "}
          {token} available on your wallet.
        </p>
      </ol>
    </Card>
  );
};

Instructions.propTypes = propTypes;

export default Instructions;
