import React, { useReducer } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { Card, Info, Processing, Button } from "components/ui";
import * as Yup from "yup";
import { useFormik } from "formik";
import { isEmpty } from "ramda";
import { Card as CardIcon, UmbTokenAlt } from "assets/images";
import { useWallet } from "utils/store/Wallet";

import { useContract, transactionSet } from "utils/store";
import * as reducer from "./WithdrawCardReducer";

import {
  truncateTokenValue,
  formatMonetaryInputValue,
  hasTokenBalance,
  isNotZero,
  toDecimalString,
  currencyIcons,
} from "utils";

import { withdrawTokens, stakeTokens } from "utils/services";

import "./withdrawCard.scss";

const propTypes = {
  contractAddress: PropTypes.string.isRequired,
  currentContractAddress: PropTypes.string.isRequired,
  totalStaked: PropTypes.object.isRequired,
  mainToken: PropTypes.string.isRequired,
  currentRewardsSymbol: PropTypes.string.isRequired,
  stream: PropTypes.string.isRequired,
};

function WithdrawCard({
  contractAddress,
  currentContractAddress,
  totalStaked,
  mainToken,
  currentRewardsSymbol,
  stream,
}) {
  const { chainId, address } = useWallet();

  const [steps, dispatch] = useReducer(reducer.reducer, reducer.initialSteps);
  const { dispatch: contractDispatch } = useContract();

  const isProcessing = !isEmpty(steps);

  const handleWithdraw = ({ tokenValue }) => {
    dispatch({ type: reducer.WITHDRAW_REQUESTED });

    withdrawTokens(
      () => dispatch({ type: reducer.WITHDRAW_SUCCESS }),
      tokenValue,
      (tx) => handleTxSet(reducer.WITHDRAW_HASH_SET, tx),
      contractAddress,
      () => dispatch({ type: reducer.WITHDRAW_ERROR })
    );
  };

  const formik = useFormik({
    initialValues: {
      tokenValue: "",
    },
    initialErrors: {
      tokenValue: "cannot be zero",
    },
    validationSchema: Yup.object().shape({
      tokenValue: Yup.string()
        .test(
          "isTokenValueValid",
          "cannot be zero",
          (value) => value && isNotZero(value)
        )
        .test(
          "hasBalance",
          "insufficient balance",
          (value) => value && hasTokenBalance(value, totalStaked)
        )
        .required("required"),
    }),
    onSubmit: handleWithdraw,
  });

  const handleProcessingCta = () => {
    dispatch({ type: reducer.RESET });
    formik.resetForm();
  };

  const maySubmit = isEmpty(formik.errors);

  const handleTxSet = (type, tx) => {
    dispatch({ type, payload: tx.hash });

    contractDispatch(
      transactionSet({
        ...tx,
        address,
        stakingContractSymbol: stream,
        chainId,
      })
    );
  };

  const handleRestakeWithdrawSuccess = () => {
    dispatch({ type: reducer.RESTAKE_WITHDRAW_SUCCESS });

    stakeTokens(
      () => dispatch({ type: reducer.RESTAKE_ALLOWANCE_SUCCESSFULL }),
      () => dispatch({ type: reducer.RESTAKE_ALLOWANCE_ERROR }),
      () => dispatch({ type: reducer.RESTAKE_STAKING_SUCCESSFULL }),
      () => dispatch({ type: reducer.RESTAKE_STAKING_ERROR }),
      formik.values.tokenValue,
      address,
      false,
      (tx) => handleTxSet(reducer.RESTAKE_STAKING_HASH_SET, tx),
      currentContractAddress
    );
  };

  const handleRestake = () => {
    const { tokenValue } = formik.values;
    dispatch({ type: reducer.RESTAKE_WITHDRAW_REQUESTED });

    withdrawTokens(
      handleRestakeWithdrawSuccess,
      tokenValue,
      (tx) => handleTxSet(reducer.RESTAKE_WITHDRAW_HASH_SET, tx),
      contractAddress,
      () => dispatch({ type: reducer.RESTAKE_WITHDRAW_FAILED })
    );
  };

  return (
    <Card
      className={classnames("withdraw-card", {
        "withdraw-card--processing": isProcessing,
      })}
    >
      <p className="withdraw-card__header">Withdraw</p>
      {isProcessing ? (
        <Processing
          steps={steps}
          chain={String(chainId)}
          ctaSuccessCallback={handleProcessingCta}
          ctaErrorCallback={handleProcessingCta}
        />
      ) : (
        <>
          <form onSubmit={formik.handleSubmit} className="withdraw-card__form">
            <div className="balance">
              <div className="balance__wrapper">
                <img alt="" src={CardIcon} />
                <Info left body={toDecimalString(totalStaked)}>
                  <div className="text">
                    <p>Total Staked: </p>
                    <p>{`${truncateTokenValue(totalStaked)} ${mainToken}`}</p>
                  </div>
                </Info>
              </div>
              <div className="icon">
                <img
                  alt=""
                  className="main"
                  src={currencyIcons(currentRewardsSymbol)}
                />
                <img alt="" className="secondary" src={UmbTokenAlt} />
              </div>
            </div>
            <div className="form__input">
              <div className="disclaimer-input">
                <p className="insert-disclaimer">
                  Insert amount of {mainToken} tokens you want to withdraw:
                </p>
                <input
                  aria-label="amount of tokens to withdraw"
                  placeholder="0.00"
                  name="tokenValue"
                  value={formik.values.tokenValue}
                  onChange={({ target: { value } }) => {
                    formik.setFieldValue(
                      "tokenValue",
                      formatMonetaryInputValue(value, formik.values.tokenValue)
                    );
                  }}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="button-container">
                {formik.touched.tokenValue && formik.errors.tokenValue ? (
                  <p className="errors">*{formik.errors.tokenValue}</p>
                ) : null}
                <Button
                  onClick={() =>
                    formik.setFieldValue(
                      "tokenValue",
                      toDecimalString(totalStaked)
                    )
                  }
                  type="plain"
                  label="Max"
                />
              </div>
            </div>
            <div className="form__actions">
              <Button type="secondary" disabled={!maySubmit} isSubmit>
                Withdraw {mainToken}
              </Button>
              <Button disabled={!maySubmit} handleClick={handleRestake}>
                Withdraw & Restake for {currentRewardsSymbol}
              </Button>
            </div>
          </form>
        </>
      )}
    </Card>
  );
}

WithdrawCard.propTypes = propTypes;

export default WithdrawCard;
