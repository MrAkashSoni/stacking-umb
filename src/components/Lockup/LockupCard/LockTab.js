import React, { useState } from "react";
import { isEmpty } from "ramda";
import * as Yup from "yup";
import { useFormik } from "formik";
import classnames from "classnames";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useWallet } from "utils/store/Wallet";

import {
  currencyIcons,
  truncateTokenValue,
  formatMonetaryInputValue,
  hasTokenBalance,
  isNotZero,
  toDecimalString,
  hasTrustedForever,
} from "utils";

import {
  Info,
  Button,
  DropdownSelect,
  Checkbox,
  Processing,
} from "components/ui";

import { readableMultiplier } from "utils/formatters";

import { useLockup } from "utils/store/lockup";

import { Card as CardIcon } from "assets/images";

import { periodToLabel } from "utils";

import LockingLayer from "./LockingLayer";

import "./lockTab.scss";

function LockTab({ disabled }) {
  const {
    lockTokens,
    clearTransactions,
    state: {
      isTransactioning,
      lockSteps,
      periodsAndMultipliers,
      token: { symbol, balance, allowance },
      rewardToken: { symbol: rewardTokenSymbol },
    },
  } = useLockup();

  const queryClient = useQueryClient();

  const [firstPeriodAndMultiplier] = periodsAndMultipliers;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldTrustForever, setShouldTrustForever] = useState(false);
  const [multiplier, setMultiplier] = useState(undefined);

  const { chainId } = useWallet();
  const { id } = useParams();

  const hasTrustedContract = hasTrustedForever(allowance);

  const toggleShouldTrustForever = () =>
    setShouldTrustForever(!shouldTrustForever);

  const handleSubmit = () => setIsSubmitting(true);

  const formik = useFormik({
    initialValues: {
      period: firstPeriodAndMultiplier?.period,
      amount: "",
    },
    initialErrors: {
      amount: "cannot be zero",
    },
    validationSchema: Yup.object().shape({
      amount: Yup.string()
        .test(
          "isTokenValueValid",
          "cannot be zero",
          (value) => value && isNotZero(value)
        )
        .test(
          "hasBalance",
          "insufficient balance",
          (value) => value && hasTokenBalance(value, balance)
        )
        .required("required"),
    }),
    onSubmit: handleSubmit,
  });

  const handleSelectPeriod = ({ multiplier, period }) => {
    setMultiplier(multiplier);

    formik.setFieldValue("period", period);
  };

  const handleLock = () => {
    lockTokens({
      ...formik.values,
      trustContract: shouldTrustForever,
      stakingContractSymbol: id,
    });

    setIsSubmitting(false);
  };

  const handleFinished = () => {
    clearTransactions();
    formik.resetForm();
    setMultiplier(periodsAndMultipliers[0].multiplier);
    queryClient.invalidateQueries(["locks"]);
  };

  return isEmpty(lockSteps) ? (
    <>
      {isSubmitting && (
        <LockingLayer
          currency={symbol}
          rewardCurrency={rewardTokenSymbol}
          close={() => setIsSubmitting(false)}
          value={formik.values.amount}
          period={periodToLabel({ period: formik.values.period })}
          callback={handleLock}
        />
      )}
      <form className="lockup-tab" onSubmit={formik.handleSubmit}>
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

        <div className="lockup-tab__inputs">
          <div className="period">
            <p className="label">Lock Tokens for:</p>
            <DropdownSelect
              disabled={!periodsAndMultipliers.length || disabled}
              label="Select a period to lock..."
            >
              {periodsAndMultipliers.map((pAndM) => (
                <p
                  key={`period-option-for-${JSON.stringify(pAndM)}`}
                  onClick={() => handleSelectPeriod(pAndM)}
                  className="period-option"
                >
                  {periodToLabel({ period: pAndM.period })}
                  {` (${readableMultiplier(pAndM.multiplier)}x multiplier)`}
                </p>
              ))}
            </DropdownSelect>
            {multiplier && (
              <p className="label">
                Reward multiplier: <span>{readableMultiplier(multiplier)}</span>
              </p>
            )}
          </div>
          <div className="divider" />
          <div className="amount">
            <label className="label" htmlFor="amount">
              Insert the amount of {symbol} tokens you want to lock:
            </label>
            <input
              className={classnames("input", {
                "input--error": formik.errors.amount && formik.touched.amount,
              })}
              placeholder="0.00"
              name="amount"
              id="amount"
              value={formik.values.amount}
              onChange={({ target: { value } }) => {
                formik.setFieldValue(
                  "amount",
                  formatMonetaryInputValue(value, formik.values.amount)
                );
              }}
              onBlur={formik.handleBlur}
              disabled={disabled}
            />
            {formik.errors.amount && formik.touched.amount && (
              <p className="disclaimer disclaimer--error">
                {formik.errors.amount}
              </p>
            )}
            <Button
              label="Max"
              type="plain"
              onClick={() =>
                formik.setFieldValue("amount", toDecimalString(balance))
              }
              disabled={false}
            />
          </div>
        </div>
        <Info body="Already trusted" enabled={hasTrustedContract} left>
          <div>
            <Checkbox
              disabled={hasTrustedContract || disabled}
              isChecked={hasTrustedContract || shouldTrustForever}
              onClick={toggleShouldTrustForever}
              label="Trust contract forever"
              name="trust-forever"
            />
          </div>
        </Info>
        <Button
          isSubmit
          disabled={formik.errors.amount || isTransactioning || disabled}
          className="submit"
          label={`Lock ${symbol}`}
        />
        <p className="disclaimer">
          *stake {symbol} tokens to earn {rewardTokenSymbol}
        </p>

        {disabled && (
          <div className="disabled-disclaimer">
            <span>
              As of the rUMB2 redemption start date, new Lockups are disabled.
            </span>
          </div>
        )}
      </form>
    </>
  ) : (
    <Processing
      className="lockup-tab--processing"
      steps={lockSteps}
      chain={String(chainId)}
      ctaSuccessCallback={handleFinished}
      ctaErrorCallback={handleFinished}
    />
  );
}

export default LockTab;
