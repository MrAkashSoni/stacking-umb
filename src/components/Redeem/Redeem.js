import React, { useEffect } from "react";
import classnames from "classnames";

import { Heading, Card, ChainIndicator, LoadingState } from "components/ui";
import { truncate } from "utils/formatters";
import { useRedeem } from "utils/store/redeem";
import { useWallet } from "utils/store/Wallet";
import { chainData, redeemOptions } from "utils/constants";

import Instructions from "./Instructions";
import RedeemCard from "./RedeemCard";

import "./redeem.scss";
import { getScanUrlFromChain } from "utils/urls";

function Redeem() {
  const {
    state: {
      rewardToken: {
        balance: rewardTokenBalance,
        symbol: rewardTokenSymbol,
        contractAddress: rewardTokenContract,
      },
      token: {
        balance: tokenBalance,
        symbol: tokenSymbol,
        contractAddress: tokenContract,
      },
      earned,
      isReady,
    },
    setContracts,
  } = useRedeem();

  const { chainId, address: userAddress, isConnectedProperly } = useWallet();
  const { contractAddress, allowedNetwork, ratio } =
    redeemOptions["hadley"]["rumb1"];

  const isCorrectNetwork = chainId && chainId === parseInt(allowedNetwork);
  const isEnabled = contractAddress && userAddress && isCorrectNetwork;

  useEffect(() => {
    if (isEnabled) {
      setContracts({ stakingContract: contractAddress, userAddress });
    }

    /* eslint-disable-next-line */
  }, [isEnabled]);

  const scanUrl = getScanUrlFromChain(chainData, allowedNetwork);

  const redeemingDisabled = !isCorrectNetwork;

  return isReady || !isCorrectNetwork ? (
    <div className="redeem-page">
      <div className="redeem-page__welcome-message">
        <div className="title">
          <Heading type="secondary" highlightSpan size={1}>
            Redeem {rewardTokenSymbol}
          </Heading>
          <p className="subtitle">
            Convert {rewardTokenSymbol} to {tokenSymbol}
          </p>
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
                {tokenSymbol} Contract
                <br />
                <br />
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${scanUrl}/token/${tokenContract}`}
                >
                  {truncate(tokenContract)}
                </a>
              </p>
              <div className="divisor" />
              <p className="text">
                {rewardTokenSymbol} Contract
                <br />
                <br />
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${scanUrl}/token/${rewardTokenContract}`}
                >
                  {truncate(rewardTokenContract)}
                </a>
              </p>
            </Card>
          </div>
        )}
      </div>

      <Card className="redeem-page__info">
        <p>
          Welcome to the Umbrella Network {rewardTokenSymbol} redemption page,
          where you can convert your {rewardTokenSymbol} tokens to {tokenSymbol}{" "}
          tokens on a {ratio} basis. You can only redeem {rewardTokenSymbol}{" "}
          tokens already in your connected wallet on Ethereum, so if you have
          any pending {rewardTokenSymbol} in one of Umbrella&apos;s staking
          contracts, you will need to claim them first before you can redeem. If
          you have any {rewardTokenSymbol} on BSC, you will need to bridge them
          to Ethereum to redeem.
        </p>
      </Card>

      <div
        className={classnames("redeem-page__wrapper", {
          "redeem-page__wrapper--disabled": redeemingDisabled,
        })}
      >
        <Instructions token={rewardTokenSymbol} />

        <RedeemCard
          disabled={redeemingDisabled}
          rewardTokenSymbol={rewardTokenSymbol}
          rewardTokenBalance={rewardTokenBalance}
          tokenBalance={tokenBalance}
          tokenSymbol={tokenSymbol}
          contractAddress={contractAddress}
          earned={earned}
          ratio={ratio}
          stream={"hadley"}
        />
      </div>
    </div>
  ) : (
    <LoadingState />
  );
}

export default Redeem;
