import React from "react";

import { useWallet } from "utils/store/Wallet";
import { chainData } from "utils/constants";
import { QustionInfoAlt } from "assets/images";
import { nodeIcons, getChainFromNetworkId } from "utils";

import "./chainIndicator.scss";

function ChainIndicator() {
  const { isConnectedProperly, chainId } = useWallet();

  const network = chainData[chainId];
  const icon = chainId && nodeIcons(getChainFromNetworkId(chainId));

  return (
    <div className="chain-indicator">
      <img src={QustionInfoAlt} alt="" />
      <div className="chain-indicator__chain">
        {isConnectedProperly && network ? (
          <>
            <p>You are on: </p>
            <img alt="" className="chain-indicator__icon" src={icon} />
            <p>
              <span>{network.shortNetName}</span>
            </p>
          </>
        ) : (
          <p>Wallet not connected</p>
        )}
      </div>
    </div>
  );
}

export default ChainIndicator;
