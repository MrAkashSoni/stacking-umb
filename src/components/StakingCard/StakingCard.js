import React, { useState, useRef, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useTutorial } from "utils/store/Tutorial";
import { useWallet } from "utils/store/Wallet";
import { Info, Button, Card, Tip, Confirmation } from "components/ui";
import { Card as CardIcon, UmbTokenAlt, QustionInfoAlt } from "assets/images";
import classnames from "classnames";
import PropTypes from "prop-types";

import StakingProcessOverlay from "./StakingProcessOverlay";
import StakingConfirmationLayer from "./StakingConfirmationLayer";

import { LoadingOverlay } from "components/ui";

import {
  truncateTokenValue,
  formatMonetaryInputValue,
  hasTokenBalance,
  isNotZero,
  toDecimalString,
  hasTrustedForever,
} from "utils";

import { useContract, refreshBalances, transactionSet } from "utils/store";
import { stakeTokens, withdrawTokens, exitStaking } from "utils/services";

import { currencyIcons } from "utils";
import {
  humanizeTransactionMethod,
  arrayToReadableList,
} from "utils/formatters";

import { WAITING, ERROR, SUCCESS, UMB, contracts } from "utils/constants";

import "./stakingCard.scss";

const inputSteps = {
  1: "Stake your Umbrella Tokens to farm Reward Umbrella Tokens (rUMB) over time.",
  2: 'You can set all of your balance for staking by clicking the "MAX" button.',
  3: "Before staking, you have to set an amount of Umbrella Tokens for Allowance. The amount of UMB tokens set for Allowance won't be removed from your balance.",
  4: 'This means that two contract operations will be called upon clicking the "STAKE" button: Allowance and Staking.',
};

const propTypes = {
  sisterStreams: PropTypes.array.isRequired,
};

function StakingCard({ sisterStreams }) {
  const inputRef = useRef();
  const checkBoxRef = useRef();
  const withdrawTabRef = useRef();
  const withdrawButtonRef = useRef();
  const claimRef = useRef();

  const {
    state: { step },
  } = useTutorial();

  const {
    state: {
      stakingContractSymbol,
      user: {
        token,
        rToken: { rPending },
      },
      staking: { isPaused },
    },
    dispatch,
  } = useContract();
  const {
    isConnectedProperly: connected,
    address,
    chainId,
    currentChain,
  } = useWallet();

  const hasSisterStreams = sisterStreams.length;

  useEffect(() => {
    if ([1, 9].includes(step)) {
      setPosition(0);
    } else if (step === 6) {
      setPosition(1);
    }
  }, [step]);

  const [trustCheck, setTrustCheck] = useState(false);
  const [allowStatus, setAllowStatus] = useState(undefined);
  const [stakeStatus, setStakeStatus] = useState(undefined);

  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [currentTx, setCurrentTx] = useState();

  const [position, setPosition] = useState(0);

  const isStakingProcess = allowStatus || stakeStatus;
  const isLoading = Boolean(isStakingProcess || isWithdrawing);

  const { allowance, balance, staked } = token[stakingContractSymbol];

  const hasBalance = ![rPending.toString(), staked.toString()].includes("0");

  const hasTrustedContract = hasTrustedForever(allowance);

  const { options: streamOptions, mainToken } =
    contracts[stakingContractSymbol];

  const {
    enabled,
    address: stakingContract,
    contractName,
    pool,
    poolType,
    poolUrl,
    disclaimer,
  } = streamOptions[currentChain];

  const isDisabled = !connected || isLoading || !enabled;

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

  const allowSuccessCallback = () => {
    setAllowStatus(SUCCESS);
    setStakeStatus(WAITING);
    setCurrentTx();
  };

  const allowErrorCallback = (e) => {
    setAllowStatus(ERROR);
    setStakeStatus(ERROR);
    setCurrentTx();
  };

  const stakeSuccessCallback = () => {
    setStakeStatus(SUCCESS);
    setCurrentTx();
  };

  const stakeErrorCallback = () => {
    setStakeStatus(ERROR);
    setCurrentTx();
  };

  const submittingCallback = () => {
    setIsWithdrawing(false);
    setAllowStatus();
    setStakeStatus();
    dispatch(refreshBalances());
    clearValue();
    setCurrentTx();
  };

  const handleExit = () => {
    setIsWithdrawing(true);
    exitStaking(
      submittingCallback,
      submittingCallback,
      handleTransaction,
      stakingContract
    );
  };

  const [isOpen, setIsOpen] = useState(false);

  const options = [
    {
      action: ({ token }) => {
        setIsOpen(false);
        setAllowStatus(WAITING);

        stakeTokens(
          allowSuccessCallback,
          allowErrorCallback,
          stakeSuccessCallback,
          stakeErrorCallback,
          token,
          address,
          trustCheck,
          handleTransaction,
          stakingContract
        );
      },
      label: "Stake",
      balanceLabel: "balance",
      balanceTitle: "BALANCE",
      currency: mainToken,
      balance,
    },
    {
      action: ({ token }) => {
        setIsWithdrawing(true);

        withdrawTokens(
          submittingCallback,
          token,
          handleTransaction,
          stakingContract
        );
      },
      label: "Withdraw",
      balanceLabel: "staked",
      balanceTitle: "TOTAL STAKED",
      icon: "staked",
      currency: mainToken,
      balance: staked,
    },
  ];

  const formik = useFormik({
    initialValues: {
      token: "",
    },
    initialErrors: {
      token: "cannot be zero",
    },
    validationSchema: Yup.object().shape({
      token: Yup.string()
        .test(
          "isTokenValueValid",
          "cannot be zero",
          (value) => value && isNotZero(value)
        )
        .test(
          "hasBalance",
          "insufficient balance",
          (value) => value && hasTokenBalance(value, options[position].balance)
        )
        .required("required"),
    }),
    onSubmit: options[position].action,
  });

  const clearValue = () => formik.resetForm();

  const handleTabChange = (tab) => {
    setPosition(tab);
    clearValue();
  };

  const isWithdrawTab = options[position].label === "Withdraw";

  return (
    <>
      <Card
        className={classnames("staking", {
          "staking--staking-process": isStakingProcess || isWithdrawing,
          "staking--disabled": !enabled,
        })}
      >
        {isExiting && (
          <Confirmation
            className="exit-confirmation"
            callback={handleExit}
            close={() => setIsExiting(false)}
            title={humanizeTransactionMethod("exit")}
          >
            <p>
              This will claim your rewards and withdraw all of you currently
              staked tokens.
            </p>
            {Boolean(hasSisterStreams) && (
              <p>
                <span>Warning: </span>this will, in the same transaction, also
                claim available rewards from{" "}
                <span>{arrayToReadableList(sisterStreams)}</span>.
              </p>
            )}
          </Confirmation>
        )}
        {isStakingProcess ? (
          <StakingProcessOverlay
            stakeStatus={stakeStatus}
            allowStatus={allowStatus}
            callback={submittingCallback}
            txHash={currentTx}
          />
        ) : null}
        <Tip
          isOpen={step === 6}
          childRef={withdrawTabRef}
          instructions={`You can withdraw your staked ${mainToken} by going to the WITHDRAW tab.`}
          direction="down"
          whiteBackground
        >
          <div className="tabs" ref={withdrawTabRef}>
            <button
              aria-label="Stake"
              className={classnames("tab", { "tab--active": position === 0 })}
              onClick={() => handleTabChange(0)}
              disabled={isStakingProcess || isWithdrawing}
            >
              <p className="label">Stake</p>
            </button>
            <button
              aria-label="Withdraw"
              className={classnames("tab", { "tab--active": position === 1 })}
              onClick={() => handleTabChange(1)}
              disabled={isStakingProcess || isWithdrawing}
            >
              <p className="label">Withdraw</p>
            </button>
          </div>
        </Tip>
        <form onSubmit={formik.handleSubmit}>
          {isWithdrawing ? <LoadingOverlay txHash={currentTx} /> : null}
          <div className="balance">
            <div className="balance__wrapper">
              <img alt="balance icon" src={CardIcon} />
              <Info left body={toDecimalString(options[position].balance)}>
                <div className="text">
                  <p>Your {options[position].balanceLabel}: </p>
                  <p>
                    {`${truncateTokenValue(options[position].balance)} ${
                      options[position].currency
                    }`}
                  </p>
                </div>
              </Info>
            </div>
            <div className="icon">
              <img
                alt={`${stakingContractSymbol} icon`}
                className="main"
                src={currencyIcons(contractName)}
              />
              <img alt="rUMB icon" className="secondary" src={UmbTokenAlt} />
            </div>
          </div>

          <div
            className={classnames("input-wrapper", {
              "input-wrapper--tutorial": step > 0,
            })}
          >
            {formik.touched.token && formik.errors.token ? (
              <p className="errors">*{formik.errors.token}</p>
            ) : null}
            {contractName !== UMB && position === 0 ? (
              <p className="uniswap-disclaimer">
                <span>*Please note:</span> Before staking, you need to have
                added Liquidity to {pool} Pool on {poolType}:{" "}
                <a target="_blank" rel="noopener noreferrer" href={poolUrl}>
                  Here!
                </a>
              </p>
            ) : null}
            <div className="disclaimer-input">
              <p className="insert-disclaimer">
                Amount of {mainToken} tokens you want to{" "}
                {options[position].label}:
              </p>
              <Tip
                isOpen={Object.keys(inputSteps).includes(step.toString())}
                childRef={inputRef}
                instructions={inputSteps[step]}
                direction="down"
                whiteBackground
              >
                <input
                  aria-label={`token amount to ${options[position].label} input`}
                  className="staking-field"
                  disabled={isDisabled || (position === 0 && isPaused)}
                  placeholder="0.00"
                  name="token"
                  ref={inputRef}
                  value={formik.values.token}
                  onChange={({ target: { value } }) => {
                    formik.setFieldValue(
                      "token",
                      formatMonetaryInputValue(value, formik.values.token)
                    );
                  }}
                  onBlur={formik.handleBlur}
                />
              </Tip>
            </div>
            <Tip
              isOpen={step === 7}
              instructions='After setting how many UMB tokens you want to withdraw, click here. You can also set all of your UMB tokens for withdraw by clicking the "MAX" button above.'
              childRef={withdrawButtonRef}
              direction="down"
              whiteBackground
            >
              <div className="button-container" ref={withdrawButtonRef}>
                <Button
                  onClick={() =>
                    formik.setFieldValue(
                      "token",
                      toDecimalString(options[position].balance)
                    )
                  }
                  type="plain"
                  label="Max"
                  disabled={isDisabled || (position === 0 && isPaused)}
                />
              </div>
            </Tip>
          </div>

          {!enabled ? (
            <div className="disclaimer">
              <p>{disclaimer}</p>
            </div>
          ) : undefined}

          {position === 0 && isPaused ? (
            <div className="disclaimer">
              <p>
                This staking stream is paused.
                <br /> Withdrawing and claiming are still available.
              </p>
            </div>
          ) : undefined}

          <div className="cta-container">
            {position === 0 ? (
              <Tip
                isOpen={step === 5}
                childRef={checkBoxRef}
                whiteBackground
                instructions="If you want to skip the Allowance step, check this option. By doing so, you'll only have to go through the Allowance step once. Otherwise, the same amount of UMB will be set for Allowance and Staking, meaning two transactions will be needed in order to stake tokens."
                direction="down"
                callback={() => setTrustCheck(true)}
                unmountCallback={() => setTrustCheck(false)}
              >
                <div className="trust-forever" ref={checkBoxRef}>
                  <Info
                    body="Already trusted"
                    enabled={hasTrustedContract}
                    right
                  >
                    <div className="input-label">
                      <input
                        type="checkbox"
                        name="trust-forever-input"
                        disabled={hasTrustedContract || isDisabled || isPaused}
                        checked={trustCheck || hasTrustedContract}
                        aria-label="Trust this contract forever"
                        onChange={(event) =>
                          setTrustCheck(event.target.checked)
                        }
                      />
                      <label name="trust-forever">Trust Contract Forever</label>
                    </div>
                  </Info>
                  <Info
                    body="Select this so that you do not have to pay an additional gas fee to ‘allow’ a max number of tokens to be staked."
                    title="Trust Contract Forever:"
                    right
                  >
                    <img
                      alt="about trust this contract forever"
                      src={QustionInfoAlt}
                    />
                  </Info>
                </div>
              </Tip>
            ) : (
              <Tip
                isOpen={step === 8}
                instructions="You can withdraw all of your staked UMB while claiming all of your Reward Umbrella Tokens in a single transaction by clicking here."
                childRef={claimRef}
                direction="down"
                whiteBackground
              >
                <div className="button-wrapper" ref={claimRef}>
                  <Button
                    type="secondary"
                    className="claim-button"
                    disabled={isDisabled || !hasBalance}
                    onClick={() => setIsExiting(true)}
                    label="Claim Rewards & Withdraw All"
                  />
                </div>
              </Tip>
            )}
            {isOpen && (
              <StakingConfirmationLayer
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                currentAllowance={allowance}
                tokenAmount={formik.values.token}
              />
            )}
            <Button
              className="cta-button"
              isSubmit={isWithdrawTab}
              handleClick={isWithdrawTab ? null : () => setIsOpen(true)}
              disabled={
                isDisabled ||
                formik.errors.token ||
                (position === 0 && isPaused)
              }
              label={`${options[position].label} ${mainToken}`}
            />
          </div>
        </form>
      </Card>
    </>
  );
}

StakingCard.propTypes = propTypes;

export default StakingCard;
