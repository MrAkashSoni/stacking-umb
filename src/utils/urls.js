import { PROD, ETH, BSC, STAGE, chainData } from "utils/constants";

export function suffixFromEnvironment(environment) {
  const defaultEnvironments = [PROD, ETH];

  return defaultEnvironments.includes(environment)
    ? ""
    : `-${environment.toLowerCase()}`;
}

export function formatLinkToChainAndEnv(subdomain, chain) {
  return `https://${subdomain}${suffixFromEnvironment(
    chain
  )}${suffixFromEnvironment(STAGE)}.umb.network`;
}

export const ethExplorerUrl = formatLinkToChainAndEnv("explorer", ETH);
export const bscExplorerUrl = formatLinkToChainAndEnv("explorer", BSC);

export const ethPortalUrl = formatLinkToChainAndEnv("portal", ETH);
export const bscPortalUrl = formatLinkToChainAndEnv("portal", BSC);

export const supportChannel = "https://discord.gg/9eG9F4nMcj";

export const metamaskDeepLink =
  "https://metamask.app.link/dapp/staking.umb.network";

export const formatScanUrl = (scanUrl, type, address) =>
  `${scanUrl}/${type}/${address}`;

export const scanUrlForAdressAndChain = (address, chain) =>
  formatScanUrl(chainData[chain].scanUrl, "address", address);
export const scanUrlForTxAndChain = (address, chain) =>
  formatScanUrl(chainData[chain].scanUrl, "tx", address);

export const getScanUrlFromChain = (chainData, allowedNetworkForChain) => {
  if (
    chainData &&
    allowedNetworkForChain &&
    chainData[allowedNetworkForChain]
  ) {
    return chainData[allowedNetworkForChain].scanUrl;
  }

  return "";
};
