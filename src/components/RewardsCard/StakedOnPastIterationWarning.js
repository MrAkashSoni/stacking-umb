import React, { useState } from "react";

import PropTypes from "prop-types";

import { useLocalStorage } from "utils/hooks";
import { Layer, Button, Checkbox } from "components/ui";

import Countdown from "react-countdown";

import { useHistory } from "react-router-dom";

import "./stakedOnPastIterationWarning.scss";

const propTypes = {
  stream: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired,
  details: PropTypes.array.isRequired,
};

function StakedOnPastIterationWarning({ stream, callback, details }) {
  const [shouldDismissForever, setShouldDismissForever] = useState(false);
  const [mayDismiss, setMayDismiss] = useState(false);

  const toggleShouldDismiss = () =>
    setShouldDismissForever(!shouldDismissForever);

  const history = useHistory();

  const { update: updateHasDismissedForever } = useLocalStorage(
    "hasDismissedPastIteration"
  );

  const clearModalForever = () => {
    if (shouldDismissForever) {
      updateHasDismissedForever(true);
    }
  };

  const handleDismiss = () => {
    callback();
    clearModalForever();
  };

  const handleRedirect = (address) => {
    handleDismiss();
    history.push(`/past-rewards/${stream}/${address}`);
  };

  return (
    <Layer fillMobile className="staked-on-past-iteration-warning">
      <p className="staked-on-past-iteration-warning__text">
        <span>Please note: </span>We noticed that you have unclaimed rewards
        and/or tokens staked on streams that are
        <span> no longer generating</span> rewards. Please restake them for UMB
        to start generating rewards again.
      </p>
      <div className="staked-on-past-iteration-warning__redirects">
        {details.map(({ contractAddress, iteration }) => (
          <Button
            key={`button-${contractAddress}`}
            handleClick={() => handleRedirect(contractAddress)}
            label={`Go to V${iteration + 1} Details`}
          />
        ))}
      </div>
      <Checkbox
        onClick={toggleShouldDismiss}
        isChecked={shouldDismissForever}
        label="don't show again"
        name="dismiss-past-iterations"
      />
      <div className="staked-on-past-iteration-warning__actions">
        {!mayDismiss ? (
          <Countdown
            date={Date.now() + 5000}
            onComplete={() => setMayDismiss(true)}
            renderer={({ seconds }) => (
              <Button
                handleClick={() => {}}
                disabled
                type="secondary"
                label={seconds}
              />
            )}
          />
        ) : (
          <Button
            handleClick={handleDismiss}
            type="secondary"
            label="Dismiss"
            disabled={!mayDismiss}
          />
        )}
      </div>
    </Layer>
  );
}

StakedOnPastIterationWarning.propTypes = propTypes;

export default StakedOnPastIterationWarning;
