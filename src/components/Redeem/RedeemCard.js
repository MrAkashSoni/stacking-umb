import React, { useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Card, Info, Button, LoadingOverlay } from "components/ui";

import {
  WAITING,
  ERROR,
  SUCCESS,
  doneStatuses,
  REDEEM_DAILY_CAP,
} from "utils/constants";

import {
  Card as CardIcon,
  QustionInfoAlt,
  CircledArrow,
  UmbTokenAlt,
} from "assets/images";

import { currencyIcons, truncateTokenValue, toDecimalString } from "utils";

import { useRedeem } from "utils/store/redeem";

import { useHistory } from "react-router-dom";

import RedeemConfirmationLayer from "./RedeemConfirmationLayer";

import "./redeemCard.scss";
import { BigNumber } from "ethers";

const propTypes = {
  disabled: PropTypes.bool,
  ratio: PropTypes.string.isRequired,
  stream: PropTypes.string.isRequired,
};

const defaultProps = {
  disabled: false,
};

const transactionMessage = {
  [ERROR]: "Transaction failed, check your wallet and try again.",
  [SUCCESS]: "Transaction successful.",
};

const RedeemCard = ({ disabled, ratio, stream }) => {
  const [displayConfirmation, setDisplayConfirmation] = useState(false);

  const {
    state: {
      isSwapStarted,
      canSwapTokens,
      redeemableAmount,
      isReady,
      transactionStatus,
      transactionHash,
      rewardToken: { balance: rewardTokenBalance, symbol: rewardTokenSymbol },
      token: { balance: tokenBalance, symbol: tokenSymbol },
      earned,
    },
    redeemTokens,
    claimRewards,
  } = useRedeem();

  const hasRedeemableBalance = !rewardTokenBalance.isZero();
  const hasUnclaimedRewards = !earned.isZero();

  const history = useHistory();

  const isAllowedToRedeem =
    canSwapTokens && rewardTokenBalance?.lte(redeemableAmount);

  const errorMessage = () => {
    if (!isSwapStarted) {
      return "*Redeeming period has not yet started.";
    }

    if (hasRedeemableBalance && !isAllowedToRedeem) {
      return "Can not swap tokens. Check redemption quota.";
    }
  };

  const loadingTransaction = transactionStatus === WAITING;
  const transactionDone = doneStatuses.includes(transactionStatus);

  return (
    <>
      {displayConfirmation && (
        <RedeemConfirmationLayer
          tokenAmount={rewardTokenBalance}
          callback={redeemTokens}
          isOpen={displayConfirmation}
          setIsOpen={setDisplayConfirmation}
        />
      )}
      <Card className="redeem">
        <div className="tabs">
          <button aria-label="Stake" className="tab tab--active">
            Redeem
          </button>
        </div>

        <div className="redeem__content">
          {loadingTransaction ? (
            <LoadingOverlay txHash={transactionHash} />
          ) : (
            <>
              <div className="balances-container">
                <img className="card-icon" alt="" src={CardIcon} />
                <p className="label">Your balance: </p>
                <div className="balances">
                  <Info
                    className="balance-tooltip"
                    right
                    wrap
                    body={tokenBalance && toDecimalString(tokenBalance)}
                  >
                    <span>{`${truncateTokenValue(
                      tokenBalance
                    )} ${tokenSymbol}`}</span>
                  </Info>

                  <div className="separator" />

                  <Info
                    className="balance-tooltip"
                    right
                    wrap
                    body={
                      rewardTokenBalance && toDecimalString(rewardTokenBalance)
                    }
                  >
                    <span>{`${truncateTokenValue(
                      rewardTokenBalance
                    )} ${rewardTokenSymbol}`}</span>
                  </Info>
                </div>
              </div>

              <div className="unclaimed-rewards">
                <div className="rewards">
                  Unclaimed rewards:{" "}
                  <Info
                    className="balance-tooltip"
                    right
                    wrap
                    body={earned && toDecimalString(earned)}
                  >
                    <span className="rewards-amount">{`${truncateTokenValue(
                      earned
                    )} ${rewardTokenSymbol}`}</span>
                  </Info>
                </div>

                <Button
                  type="secondary"
                  label="Claim Rewards"
                  disabled={!hasUnclaimedRewards}
                  handleClick={claimRewards}
                />
              </div>

              {hasRedeemableBalance ? (
                <div className="redeem-details">
                  <div className="token-data">
                    <span className="direction">From:</span>
                    <Info
                      className="balance-tooltip"
                      center
                      wrap
                      body={
                        rewardTokenBalance &&
                        toDecimalString(rewardTokenBalance)
                      }
                    >
                      <span className="amount">{`${truncateTokenValue(
                        rewardTokenBalance
                      )}`}</span>
                    </Info>
                    <div className="symbol">
                      <img alt="" src={UmbTokenAlt} />
                      <span>{rewardTokenSymbol}</span>
                    </div>
                  </div>

                  <img src={CircledArrow} alt="" />

                  <div className="token-data">
                    <span className="direction">To:</span>
                    <Info
                      className="balance-tooltip"
                      center
                      wrap
                      body={
                        rewardTokenBalance &&
                        toDecimalString(rewardTokenBalance)
                      }
                    >
                      <span className="amount">{`${truncateTokenValue(
                        rewardTokenBalance
                      )}`}</span>
                    </Info>
                    <div className="symbol">
                      <img alt="" src={currencyIcons("umb")} />
                      <span>{tokenSymbol}</span>
                    </div>
                  </div>

                  <div
                    className={classnames("available-disclaimer", {
                      "available-disclaimer--error": !isAllowedToRedeem,
                    })}
                  >
                    Daily redemption quota:{" "}
                    {truncateTokenValue(redeemableAmount)} {rewardTokenSymbol}
                    <Info
                      right
                      content={
                        <>
                          <p className="tip-content">
                            <span>{rewardTokenSymbol} Quota</span> is the total
                            amount of tokens that can be redeemed per day
                            accross all wallets. You can redeem your{" "}
                            {rewardTokenSymbol} for {tokenSymbol} only if the
                            amount of tokens in your wallet is less than the
                            Quota amount. The Quota decreases every time someone
                            redeems, and is daily refilled to a maximum of{" "}
                            {truncateTokenValue(
                              BigNumber.from(REDEEM_DAILY_CAP)
                            )}{" "}
                            {rewardTokenSymbol}. The Quota is not cumulative.
                          </p>
                        </>
                      }
                    >
                      <img
                        alt="about redeeming available amount"
                        src={QustionInfoAlt}
                      />
                    </Info>
                  </div>
                </div>
              ) : (
                <div className="no-balance-alert">
                  {hasUnclaimedRewards ? (
                    <span>
                      You have unclaimed staking rewards. Please check the
                      section above and click on Claim Rewards.
                    </span>
                  ) : (
                    <>
                      <span>
                        You do not have any {rewardTokenSymbol}. Please go to
                        Staking to earn some and be eligible to redeem for{" "}
                        {rewardTokenSymbol}.
                      </span>
                      <Button
                        label="Go to Staking"
                        handleClick={() => history.push(`/staking/${stream}`)}
                      />
                    </>
                  )}
                </div>
              )}

              <div className="cta-container">
                {isReady && errorMessage() && (
                  <span className="message message--error">
                    {errorMessage()}
                  </span>
                )}

                {transactionDone && (
                  <span
                    className={classnames("message", {
                      "message--error": transactionStatus === ERROR,
                      "message--success": transactionStatus === SUCCESS,
                    })}
                  >
                    {transactionMessage[transactionStatus]}
                  </span>
                )}

                <Button
                  className="cta-button"
                  label="Redeem Tokens"
                  disabled={
                    !isSwapStarted ||
                    !isAllowedToRedeem ||
                    !hasRedeemableBalance
                  }
                  handleClick={() => setDisplayConfirmation(true)}
                />
              </div>

              <span className="footer-note">
                *The ratio of {rewardTokenSymbol} to {tokenSymbol} will be{" "}
                {ratio}
              </span>
            </>
          )}
        </div>
      </Card>
    </>
  );
};

RedeemCard.propTypes = propTypes;
RedeemCard.defaultProps = defaultProps;

export default RedeemCard;
