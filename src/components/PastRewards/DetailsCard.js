import React, { useState } from "react";

import PropTypes from "prop-types";

import { Card, Button, Info, LoadingOverlay } from "components/ui";
import { Card as CardIcon } from "assets/images";

import { useWallet } from "utils/store/Wallet";

import { truncateTokenValue, toDecimalString } from "utils";

import { useContract, refreshBalances, transactionSet } from "utils/store";

import { exitStaking, getReward } from "utils/services";

import "./detailsCard.scss";

const propTypes = {
  mainToken: PropTypes.string.isRequired,
  rewardsToken: PropTypes.string.isRequired,
  mainTokenBalance: PropTypes.object.isRequired,
  rewardsTokenBalance: PropTypes.object.isRequired,
  totalStaked: PropTypes.object.isRequired,
  earned: PropTypes.object.isRequired,
  contractAddress: PropTypes.string.isRequired,
  stream: PropTypes.string.isRequired,
};

function DetailsCard({
  mainToken,
  rewardsToken,
  mainTokenBalance,
  rewardsTokenBalance,
  totalStaked,
  earned,
  contractAddress,
  stream,
}) {
  const { chainId, address } = useWallet();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tx, setTx] = useState(undefined);

  const { dispatch } = useContract();

  const handleTransaction = (transaction) => {
    setTx(transaction.hash);

    dispatch(
      transactionSet({
        ...transaction,
        address,
        stakingContractSymbol: stream,
        chainId,
      })
    );
  };

  const claimCallback = () => {
    dispatch(refreshBalances());
    setIsSubmitting(false);
    setTx();
  };

  const handleClaim = () => {
    setIsSubmitting(true);
    getReward(claimCallback, handleTransaction, contractAddress);
  };

  const handleExit = () => {
    setIsSubmitting(true);

    exitStaking(
      claimCallback,
      claimCallback,
      handleTransaction,
      contractAddress
    );
  };

  return (
    <Card className="details-card">
      <p className="details-card__header">{rewardsToken} Details</p>
      {isSubmitting ? (
        <LoadingOverlay txHash={tx} />
      ) : (
        <>
          <div className="details-card__balances">
            <img alt="" src={CardIcon} />
            <Info left body={toDecimalString(mainTokenBalance)}>
              <p className="balance">
                <span>Your balance:</span>{" "}
                {`${truncateTokenValue(mainTokenBalance)} ${mainToken}`}
              </p>
            </Info>
            <div className="separator" />
            <Info left body={toDecimalString(rewardsTokenBalance)}>
              <p className="balance">{`${truncateTokenValue(
                rewardsTokenBalance
              )} ${rewardsToken}`}</p>
            </Info>
          </div>
          <div className="details-card__details">
            <Info left body={toDecimalString(totalStaked)}>
              <p className="detail">
                <span>Your Staked {mainToken}: </span>
                {truncateTokenValue(totalStaked)} {mainToken}
              </p>
            </Info>
            <Info left body={toDecimalString(earned)}>
              <p className="detail">
                <span>Pending {rewardsToken}: </span>
                {truncateTokenValue(earned)} {rewardsToken}
              </p>
            </Info>
          </div>
          <div className="details-card__actions">
            <Button
              type="secondary"
              handleClick={handleClaim}
              disabled={!earned.gt(0)}
            >
              Claim Rewards
            </Button>
            <Button
              handleClick={handleExit}
              disabled={!earned.gt(0) || !totalStaked.gt(0)}
            >
              Claim Rewards & Withdraw All
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

DetailsCard.propTypes = propTypes;

export default DetailsCard;
