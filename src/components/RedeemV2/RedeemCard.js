import React, { useState } from "react";
import classnames from "classnames";
import { Card, Info, Button, LoadingOverlay } from "components/ui";

import {
  Card as CardIcon,
  QustionInfoAlt,
  CircledArrow,
  UmbTokenAlt,
} from "assets/images";

import { currencyIcons, truncateTokenValue, toDecimalString } from "utils";
import { useHistory } from "react-router-dom";

import { WAITING, ERROR, SUCCESS, doneStatuses } from "utils/constants";

import "./redeemCard.scss";
import { useRedeemV2 } from "utils/store/redeemV2";
import { V2 } from "config/redeem";
import RedeemConfirmationLayer from "./RedeemConfirmationLayer";

const transactionMessage = {
  [ERROR]: "Transaction failed, check your wallet and try again.",
  [SUCCESS]: "Transaction successful.",
};

function RedeemCard() {
  const {
    state: {
      token,
      rewardToken,
      earned,
      redeemableAmount,
      canSwapTokens,
      isSwapStarted,
      isReady,
      transactionHash,
      transactionStatus,
      dailyCap,
    },
    claimRewards,
    redeemTokens,
  } = useRedeemV2();

  const [displayConfirmation, setDisplayConfirmation] = useState(false);

  const hasRedeemableBalance = !rewardToken.balance.isZero();
  const hasUnclaimedRewards = !earned.isZero();

  const history = useHistory();

  const isAllowedToRedeem =
    canSwapTokens && rewardToken.balance?.lte(redeemableAmount);

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
          tokenAmount={rewardToken.balance}
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
                    body={token.balance && toDecimalString(token.balance)}
                  >
                    <span>{`${truncateTokenValue(token.balance)} ${
                      token.symbol
                    }`}</span>
                  </Info>

                  <div className="separator" />

                  <Info
                    className="balance-tooltip"
                    right
                    wrap
                    body={
                      rewardToken.balance &&
                      toDecimalString(rewardToken.balance)
                    }
                  >
                    <span>{`${truncateTokenValue(rewardToken.balance)} ${
                      rewardToken.symbol
                    }`}</span>
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
                    )} ${rewardToken.symbol}`}</span>
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
                        rewardToken.balance &&
                        toDecimalString(rewardToken.balance)
                      }
                    >
                      <span className="amount">{`${truncateTokenValue(
                        rewardToken.balance
                      )}`}</span>
                    </Info>
                    <div className="symbol">
                      <img alt="" src={UmbTokenAlt} />
                      <span>{rewardToken.symbol}</span>
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
                        rewardToken.balance &&
                        toDecimalString(rewardToken.balance)
                      }
                    >
                      <span className="amount">{`${truncateTokenValue(
                        rewardToken.balance
                      )}`}</span>
                    </Info>
                    <div className="symbol">
                      <img alt="" src={currencyIcons("umb")} />
                      <span>{token.symbol}</span>
                    </div>
                  </div>

                  <div
                    className={classnames("available-disclaimer", {
                      "available-disclaimer--error": !isAllowedToRedeem,
                    })}
                  >
                    Daily redemption quota:{" "}
                    {truncateTokenValue(redeemableAmount)} {rewardToken.symbol}
                    <Info
                      right
                      content={
                        <>
                          <p className="tip-content">
                            <span>{rewardToken.symbol} Quota</span> is the total
                            amount of tokens that can be redeemed per day
                            accross all wallets. You can redeem your{" "}
                            {rewardToken.symbol} for {token.symbol} only if the
                            amount of tokens in your wallet is less than the
                            Quota amount. The Quota decreases every time someone
                            redeems, and is daily refilled to a maximum of{" "}
                            {truncateTokenValue(dailyCap)} {rewardToken.symbol}.
                            The Quota is not cumulative.
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
                        You do not have any {rewardToken.symbol}. Please go to
                        Staking to earn some and be eligible to redeem for{" "}
                        {rewardToken.symbol}.
                      </span>
                      <Button
                        label="Go to Staking"
                        handleClick={() => history.push(`/staking/hadley`)}
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
                *The ratio of {rewardToken.symbol} to {token.symbol} will be{" "}
                {V2.ratio}
              </span>
            </>
          )}
        </div>
      </Card>
    </>
  );
}

export default RedeemCard;
