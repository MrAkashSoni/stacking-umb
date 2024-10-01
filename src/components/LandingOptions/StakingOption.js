import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useWallet } from "utils/store/Wallet";

import { Card, ConnectButton, Heading, Info, Toggle } from "components/ui";
import { UmbTokenAlt, QustionInfoAlt } from "assets/images";
import {
  currencyIcons,
  networkMatchesChain,
  getChainFromNetworkId,
  nodeIcons,
} from "utils";

import { allowedNetworks, chainData, ETH, contracts } from "utils/constants";
import { getScanUrlFromChain } from "utils/urls";

const propTypes = {
  stream: PropTypes.string.isRequired,
};

const stakingInstruction = (isConnected, isTheCorrectChain) => {
  if (isConnected) {
    return isTheCorrectChain ? "Go To Staking" : "Switch Chain to Stake";
  }
};

function StakingOption({ stream }) {
  const [chainSelection, setChainSelection] = useState(ETH);

  const { isConnectedProperly, chain } = useWallet();

  useEffect(() => {
    if (chain?.id && isConnectedProperly) {
      setChainSelection(getChainFromNetworkId(chain.id));
    }
  }, [chain, isConnectedProperly]);

  const allowedNetworkForChain = allowedNetworks.find((network) =>
    networkMatchesChain(network, chainSelection)
  );

  const scanUrl = getScanUrlFromChain(chainData, allowedNetworkForChain);

  const { description, name, chains, options, isLockup, path } =
    contracts[stream];

  const { enabled, disclaimer, address, pair, contractName } =
    options[chainSelection];

  const isTheCorrectChain = networkMatchesChain(chain?.id, chainSelection);

  const chainOptions = chains.map((chain) => ({
    name: chain,
    icon: nodeIcons(chain),
    ariaLabel: `${chain}-chain-option`,
  }));

  return (
    <Card
      className="landing-option-card"
      key={`${stream}-landing-staking-option-card`}
    >
      <div className="icons">
        <Toggle
          onClick={setChainSelection}
          options={chainOptions}
          selectedOption={chainSelection}
        />

        <div className="icon">
          <img alt="" className="main" src={currencyIcons(contractName)} />
          {!isLockup && <img alt="" className="secondary" src={UmbTokenAlt} />}
        </div>
      </div>
      <div className="title">
        <Heading type="primary" size={1}>
          {name}
        </Heading>
        <Info body={description}>
          <img alt={`${name} info`} className="icon" src={QustionInfoAlt} />
        </Info>
      </div>
      <a
        className="contract-scan-url"
        target="_blank"
        rel="noopener noreferrer"
        href={`${scanUrl}/address/${address}`}
      >
        <span>{pair}</span>
        <br />
        <span>Token Staking Contract</span>
      </a>
      <div className="cta-container">
        <ConnectButton
          label={stakingInstruction(isConnectedProperly, isTheCorrectChain)}
          redirectTo={path}
          disabled={isConnectedProperly && !isTheCorrectChain}
        />
      </div>
      <div className="disclaimer-container">
        {!enabled ? <p>{disclaimer}</p> : null}
      </div>
    </Card>
  );
}

StakingOption.propTypes = propTypes;

export default StakingOption;
