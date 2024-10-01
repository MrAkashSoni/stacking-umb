import React from "react";
import classnames from "classnames";

import { Heading, Card, ChainIndicator } from "components/ui";
import { truncate } from "utils/formatters";
import { chainData } from "utils/constants";

import Instructions from "../Redeem/Instructions";
import RedeemCard from "./RedeemCard";
import { getScanUrlFromChain } from "utils/urls";

import "./redeem.scss";
import { useRedeemV2 } from "utils/store/redeemV2";
import { V2 } from "config/redeem";
import { useWallet } from "utils/store/Wallet";

function RedeemV2() {
  const {
    state: { token, rewardToken },
  } = useRedeemV2();

  const { chainId, isConnectedProperly } = useWallet();

  const { allowedNetwork, ratio } = V2;

  const isCorrectNetwork =
    isConnectedProperly && chainId === parseInt(allowedNetwork);

  const redeemingDisabled = !isCorrectNetwork;

  const scanUrl = getScanUrlFromChain(chainData, allowedNetwork);

  return (
    <div className="redeem-page">
      <div className="redeem-page__welcome-message">
        <div className="title">
          <Heading type="secondary" highlightSpan size={1}>
            Redeem rUMB2
          </Heading>
          <p className="subtitle">Convert rUMB2 to UMB</p>
        </div>

        <ChainIndicator />

        {!isCorrectNetwork && (
          <p className="redeem-page__warning">
            Redeeming is only available on{" "}
            {chainData[allowedNetwork].networkFullName}
          </p>
        )}

        {isConnectedProperly && (
          <div className="redeem-info-container">
            <Card className="redeem-info redeem-info--token-contracts">
              <p className="text">
                {token.symbol} Contract
                <br />
                <br />
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${scanUrl}/token/${token.contractAddress}`}
                >
                  {truncate(token.contractAddress)}
                </a>
              </p>
              <div className="divisor" />
              <p className="text">
                {rewardToken.symbol} Contract
                <br />
                <br />
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${scanUrl}/token/${rewardToken.contractAddress}`}
                >
                  {truncate(rewardToken.contractAddress)}
                </a>
              </p>
            </Card>
          </div>
        )}
      </div>

      <Card className="redeem-page__info">
        <p>
          Welcome to the Umbrella Network {rewardToken.symbol} redemption page,
          where you can convert your {rewardToken.symbol} tokens to{" "}
          {token.symbol} tokens on a {ratio} basis. You can only redeem{" "}
          {rewardToken.symbol} tokens already in your connected wallet on
          Ethereum, so if you have any pending {rewardToken.symbol} in one of
          Umbrella&apos;s staking contracts, you will need to claim them first
          before you can redeem. If you have any {rewardToken.symbol} on BSC,
          you will need to bridge them to Ethereum to redeem.
        </p>
      </Card>

      <div
        className={classnames("redeem-page__wrapper", {
          "redeem-page__wrapper--disabled": redeemingDisabled,
        })}
      >
        <Instructions token={rewardToken.symbol} />

        <RedeemCard />
      </div>
    </div>
  );
}

export default RedeemV2;
