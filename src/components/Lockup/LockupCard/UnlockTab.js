import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import classnames from "classnames";

import { isEmpty } from "ramda";
import { useWallet } from "utils/store/Wallet";

import {
  currencyIcons,
  truncateTokenValue,
  toDecimalString,
  readableTimestamp,
} from "utils";

import { useParams } from "react-router-dom";

import {
  Info,
  Button,
  Checkbox,
  LoadingState,
  Processing,
} from "components/ui";
import UnlockingLayer from "./UnlockingLayer";

import { readableMultiplier } from "utils/formatters";

import { useLockup } from "utils/store/lockup";

import { Card as CardIcon } from "assets/images";

import "./unlockTab.scss";

function UnlockTab() {
  const [selected, setSelected] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    clearTransactions,
    unlockTokens,
    state: {
      unlockSteps,
      totalRewards,
      isTransactioning,
      token: { symbol, balance },
    },
    locks,
    isLoading,
    isRefetching,
  } = useLockup();
  const { id } = useParams();
  const { chainId } = useWallet();
  const queryClient = useQueryClient();

  const isLoadingLocks = isLoading || isRefetching;

  const handleSelect = (lockIndex) => {
    if (selected.includes(lockIndex)) {
      setSelected(selected.filter((index) => index !== lockIndex));
    } else {
      setSelected([...selected, lockIndex]);
    }
  };

  const handleSubmit = () => setIsSubmitting(true);

  const handleUnlock = () => {
    unlockTokens({
      ids: selected,
      totalRewards,
      stakingContractSymbol: id,
      successCallback: () => {
        selected.forEach((index) => handleSelect(index));
        queryClient.invalidateQueries(["locks"]);
      },
    });

    setIsSubmitting(false);
  };

  useEffect(() => {
    const unclaimedSelected = selected.filter(
      (lockId) => locks[lockId].hasUnlocked === false
    );
    setSelected(unclaimedSelected);
    /* eslint-disable-next-line */
  }, [locks]);

  return !isEmpty(unlockSteps) ? (
    <Processing
      steps={unlockSteps}
      chain={String(chainId)}
      ctaSuccessCallback={clearTransactions}
      ctaErrorCallback={clearTransactions}
    />
  ) : (
    <>
      {isSubmitting && (
        <UnlockingLayer
          selected={selected}
          locks={locks}
          currency={symbol}
          close={() => setIsSubmitting(false)}
          callback={handleUnlock}
        />
      )}
      <form className="lockup-withdraw-tab">
        <div className="balance">
          <div className="balance__wrapper">
            <img alt="balance icon" src={CardIcon} />
            <Info left body={toDecimalString(balance)}>
              <div className="text">
                <p>
                  Your balance: {`${truncateTokenValue(balance)} ${symbol}`}
                </p>
              </div>
            </Info>
          </div>
          <img alt="" className="icon" src={currencyIcons(symbol)} />
        </div>
        <div className="title-wrapper">
          <p className="title">Select token locks to withdraw</p>
          {isLoadingLocks && <LoadingState />}
        </div>
        <div className="separator" />
        <div className="lockup-withdraw-tab__pool-selector">
          {locks && locks.length ? (
            locks.map((lock, index) => {
              const {
                amount,
                unlockDate,
                multiplier,
                withdrawnAt,
                hasUnlocked,
                mayUnlock,
              } = lock;

              return (
                <div
                  key={`period-pool-selector-${lock}-${index}`}
                  className={classnames("withdraw-option", {
                    "withdraw-option--disabled": !mayUnlock || hasUnlocked,
                  })}
                  onClick={() => handleSelect(index)}
                >
                  <Checkbox isChecked={selected.includes(index)} />
                  <p className="info">
                    <span>{`${truncateTokenValue(amount)} ${symbol}`}</span>{" "}
                    locked
                  </p>
                  <p className="info">
                    <span>{readableMultiplier(multiplier)}</span> multiplier
                  </p>
                  {!mayUnlock && (
                    <p
                      className={classnames("info", {
                        "info--error": !mayUnlock,
                      })}
                    >
                      {`Unlocks on ${readableTimestamp(unlockDate)}`}
                    </p>
                  )}
                  {Boolean(withdrawnAt) && (
                    <p
                      className={classnames("info", {
                        "info--primary": Boolean(withdrawnAt),
                      })}
                    >
                      Withdrawn on <span>{readableTimestamp(withdrawnAt)}</span>
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <p className="empty-state">Nothing to unlock</p>
          )}
        </div>
        <div className="separator" />
        <Button
          label="Withdraw Selected"
          disabled={!selected.length || isTransactioning}
          handleClick={handleSubmit}
        />
      </form>
    </>
  );
}

export default UnlockTab;
