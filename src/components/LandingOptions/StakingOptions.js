import React from "react";

import { LoadingState, Heading } from "components/ui";

import { useContract } from "utils/store";

import { ASTRO_STREAM, availableStreams } from "utils/constants";

import "./landingOptions.scss";
import StakingOption from "./StakingOption";

function StakingOptions() {
  const {
    state: { isLoading },
  } = useContract();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="landing-options" id="staking">
      <Heading type="primary" highlightSpan size={1}>
        Umbrella <span>Streams</span>
      </Heading>
      <p className="subtitle">
        Umbrella Streams are Umbrella Smart Contracts that reward users with
        more Umbrella Tokens for staking their UMB or UMB Liquidity Pool (LP)
        tokens.
      </p>
      <div className="landing-options__cards">
        {availableStreams.map((contractName) => {
          return (
            contractName !== ASTRO_STREAM && (
              <StakingOption
                key={`${contractName}-staking-option`}
                stream={contractName}
              />
            )
          );
        })}
      </div>
    </div>
  );
}

export default StakingOptions;
