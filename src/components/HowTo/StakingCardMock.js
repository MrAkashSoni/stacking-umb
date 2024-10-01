import React from "react";
import { Button, Card } from "components/ui";
import { Card as CardIcon, UmbTokenAlt, QustionInfoAlt } from "assets/images";
import { BigNumber } from "ethers";
import { StakingProcessOverlay } from "components";
import classnames from "classnames";

import { currencyIcons } from "utils";

import "../StakingCard/stakingCard.scss";

/*eslint-disable-next-line*/
function StakingProcessMock({ position, stakeStatus, allowStatus }) {
  const options = [
    {
      action: () => { },
      label: "Stake",
      balanceTitle: "BALANCE",
      currency: "UMB",
      balance: BigNumber.from("0x2B5E3AF16B18800000"),
    },
    {
      action: () => { },
      label: "Withdraw",
      balanceTitle: "TOTAL STAKED",
      icon: "staked",
      currency: "UMB",
      balance: BigNumber.from("0xAD78EBC5AC6200000"),
    },
  ];

  return (
    <Card className="staking staking--mock staking--staking-process">
      <div
        style={{
          position: "absolute",
          background: "rgba(0,0,0,0)",
          width: "100%",
          height: "100%",
          zIndex: 3,
        }}
      />
      {stakeStatus ? (
        <StakingProcessOverlay
          stakeStatus={stakeStatus}
          allowStatus={allowStatus}
          callback={() => { }}
        />
      ) : null}
      <div className="tabs">
        <button
          aria-label="Stake"
          className={classnames("tab", { "tab--active": position === 0 })}
        >
          <p className="label">Stake</p>
        </button>
        <button
          aria-label="Withdraw"
          className={classnames("tab", { "tab--active": position === 1 })}
        >
          <p className="label">Withdraw</p>
        </button>
      </div>
      <form>
        <div className="balance">
          <div className="balance__wrapper">
            <img alt="balance icon" src={CardIcon} />
            <div className="text">
              <p>Your {position === 1 ? "staked" : "balance"}:</p>
              <p>12,013.37 UMB</p>
            </div>
          </div>
          <div className="icon">
            <img alt="UMB icon" className="main" src={currencyIcons("UMB")} />
            <img alt="rUMB icon" className="secondary" src={UmbTokenAlt} />
          </div>
        </div>
        <div className="input-wrapper">
          <div className="disclaimer-input">
            <p className="insert-disclaimer">
              Amount of UMB tokens you want to {options[position].label}:
            </p>
            <input
              aria-label={`token amount to ${options[position].label} input`}
              className="staking-field"
              placeholder="0.00"
              name="token"
            />
          </div>
          <div className="button-container">
            <Button type="plain" label="Max" />
          </div>
        </div>
        <div className="cta-container">
          {position === 0 ? (
            <div className="trust-forever">
              <div className="input-label">
                <input type="checkbox" name="trust-forever-input" />
                <label name="trust-forever">Trust Contract Forever</label>
                <img
                  alt="about trust this contract forever"
                  src={QustionInfoAlt}
                />
              </div>
            </div>
          ) : (
            <Button
              type="secondary"
              className="claim-button"
              label="Claim Rewards & Withdraw All"
            />
          )}
          <Button
            className="cta-button"
            label={`${options[position].label} UMB`}
          />
        </div>
      </form>
    </Card>
  );
}

export default StakingProcessMock;
