import React from "react";

import { Button, Heading } from "components/ui";
import { UmbTokenAlt } from "assets/images";

import "./intro.scss";

function Intro() {
  return (
    <div className="intro">
      <div className="intro__content">
        <div className="info">
          <Heading type="primary" highlightSpan>
            Rewards, <span>Simplified</span>
          </Heading>
          <p className="info__text">
            Welcome to Umbrella Network’s Staking Portal. Here you can earn
            rewards by staking UMB or UMB LP tokens for more Umbrella tokens
            (UMB) through our streams.
          </p>
          <div className="info__actions">
            <Button label="Stake UMB" url="#staking" isNewTab={false} />
          </div>
        </div>
        <img alt="" src={UmbTokenAlt} />
      </div>
    </div>
  );
}

export default Intro;
