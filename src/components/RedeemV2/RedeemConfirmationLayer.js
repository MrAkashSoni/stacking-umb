import React from "react";
import PropTypes from "prop-types";

import { Button, Info, Layer } from "components/ui";

import { CircledArrow, UmbTokenAlt } from "assets/images";

import { currencyIcons, truncateTokenValue, toDecimalString } from "utils";

import "./redeemConfirmationLayer.scss";
import { useRedeemV2 } from "utils/store/redeemV2";

const propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
};

function RedeemConfirmationLayer({ setIsOpen, callback }) {
  const handleClickRedeem = () => {
    setIsOpen(false);
    callback();
  };

  const {
    state: {
      rewardToken: { balance, symbol: rewardSymbol },
      token: { symbol: tokenSymbol },
    },
  } = useRedeemV2();

  return (
    <Layer
      className="submit-redeem-layer"
      title="Redeem"
      close={() => setIsOpen(false)}
      fillMobile
    >
      <div className="submit-redeem-layer__token-info">
        <div className="token-data">
          <span className="direction">{rewardSymbol} to Redeem</span>
          <Info
            className="balance-tooltip"
            center
            wrap
            body={toDecimalString(balance)}
          >
            <span className="amount">{truncateTokenValue(balance)}</span>
          </Info>
          <div className="symbol">
            <img alt="" src={UmbTokenAlt} />
            <span>{rewardSymbol}</span>
          </div>
        </div>

        <img src={CircledArrow} alt="" />

        <div className="token-data">
          <span className="direction">{tokenSymbol} to be Redeemed</span>
          <Info
            className="balance-tooltip"
            center
            wrap
            body={toDecimalString(balance)}
          >
            <span className="amount">{truncateTokenValue(balance)}</span>
          </Info>
          <div className="symbol">
            <img alt="" src={currencyIcons("umb")} />
            <span>{tokenSymbol}</span>
          </div>
        </div>
      </div>
      <p className="submit-redeem-layer__instructions">
        Please review the amount of tokens you are trying to redeem before
        continuing. To proceed with the Redeeming process, click the button
        below.
      </p>
      <Button
        className="cta-button"
        label="Redeem Tokens"
        handleClick={handleClickRedeem}
      />
    </Layer>
  );
}

RedeemConfirmationLayer.propTypes = propTypes;

export default RedeemConfirmationLayer;
