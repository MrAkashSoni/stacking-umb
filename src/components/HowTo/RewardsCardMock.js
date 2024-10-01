import React from "react";

import { Card, Button, Heading } from "components/ui";
import { Card as CardIcon, QustionInfoAlt } from "assets/images";

import "../RewardsCard/rewardsCard.scss";

function RewardsCardMock() {
  return (
    <Card className="rewards-card rewards-card--mock">
      <div
        style={{
          position: "absolute",
          background: "rgba(0,0,0,0)",
          width: "100%",
          height: "100%",
        }}
      />
      <Heading type="plain" highlightSpan size={3}>
        Your <span>Wallet</span>
      </Heading>
      <div className="main-balances">
        <img className="card-icon" alt="" src={CardIcon} />
        <div className="main-token">
          <p>
            Your balance: <span>10,000 UMB</span>
          </p>
        </div>
      </div>
      <div className="staked-info-wrapper">
        <p className="staked-info-wrapper__info">
          Daily Available Tokens: <span>15,000 UMB</span>
        </p>

        <p className="staked-info-wrapper__info">
          Overall Staked Tokens: <span>64,000,000.00 UMB</span>
        </p>

        <div className="staked-info-wrapper__with-info">
          <p className="staked-info-wrapper__info">
            Current Annual Reward: <span>~15%</span>
          </p>
          <img alt="about trust this contract forever" src={QustionInfoAlt} />
        </div>

        <div className="divisor" />

        <p className="staked-info-wrapper__info">
          Your Staked UMB: <span>37,000.00 UMB</span>
        </p>

        <p className="staked-info-wrapper__info">
          Pending UMB: <span>4,000.00 UMB</span>
        </p>
      </div>
      <div className="cta-container">
        <div className="button-container">
          <Button
            type="secondary"
            className="cta-button"
            label="Claim Rewards"
            handleClick={() => {}}
          />
        </div>
      </div>
    </Card>
  );
}

export default RewardsCardMock;
