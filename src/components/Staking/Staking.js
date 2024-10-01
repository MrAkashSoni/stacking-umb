import React from "react";

import { useContract } from "utils/store";

import { RewardsCard, StakingCard, Transactions } from "components";
import { Heading, Card, ChainIndicator } from "components/ui";
import { truncate } from "utils/formatters";
import { useScrollOnLoad } from "utils/hooks";
import { useWallet } from "utils/store/Wallet";
import { contracts, chainData } from "utils/constants";

import { useParams } from "react-router-dom";

import { fetchSistemStreams } from "utils";

import "./staking.scss";
import { getScanUrlFromChain } from "utils/urls";
import classnames from "classnames";

function Staking() {
  const { chainId, currentChain } = useWallet();

  const {
    state: {
      staking: { rewardsTokenAddress, tokenAddress },
      user: {
        rToken: { symbol },
      },
    },
  } = useContract();

  const { id } = useParams();

  const headingRef = useScrollOnLoad();

  const { mainToken, stream, options, warning } = contracts[id];

  const { address, pair } = options[currentChain];

  const scanUrl = getScanUrlFromChain(chainData, chainId);

  const sisterStreams = fetchSistemStreams({
    chain: currentChain,
    symbol: id,
  });

  return (
    <div className="staking-page">
      {/* <button onClick={() => disconnect()}>Disconnect</button> */}
      <div className="staking-page__welcome-message">
        <div ref={headingRef} className="title">
          <Heading type="secondary" highlightSpan size={1}>
            {stream} <span>Stream</span>
          </Heading>
          <p className="subtitle">
            {`${pair} Staking for `}
            <span>{symbol}</span>
          </p>
        </div>
        <ChainIndicator />
        {warning && <p className="staking-page__warning">{warning}</p>}
        <div className="staking-info-container">
          <Card
            className={classnames("staking-info", {
              "staking-info--token-contracts":
                tokenAddress !== rewardsTokenAddress,
            })}
          >
            <p className="text">
              {mainToken} Contract
              <br />
              <br />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`${scanUrl}/token/${tokenAddress}`}
              >
                {truncate(tokenAddress)}
              </a>
            </p>
            {tokenAddress !== rewardsTokenAddress && (
              <>
                <div className="divisor" />
                <p className="text">
                  {symbol} Contract
                  <br />
                  <br />
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${scanUrl}/token/${rewardsTokenAddress}`}
                  >
                    {truncate(rewardsTokenAddress)}
                  </a>
                </p>
              </>
            )}
          </Card>
          <Card className="staking-info">
            <p className="text">
              {`${mainToken}-${symbol}`} Staking Contract
              <br />
              <br />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`${scanUrl}/address/${address}`}
              >
                {truncate(address)}
              </a>
            </p>
          </Card>
        </div>
      </div>
      <div className="staking-page__wrapper">
        <StakingCard sisterStreams={sisterStreams} />
        <RewardsCard sisterStreams={sisterStreams} />
        <Transactions />
      </div>
    </div>
  );
}

export default Staking;
