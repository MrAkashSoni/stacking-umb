import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { ContractProvider } from "utils/store";
import { WalletProvider } from "utils/store/Wallet";
import { TutorialProvider } from "utils/store/Tutorial";
import { RedeemProvider } from "utils/store/redeem";
import { LockupProvider } from "utils/store/lockup";

import {
  Staking,
  Redeem,
  HowTo,
  WalletUnavailable,
  StakingOptions,
  Intro,
  PastRewards,
  Lockup,
  RedeemV2,
} from "components";

import { Footer, Header, Version, WithWallet } from "components/ui";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./mainContent.scss";

import {
  configureChains,
  createClient,
  goerli,
  mainnet,
  WagmiConfig,
} from "wagmi";
import { bscTestnet, bsc } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { InjectedConnector } from "wagmi/connectors/injected";
import { BinanceWalletConnector } from "utils/binanceWallet";
import { TrustWalletConnector } from "utils/trustWallet";

import { DEV, PROD, STAGE } from "utils/constants";
import { RedeemV2Provider } from "utils/store/redeemV2";

const allowedChains = {
  [DEV]: [goerli, bscTestnet],
  [PROD]: [mainnet, bsc],
}[STAGE];

export const { chains, provider } = configureChains(allowedChains, [
  publicProvider(),
]);

export const metaMaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
});

export const bscConnector = new BinanceWalletConnector({ chains });

export const injectedConnector = new InjectedConnector({
  chains,
  options: {
    shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
});

export const trustWalletConnector = new TrustWalletConnector({
  chains,
  options: {
    shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
});

const wagmiClient = createClient({
  autoConnect: false,
  provider,
  connectors: [
    metaMaskConnector,
    trustWalletConnector,
    injectedConnector,
    bscConnector,
  ],
});

const client = new QueryClient();
function MainContent() {
  return (
    <WagmiConfig client={wagmiClient}>
      <Router>
        <TutorialProvider>
          <Web3ReactProvider getLibrary={(provider) => provider}>
            <WalletProvider>
              <ContractProvider>
                <QueryClientProvider client={client}>
                  <div className="main">
                    <Header />
                    <WalletUnavailable />

                    <div className="main__content">
                      <Version />
                      <Switch>
                        <Route path="/redeem/rumb1">
                          <WithWallet strict={false}>
                            <RedeemProvider>
                              <Redeem />
                            </RedeemProvider>
                          </WithWallet>
                        </Route>

                        <Route path="/redeem/rumb2">
                          <RedeemV2Provider>
                            <RedeemV2 />
                          </RedeemV2Provider>
                        </Route>

                        <Route path="/staking/:id">
                          <WithWallet>
                            <Staking />
                          </WithWallet>
                        </Route>

                        <Route path="/past-rewards/:stream/:id">
                          <WithWallet strict={false}>
                            <PastRewards />
                          </WithWallet>
                        </Route>

                        <Route path="/lockup/:id">
                          <WithWallet>
                            <LockupProvider>
                              <Lockup />
                            </LockupProvider>
                          </WithWallet>
                        </Route>

                        <Route path="/">
                          <div className="landing">
                            <Intro />
                            <StakingOptions />
                            <HowTo />
                          </div>
                        </Route>
                      </Switch>
                    </div>

                    <Footer />
                  </div>
                </QueryClientProvider>
              </ContractProvider>
            </WalletProvider>
          </Web3ReactProvider>
        </TutorialProvider>
      </Router>
    </WagmiConfig>
  );
}

export default MainContent;
