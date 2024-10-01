import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useTutorial } from "utils/store/Tutorial";
import classnames from "classnames";
import { useContract, refreshBalances, transactionSet } from "utils/store";
import { useWallet } from "utils/store/Wallet";
import { contracts } from "utils/constants";

import { V2_CONTRACTS } from "utils/constants";

import { useLocalStorage } from "utils/hooks";

import {
  Card,
  Button,
  Tip,
  LoadingOverlay,
  Heading,
  Info,
  Confirmation,
} from "components/ui";
import { Card as CardIcon, QustionInfoAlt } from "assets/images";

import {
  arrayToReadableList,
  calcAnnualReward,
  multiplyBigNumberByFloat,
} from "utils/formatters";

import { truncateTokenValue, toDecimalString } from "utils";

import { getReward } from "utils/services";

import StakedOnPastIterationWarning from "./StakedOnPastIterationWarning";

import "./rewardsCard.scss";
import { BigNumber } from "ethers";

const propTypes = {
  sisterStreams: PropTypes.array.isRequired,
};

function RewardsCard({ sisterStreams }) {
  const hasSisterStreams = sisterStreams.length;

  const {
    state: { step },
  } = useTutorial();

  const {
    state: {
      stakingContractSymbol,
      staking: { rewardsTokenAddress, tokenAddress },
      user: {
        token,
        rToken: { rBalance, rPending, symbol },
      },
    },
    dispatch,
  } = useContract();

  const { value: hasDismissedPastIteration } = useLocalStorage(
    "hasDismissedPastIteration"
  );

  const [isModalDismissedForNow, setIsModalDismissedForNow] = useState(
    hasDismissedPastIteration
  );
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    setIsModalDismissedForNow(hasDismissedPastIteration);
  }, [hasDismissedPastIteration]);

  const { isConnectedProperly, currentChain, address, chainId } = useWallet();

  const [isLoading, setIsLoading] = useState(false);
  const [currentTx, setCurrentTx] = useState();

  const balanceRef = useRef();
  const buttonRef = useRef();

  const hasBalance = !rPending?.isZero();

  const { options, mainToken, shouldFetchRatio } =
    contracts[stakingContractSymbol];

  const {
    balance,
    staked,
    ratio,
    pastIterations,
    totalBonus,
    totalBalance,
    bonusTokenBalance,
    totalStakingBalance,
    totalSupply,
  } = token[stakingContractSymbol];

  const pastIterationStakedOnList = Object.values(pastIterations)
    .filter(({ staked, earned }) => !staked.isZero() || !earned.isZero())
    .sort((a, b) => b.iteration - a.iteration);

  const shouldDisplayPastIterationWarning =
    pastIterationStakedOnList.length > 0 && !isModalDismissedForNow;

  const {
    address: stakingContract,
    dailyAvailable,
    enabled,
  } = options[currentChain];

  const isV2 = V2_CONTRACTS.includes(stakingContract);

  let mainTokenStaked = BigNumber.from(0);

  if (isV2) {
    mainTokenStaked = ratio
      ? multiplyBigNumberByFloat(bonusTokenBalance, ratio)
      : bonusTokenBalance;
  } else {
    mainTokenStaked = totalSupply;
  }

  const convertedStaked =
    shouldFetchRatio && ratio
      ? multiplyBigNumberByFloat(mainTokenStaked, ratio)
      : undefined;

  const annualReward = calcAnnualReward({
    dailyAvailable,
    totalBonus,
    totalBalance,
    bonusTokenBalance: ratio ? convertedStaked : mainTokenStaked,
    totalStakingBalance,
    stakingContract,
    totalSupply,
  });

  const handleTransaction = (transaction) => {
    setCurrentTx(transaction.hash);
    dispatch(
      transactionSet({
        ...transaction,
        address,
        stakingContractSymbol,
        chainId,
      })
    );
  };

  const claimCallback = () => {
    dispatch(refreshBalances());
    setIsLoading(false);
    setCurrentTx();
  };

  const handleClaim = () => {
    setIsLoading(true);
    getReward(claimCallback, handleTransaction, stakingContract);
  };

  return (
    <>
      {shouldDisplayPastIterationWarning && (
        <StakedOnPastIterationWarning
          details={pastIterationStakedOnList}
          stream={stakingContractSymbol}
          callback={() => setIsModalDismissedForNow(true)}
        />
      )}
      {isClaiming && (
        <Confirmation
          className="claim-confirmation"
          callback={handleClaim}
          close={() => setIsClaiming(false)}
          title="Claim"
        >
          <p>This will claim your available generated rewards.</p>
          {Boolean(hasSisterStreams) && (
            <p>
              <span>Warning: </span>this will, in the same transaction, also
              claim available rewards from{" "}
              <span>{arrayToReadableList(sisterStreams)}</span>.
            </p>
          )}
        </Confirmation>
      )}
      <Card
        className={classnames("rewards-card", {
          "rewards-card--disabled": !enabled,
        })}
        style={{ position: step ? "initial" : "relative" }}
      >
        {isLoading ? <LoadingOverlay txHash={currentTx} /> : null}
        <Heading type="plain" highlightSpan size={3}>
          Your <span>Wallet</span>
        </Heading>
        <div className="main-balances">
          <img className="card-icon" alt="" src={CardIcon} />
          <p className="label">Your balance: </p>
          <Info left body={toDecimalString(balance)}>
            <span>{`${truncateTokenValue(balance)} ${mainToken}`}</span>
          </Info>
          {tokenAddress !== rewardsTokenAddress && (
            <>
              <div className="divisor" />
              <Info left body={toDecimalString(rBalance)}>
                <p className="reward-token">{`${truncateTokenValue(
                  rBalance
                )} ${symbol}`}</p>
              </Info>
            </>
          )}
        </div>
        <Tip
          isOpen={step === 9}
          instructions="rUMB tokens are redeemable for UMB on a 1:1 basis."
          childRef={balanceRef}
          debug
          whiteBackground
          direction="down"
        >
          <div className="staked-info-wrapper" ref={balanceRef}>
            <p className="staked-info-wrapper__info">
              Daily Available Tokens:{" "}
              <span>{`${dailyAvailable.toLocaleString(
                "en-US"
              )} ${symbol}`}</span>
            </p>

            {!isV2 && (
              <div className="staked-info-wrapper__info staked-info-wrapper__info--container">
                <p>Overall Staked Tokens: </p>
                <div>
                  <Info left body={mainTokenStaked.toString()}>
                    <span>
                      {`${truncateTokenValue(mainTokenStaked).toLocaleString(
                        "en-US",
                        {
                          maximumFractionDigits: 2,
                        }
                      )} ${mainToken}`}
                    </span>
                  </Info>
                  {shouldFetchRatio && Boolean(convertedStaked) && (
                    <Info left body={convertedStaked.toString()}>
                      <span className="currency-secondary">
                        (
                        {`~ ${truncateTokenValue(
                          convertedStaked
                        ).toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })} UMB `}
                        )
                      </span>
                    </Info>
                  )}
                </div>
              </div>
            )}

            <div className="staked-info-wrapper__with-info">
              <Info left body={annualReward.toString()}>
                <p className="staked-info-wrapper__info">
                  Current Annual Reward:{" "}
                  <span>
                    ~
                    {annualReward.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                    %
                  </span>
                </p>
              </Info>
              {!isV2 && (
                <Info
                  title="Current Annual Reward"
                  right
                  content={
                    <>
                      {shouldFetchRatio ? (
                        <>
                          <p>
                            The annual reward can be estimated by converting the{" "}
                            <span>Overall Staked Tokens</span> to UMB. The final
                            value represents the approximate yield, in rUMB
                            generated by staked LP tokens.
                          </p>

                          <p>
                            <span>LP:UMB Ratio =</span> {ratio?.toFixed(3)}
                          </p>

                          <p>
                            <span>Daily Token Ratio =</span> Daily Available
                            Tokens / (LP:UMB Ratio * Overall Staked Tokens)
                          </p>
                        </>
                      ) : (
                        <p>
                          <span>Daily Token Ratio =</span> Daily Available
                          Tokens / Overall Staked Tokens
                        </p>
                      )}

                      <p>
                        <span>Current Annual Reward =</span> Daily Token Ratio *
                        365
                      </p>
                    </>
                  }
                >
                  <img src={QustionInfoAlt} alt="" />
                </Info>
              )}
            </div>

            <div className="divisor" />
            <Info left body={toDecimalString(staked)}>
              <p className="staked-info-wrapper__info">
                Your Staked {mainToken}:{" "}
                <span>{`${truncateTokenValue(staked)} ${mainToken}`}</span>
              </p>
            </Info>
            <Info left body={toDecimalString(rPending)}>
              <p className="staked-info-wrapper__info">
                Pending {symbol}:{" "}
                <span>{`${truncateTokenValue(rPending)} ${symbol}`}</span>
              </p>
            </Info>
          </div>
        </Tip>
        <div className="cta-container">
          <Tip
            isOpen={step === 10}
            instructions="You can claim paid rUMB tokens by clicking here."
            childRef={buttonRef}
            direction="down"
            whiteBackground
          >
            <div className="button-container" ref={buttonRef}>
              <Button
                type="secondary"
                className="cta-button"
                disabled={!isConnectedProperly || isLoading || !hasBalance}
                label="Claim Rewards"
                handleClick={() => setIsClaiming(true)}
              />
            </div>
          </Tip>
          <div className="disclaimer">
            {Boolean(pastIterationStakedOnList.length) && (
              <button
                className="disclaimer__staked-for"
                onClick={() => setIsModalDismissedForNow(false)}
              >
                <img src={QustionInfoAlt} alt="" />
                <p>
                  {" "}
                  *Have you staked for <span>rUMB1</span> or <span>rUMB2</span>?
                  See Details
                </p>
              </button>
            )}
          </div>
        </div>
      </Card>
    </>
  );
}

RewardsCard.propTypes = propTypes;

export default RewardsCard;
