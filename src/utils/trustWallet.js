/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import {
  ConnectorNotFoundError,
  ResourceUnavailableError,
  UserRejectedRequestError,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { getClient } from "@wagmi/core";
import { getAddress } from "@ethersproject/address";

const mappingNetwork = {
  1: "eth-mainnet",
  5: "eth-goerli",
  56: "bsc-mainnet",
  97: "bsc-testnet",
};

export function getTrustWalletProvider() {
  const isTrustWallet = (ethereum) => {
    const trustWallet = !!ethereum.isTrust;

    return trustWallet;
  };

  const injectedProviderExist =
    typeof window !== "undefined" && typeof window.ethereum !== "undefined";

  if (!injectedProviderExist) {
    return;
  }

  if (isTrustWallet(window.trustwallet)) {
    return window.trustwallet;
  }

  if (isTrustWallet(window.ethereum)) {
    return window.ethereum;
  }

  if (window.ethereum?.providers) {
    return window.ethereum.providers.find(isTrustWallet);
  }

  return window.trustwallet;
}

export class TrustWalletConnector extends InjectedConnector {
  id = "trustWallet";

  constructor({ chains: _chains, options: _options } = {}) {
    const options = {
      name: "Trust Wallet",
      shimDisconnect: _options?.shimDisconnect ?? false,
      shimChainChangedDisconnect: _options?.shimChainChangedDisconnect ?? true,
    };
    const chains = _chains?.filter((c) => !!mappingNetwork[c.id]);
    super({
      chains,
      options,
    });
  }

  handleFailedConnect(error) {
    if (this.isUserRejectedRequestError(error)) {
      throw new UserRejectedRequestError(error);
    }

    if (error.code === -32002) {
      throw new ResourceUnavailableError(error);
    }

    throw error;
  }

  async connect({ chainId } = {}) {
    try {
      const provider = await this.getProvider();
      if (!provider) {
        throw new ConnectorNotFoundError();
      }

      if (provider.on) {
        provider.on("accountsChanged", this.onAccountsChanged);
        provider.on("chainChanged", this.onChainChanged);
        provider.on("disconnect", this.onDisconnect);
      }

      this.emit("message", { type: "connecting" });

      let account = null;
      if (
        this.options?.shimDisconnect &&
        !getClient().storage?.getItem(this.shimDisconnectKey)
      ) {
        account = await this.getAccount().catch(() => null);
        const isConnected = !!account;
        if (isConnected) {
          try {
            await provider.request({
              method: "wallet_requestPermissions",
              params: [{ eth_accounts: {} }],
            });
            account = await this.getAccount();
          } catch (error) {
            if (this.isUserRejectedRequestError(error)) {
              throw new UserRejectedRequestError(error);
            }
          }
        }
      }

      if (!account) {
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        account = getAddress(accounts[0]);
      }

      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);
      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId);
        id = chain.id;
        unsupported = this.isChainUnsupported(id);
      }

      if (this.options?.shimDisconnect) {
        /* eslint-disable-next-line */
        getClient().storage?.setItem(this.shimDisconnectKey, true);
      }

      return { account, chain: { id, unsupported }, provider };
    } catch (error) {
      this.handleFailedConnect(error);
    }
  }

  async getProvider() {
    return getTrustWalletProvider();
  }
}
