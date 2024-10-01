import React, { Fragment } from "react";
import classnames from "classnames";
import {
  WAITING,
  ERROR,
  SUCCESS,
  UNSENT,
  statuses,
  availableChains,
} from "utils/constants";
import { truncate } from "utils/formatters";

import { scanUrlForTxAndChain } from "utils/urls";

import { Button } from "components/ui";
import { takeLastPropFromObjects } from "utils/formatters";
import { Success } from "assets/images";

import PropTypes from "prop-types";

import "./processing.scss";

const propTypes = {
  chain: PropTypes.oneOf(availableChains).isRequired,
  className: PropTypes.string,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["wallet", "blockchain", "blockchainConfirmation"]),
      label: PropTypes.string,
      status: PropTypes.oneOf(statuses),
      hash: PropTypes.string,
      message: PropTypes.string,
      confirmations: PropTypes.number,
      targetConfirmations: PropTypes.number,
    })
  ).isRequired,
  ctaSuccessCallback: PropTypes.func,
  ctaErrorCallback: PropTypes.func,
};

const defaultProps = {
  className: undefined,
  ctaSuccessCallback: () => undefined,
  ctaErrorCallback: () => undefined,
};

const statusIconPropTypes = {
  status: PropTypes.oneOf(statuses),
};

const labelForType = {
  wallet: {
    [WAITING]: "Waiting for User Confirmation",
    [ERROR]: "Failed",
    [UNSENT]: "Not Sent",
    [SUCCESS]: "Submitted",
    [undefined]: "On Queue",
  },
  blockchain: {
    [WAITING]: "Processing",
    [ERROR]: "Failed",
    [UNSENT]: "Not Sent",
    [SUCCESS]: "Processed",
    [undefined]: "On Queue",
  },
  blockchainConfirmation: {
    [WAITING]: "Waiting for blocks",
    [ERROR]: "Transaction Failed",
    [UNSENT]: "Transaction Not Sent",
    [SUCCESS]: "Processed",
    [undefined]: "Waiting for transaction",
  },
};

function StatusIcon({ status }) {
  switch (status) {
    case WAITING:
      return <div className="waiting" />;
    case ERROR:
    case UNSENT:
      return <div className="error" />;
    case SUCCESS:
      return <img src={Success} alt="" />;
    default:
      return <div className="queue" />;
  }
}

function Processing({
  steps,
  chain,
  ctaSuccessCallback,
  ctaErrorCallback,
  className,
}) {
  const latestHash = takeLastPropFromObjects(steps, "hash");
  const latestBlockchainStep = steps.find(
    (step) => step.hash && step.hash === latestHash && step.status === WAITING
  );

  const isWaitingForLatestBlockchainCall =
    latestBlockchainStep && latestBlockchainStep.status === WAITING;

  const stepStatuses = steps.map(({ status }) => status);

  const isWaitingForTransaction =
    isWaitingForLatestBlockchainCall &&
    latestBlockchainStep.type === "blockchain";

  const isWaitingForConfirmation =
    isWaitingForLatestBlockchainCall &&
    latestBlockchainStep.type === "blockchainConfirmation";

  const hasErrors = stepStatuses.includes(ERROR);
  const allSuccess = stepStatuses.every((status) => status === SUCCESS);

  const isDone = hasErrors || allSuccess;

  const hasPastErrors = (stepIndex) => {
    const latestError = [...steps]
      .reverse()
      .find(({ status }) => status === ERROR);

    return Boolean(latestError) && stepIndex > steps.indexOf(latestError);
  };

  return (
    <div className={classnames("processing", { [className]: className })}>
      <p className="processing__title">
        {isWaitingForTransaction
          ? "Waiting to process… You should see the transaction link below."
          : ""}
        {isWaitingForConfirmation ? (
          <>
            Waiting for confirmation blocks…
            <br />[{" "}
            {`${latestBlockchainStep.confirmations} / ${latestBlockchainStep.targetConfirmations} ]`}
          </>
        ) : (
          ""
        )}
      </p>
      <div className="processing__steps">
        {steps.map((step, index) => {
          const stepStatus = hasPastErrors(index) ? UNSENT : step.status;
          const isLast = steps.length - 1 === index;

          return (
            <Fragment
              key={`processing__steps-step-status-${index}-${JSON.stringify(
                step
              )}`}
            >
              <div className="step">
                <StatusIcon status={stepStatus} />
                <p className="step__label">
                  {step.label}
                  <span className="step__comment">
                    {step?.message ?? labelForType[step.type][stepStatus]}
                  </span>
                </p>
              </div>
              {!isLast ? (
                <div
                  className={classnames("step__path", {
                    [`step__path--${stepStatus}`]: stepStatus,
                    [`step__path--ERROR`]: hasPastErrors(index + 1),
                  })}
                />
              ) : null}
            </Fragment>
          );
        })}
      </div>
      {latestHash ? (
        <div className="processing__explorer">
          <p>
            View Transaction on Block Explorer{" "}
            <a
              href={scanUrlForTxAndChain(latestHash, chain)}
              rel="noopener noreferrer"
              target="_blank"
            >
              {truncate(latestHash)}
            </a>
          </p>
          {isWaitingForLatestBlockchainCall ? (
            <div className="waiting waiting--small" />
          ) : null}
        </div>
      ) : null}
      <Button
        label="Okay"
        onClick={hasErrors ? ctaErrorCallback : ctaSuccessCallback}
        disabled={!isDone}
      />
    </div>
  );
}

Processing.propTypes = propTypes;
Processing.defaultProps = defaultProps;
StatusIcon.propTypes = statusIconPropTypes;

export default Processing;
