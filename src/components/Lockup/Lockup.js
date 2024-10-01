import React from "react";
import { useParams } from "react-router-dom";

import { Heading, Card, ChainIndicator, LoadingState } from "components/ui";

import { fetchSistemStreams } from "utils";

import { useWallet } from "utils/store/Wallet";
import { useLockup } from "utils/store/lockup";
import { contracts, chainData } from "utils/constants";

import { truncate } from "utils/formatters";

import { Transactions } from "components";

import LockupWalletCard from "./LockupWalletCard/LockupWalletCard";

import "./lockup.scss";

import LockTab from "./LockupCard/LockTab";
import UnlockTab from "./LockupCard/UnlockTab";
import Tabs from "../ui/Tabs/Tabs";
import Tab from "../ui/Tabs/Tab";

import { getScanUrlFromChain } from "utils/urls";

function Lockup() {
  const {
    state: {
      isReady,
      isTransactioning,
      token: { symbol: tokenSymbol, contractAdress: mainTokenContractAddress },
      rewardToken: {
        symbol: rewardTokenSymbol,
        contractAdress: rewardContractAddress,
      },
    },
    locks,
  } = useLockup();

  const { chainId, currentChain } = useWallet();
  const { id } = useParams();

  const { options, stream } = contracts[id];
  const { address: stakingContract, pair } = options[currentChain];

  const scanUrl = getScanUrlFromChain(chainData, chainId);

  const sisterStreams = fetchSistemStreams({
    chain: currentChain,
    symbol: id,
  });

  return isReady ? (
    <div className="lockup">
      <div className="lockup__welcome-message">
        <div className="title">
          <Heading type="secondary" highlightSpan size={1}>
            {stream} <span>Stream</span>
          </Heading>
          <p className="subtitle">{`${pair} Staking`}</p>
        </div>
        <ChainIndicator />
        <div className="lockup-info-container">
          <Card className="lockup-info lockup-info--token-contracts">
            <p className="text">
              {tokenSymbol} Contract
              <br />
              <br />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`${scanUrl}/token/${mainTokenContractAddress}`}
              >
                {truncate(mainTokenContractAddress)}
              </a>
            </p>
            <div className="divisor" />
            <p className="text">
              {rewardTokenSymbol} Contract
              <br />
              <br />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`${scanUrl}/token/${rewardContractAddress}`}
              >
                {truncate(rewardContractAddress)}
              </a>
            </p>
          </Card>
          <Card className="lockup-info">
            <p className="text">
              {pair} Contract
              <br />
              <br />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`${scanUrl}/address/${stakingContract}`}
              >
                {truncate(stakingContract)}
              </a>
            </p>
          </Card>
        </div>
      </div>
      <div className="lockup__wrapper">
        <Card className="lockup-card">
          <Tabs>
            <Tab title="Lock" disabled={isTransactioning}>
              <LockTab disabled />
            </Tab>
            <Tab title="Withdraw" disabled={isTransactioning}>
              <UnlockTab />
            </Tab>
          </Tabs>
        </Card>
        <LockupWalletCard locks={locks} sisterStreams={sisterStreams} />
        <Transactions />
      </div>
    </div>
  ) : (
    <LoadingState />
  );
}

export default Lockup;
