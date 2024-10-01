import React, { useState } from "react";
import PropTypes from "prop-types";
import { useQueryClient } from "@tanstack/react-query";
import { web3Provider } from "utils/services/Providers";
import { useWallet } from "utils/store/Wallet";
import { useParams } from "react-router-dom";
import {
  Card,
  Button,
  LoadingOverlay,
  Heading,
  Info,
  Confirmation,
} from "components/ui";
import { Card as CardIcon } from "assets/images";

import {
  truncateTokenValue,
  toDecimalString,
  pushTxIntoLocalStorage,
  periodToLabel,
  getTotalLockedFromLocks,
} from "utils";

import { useLockup } from "utils/store/lockup";

import {
  humanizeTransactionMethod,
  arrayToReadableList,
  calcAnnualReward,
} from "utils/formatters";

import { contracts } from "utils/constants";

import "./lockupWalletCard.scss";

const propTypes = {
  sisterStreams: PropTypes.array.isRequired,
};

function LockupWalletCard({ sisterStreams }) {
  const {
    claim,
    exit,
    state: {
      isTransactioning,
      totalRewards,
      totalBonus,
      totalStakingBalance,
      bonusTokenBalance,
      periodsAndMultipliers,
      token: { symbol, balance },
      rewardToken: { symbol: rewardTokenSymbol, balance: rewardTokenBalance },
    },
    locks,
    setIsTransactioning,
    clearTransactions,
  } = useLockup();

  const totalLocked = locks && getTotalLockedFromLocks(locks);

  const hasSisterStreams = Boolean(sisterStreams.length);

  const unlockable = locks.flatMap(({ mayUnlock, hasUnlocked }, index) =>
    mayUnlock && !hasUnlocked ? [index] : []
  );

  const { chainId, currentChain } = useWallet();
  const { id: stakingContractSymbol } = useParams();

  const { options } = contracts[stakingContractSymbol];

  const { dailyAvailable, address: stakingContract } = options[currentChain];

  const [currentOperation, setCurrentOperation] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tx, setTx] = useState(undefined);

  const queryClient = useQueryClient();

  const isExiting = currentOperation === "exit";

  const handleContractCall = async ({ contractCall, operation }) => {
    try {
      setIsLoading(true);
      setIsTransactioning();

      const tx = await contractCall();

      setTx(tx.hash);

      pushTxIntoLocalStorage({
        method: operation,
        txData: tx,
        chainId,
        stakingContractSymbol,
      });

      (await web3Provider()).waitForTransaction(tx.hash).then(() => {
        setIsLoading(false);
        clearTransactions();
        queryClient.invalidateQueries(["locks"]);
      });
    } catch {
      clearTransactions();
      setIsLoading(false);
    }
  };

  const handleClaim = () => {
    const contractCall = () => claim();
    const operation = "claim";

    handleContractCall({ contractCall, operation });
  };

  const handleExit = () => {
    const contractCall = () => exit(unlockable);
    const operation = "exit";

    handleContractCall({ contractCall, operation });
  };

  return (
    <>
      {currentOperation && (
        <Confirmation
          className="exit-confirmation"
          callback={isExiting ? handleExit : handleClaim}
          close={() => setCurrentOperation()}
          title={humanizeTransactionMethod(currentOperation)}
        >
          <p>
            This will claim available rewards{" "}
            {isExiting ? <span>and withdraw all</span> : null} of you currently
            staked tokens.
          </p>
          {Boolean(hasSisterStreams) && (
            <p>
              <span>Warning: </span>this will, in the same transaction, also
              claim available rewards{" "}
              {isExiting ? <span>and withdraw</span> : null} from{" "}
              <span>{arrayToReadableList(sisterStreams)}</span>.
            </p>
          )}
        </Confirmation>
      )}
      <Card className="lockup-wallet-card">
        {isLoading ? (
          <LoadingOverlay txHash={tx} />
        ) : (
          <>
            <Heading type="plain" highlightSpan size={3}>
              Your <span>Wallet</span>
            </Heading>
            <div className="main-balances">
              <img className="card-icon" alt="" src={CardIcon} />
              <p className="label">Your balance: </p>
              <Info left body={toDecimalString(balance)}>
                <span>{`${truncateTokenValue(balance)} ${symbol}`}</span>
              </Info>
              <div className="divisor" />
              <Info left body={toDecimalString(rewardTokenBalance)}>
                <p className="reward-token">{`${truncateTokenValue(
                  rewardTokenBalance
                )} ${rewardTokenSymbol}`}</p>
              </Info>
            </div>
            <div className="lockup-wallet-card__info-wrapper">
              <Info left body={`${totalLocked}`}>
                <p className="info">
                  Your locked tokens:{" "}
                  <span>{`${truncateTokenValue(totalLocked)} ${symbol}`}</span>
                </p>
              </Info>
              {periodsAndMultipliers?.map(({ period, multiplier }) => (
                <p
                  className="info"
                  key={`${JSON.stringify(period)} annual reward`}
                >
                  Current annual reward for {periodToLabel({ period })} locking:{" "}
                  <span>
                    ~
                    {calcAnnualReward({
                      dailyAvailable,
                      totalStakingBalance,
                      bonusTokenBalance,
                      totalBonus,
                      multiplier,
                      stakingContract,
                    }).toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                    %
                  </span>
                </p>
              ))}
              <div className="divisor" />
              <Info left body={`${totalRewards}`}>
                <p className="info">
                  Claimable Rewards:{" "}
                  <span>{`${truncateTokenValue(
                    totalRewards
                  )} ${rewardTokenSymbol}`}</span>
                </p>
              </Info>
            </div>
            <div className="lockup-wallet-card__actions">
              <Button
                label="Claim Rewards"
                onClick={() => setCurrentOperation("claim")}
                disabled={!totalRewards.gt(0) || isTransactioning}
              />
              <Button
                label="Claim & Withdraw Finished"
                onClick={() => setCurrentOperation("exit")}
                type="secondary"
                disabled={
                  !unlockable.length || !totalRewards.gt(0) || isTransactioning
                }
              />
            </div>
            <p className="disclaimer">
              *{rewardTokenSymbol} are redeemable for UMB on a 1:1 basis
            </p>
          </>
        )}
      </Card>
    </>
  );
}

LockupWalletCard.propTypes = propTypes;

export default LockupWalletCard;
