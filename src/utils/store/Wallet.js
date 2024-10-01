import React, { useEffect, useState } from "react";

import { Ethereum, getChainFromNetworkId } from "utils";

import { useAccount, useConnect, useNetwork } from "wagmi";

const WalletContext = React.createContext();
const storageConnector = window.localStorage.getItem("connectorId");

export const instanceForConnector = (connectorId) =>
  ({
    injected: window.ethereum,
    bsc: window.BinanceChain,
  }[connectorId]);

export function WalletProvider({ children }) {
  const { chain } = useNetwork();
  const { address, connector, isConnected, isConnecting, status } =
    useAccount();

  const { connect, connectors } = useConnect();

  const [isUnavailableModalOpen, setIsUnavailableModalOpen] = useState(false);
  const [chainHasChanged, setChainHasChanged] = useState(false);
  const [isTrust, setIsTrust] = useState(false);

  useEffect(() => {
    async function setListeners() {
      const provider = await Ethereum(() => {});

      if (provider) {
        provider.on("chainChanged", (e) => {
          setChainHasChanged(true);
        });
      }
    }
    setListeners();
    /* eslint-disable-next-line */
  }, []);

  useEffect(() => {
    if (chainHasChanged) {
      /* eslint-disable-next-line */
      if (!!window.trustwallet) {
        if (isTrust) {
          window.location.reload();
        } else {
          setChainHasChanged(false);
          setIsTrust(true);
        }
      } else {
        window.location.reload();
      }
    }
    /* eslint-disable-next-line */
  }, [chainHasChanged]);

  useEffect(() => {
    if (isConnected && chain?.unsupported) {
      setIsUnavailableModalOpen(true);
    }
    /* eslint-disable-next-line */
  }, [isConnected]);

  const currentChain = getChainFromNetworkId(chain?.id);

  const isCorrectNetwork = chain && !chain.unsupported;

  return (
    <WalletContext.Provider
      value={{
        currentChain,
        isCorrectNetwork,
        connectorId: storageConnector,
        connect,
        connectors,
        chainId: chain?.id,
        address,
        connector,
        isConnected,
        isConnectedProperly: isConnected && !chain?.unsupported,
        isConnecting,
        status,
        chain,
        isUnavailableModalOpen,
        toggleUnavailableModal: () =>
          setIsUnavailableModalOpen((state) => !state),
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return React.useContext(WalletContext);
}
