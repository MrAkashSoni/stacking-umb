import { InjectedConnector } from "@web3-react/injected-connector";
import { BscConnector } from "@binance-chain/bsc-connector";

import {
  BinanceChainWallet,
  MathWallet,
  MetamaskWallet,
  SafePalWallet,
  TokenPocketWallet,
  TrustWallet,
} from "assets/icons";

import { pastIterationsFor } from "utils/formatters";

export const SECONDS_IN_A_DAY = 86_400;
export const SECONDS_IN_A_MONTH = 2_592_000;
export const DAYS_IN_A_YEAR = 365;
export const $1E6 = 1000000;
export const STAKE_MAX_VALUE = "340282366920938463463374607431768211455";

export const REDEEM_DAILY_CAP = "250000000000000000000000";

export const CLAIMABLE_REWARDS_MINIMUM = "0.01";

export const TBD = "TBD";

export const ETH = "ETH";
export const BSC = "BSC";

export const STAGE = process.env.REACT_APP_STAGE;

export const BSC_TESTNET = "97";
export const GOERLI = "5";

export const ETH_MAINNET = "1";
export const BSC_MAINNET = "56";

export const PROD = "prod";
export const DEV = "dev";

export const ASTRO_LOCK_URL = {
  [DEV]: "https://staking-dev.umb.network/lockup/astro",
  [PROD]: "https://staking.umb.network/lockup/astro",
}[STAGE];

export const chainData = {
  [BSC_TESTNET]: {
    netVersion: BSC_TESTNET,
    networkFullName: "Binance Smart Chain Testnet",
    networkName: "Binance Smart Chain",
    networkSymbol: BSC,
    subNetwork: "Test",
    shortNetName: "BSC Testnet",
    scanUrl: "https://testnet.bscscan.com",
  },
  [BSC_MAINNET]: {
    netVersion: BSC_MAINNET,
    networkFullName: "Binance Smart Chain Mainnet",
    networkName: "Binance Smart Chain",
    networkSymbol: BSC,
    subNetwork: "Mainnet",
    shortNetName: "BSC Mainnet",
    scanUrl: "https://bscscan.com",
  },
  [GOERLI]: {
    netVersion: GOERLI,
    networkFullName: "Ethereum Testnet Goerli",
    networkName: "Ethereum",
    networkSymbol: ETH,
    subNetwork: "Goerli",
    shortNetName: "ETH Goerli",
    scanUrl: "https://goerli.etherscan.io",
  },
  [ETH_MAINNET]: {
    netVersion: ETH_MAINNET,
    networkFullName: "Ethereum Mainnet",
    networkName: "Ethereum",
    networkSymbol: ETH,
    subNetwork: "Mainnet",
    shortNetName: "ETH Mainnet",
    scanUrl: "https://etherscan.io",
  },
};

export const network = {
  ETH: "Ethereum",
  BSC: "Binance Smart Chain",
};

export const WAITING = "WAITING";
export const ERROR = "ERROR";
export const UNSENT = "UNSENT";
export const SUCCESS = "SUCCESS";
export const SENDING = "SENDING";

export const TX_FAILED_STATUS = 0;

export const statuses = [WAITING, ERROR, SUCCESS, UNSENT, SENDING];

export const doneStatuses = [ERROR, SUCCESS, UNSENT];

export const LP = "LP";
export const UMB = "umb";
export const RUMB1 = "rumb1";
export const RUMB2 = "rumb2";

export const UNISWAP = "uniswap";
export const PANCAKESWAP = "pancakeswap";

export const UMB_TOKEN = "umb-token";

export const HADLEY_STREAM = "hadley";
export const POLAR_STREAM = "polar";
export const ASTRO_STREAM = "astro";

export const STAKING = "staking";
export const STAKING_V2 = "staking_v2";
export const STAKING_V3 = "staking_v3";
export const REWARDS = "rewards";
export const REWARDS_2 = "rewards2";
export const REDEEM = "redeem";
export const HOW_TO = "how-to";
export const LENS = "lens";

// TODO: remove once v1 is deprecated

export const V2_CONTRACTS = [
  process.env.REACT_APP_STAKING_CONTRACT_HADLEY_ETH_PAST_ITERATION_1,
  process.env.REACT_APP_STAKING_CONTRACT_HADLEY_BSC_PAST_ITERATION_1,
  process.env.REACT_APP_STAKING_CONTRACT_ASTRO_ETH,
  process.env.REACT_APP_STAKING_CONTRACT_ASTRO_BSC,
];

export const V3_CONTRACTS = [
  process.env.REACT_APP_STAKING_CONTRACT_HADLEY_ETH,
  process.env.REACT_APP_STAKING_CONTRACT_HADLEY_BSC,
  process.env.REACT_APP_STAKING_CONTRACT_POLAR_ETH,
  process.env.REACT_APP_STAKING_CONTRACT_POLAR_BSC,
];

export const availableStreams = [HADLEY_STREAM, POLAR_STREAM, ASTRO_STREAM];
export const avaliableRedeem = ["rUMB1", "rUMB2"];

export const redeemOptions = {
  [HADLEY_STREAM]: {
    rumb1: {
      contractAddress:
        process.env.REACT_APP_STAKING_CONTRACT_HADLEY_ETH_PAST_ITERATION_0,
      ratio: "1:1",
      allowedNetwork: {
        [DEV]: GOERLI,
        [PROD]: ETH_MAINNET,
      }[STAGE],
    },
  },
};

export const availableChains = [ETH_MAINNET, BSC_TESTNET, GOERLI, BSC_MAINNET];

export const contractAddresses = {
  [ETH]: {
    [UMB_TOKEN]: "0x6fC13EACE26590B80cCCAB1ba5d51890577D83B2",
    [HADLEY_STREAM]: process.env.REACT_APP_STAKING_CONTRACT_HADLEY_ETH,
    [POLAR_STREAM]: process.env.REACT_APP_STAKING_CONTRACT_POLAR_ETH,
    [ASTRO_STREAM]: process.env.REACT_APP_STAKING_CONTRACT_ASTRO_ETH,
  },

  [BSC]: {
    [UMB_TOKEN]: "0x846F52020749715F02AEf25b5d1d65e48945649D",
    [HADLEY_STREAM]: process.env.REACT_APP_STAKING_CONTRACT_HADLEY_BSC,
    [POLAR_STREAM]: process.env.REACT_APP_STAKING_CONTRACT_POLAR_BSC,
    [ASTRO_STREAM]: process.env.REACT_APP_STAKING_CONTRACT_ASTRO_BSC,
  },
};

export const contracts = {
  [HADLEY_STREAM]: {
    name: "Hadley Stream",
    stream: "Hadley",
    chains: [ETH, BSC],
    path: "/staking/hadley",
    description:
      "Hadley Stream is the Umbrella contract that distributes UMB for staking your UMB tokens.",
    shouldFetchRatio: false,
    isLockup: false,
    mainToken: "UMB",
    options: {
      [ETH]: {
        enabled: true,
        address: contractAddresses[ETH][HADLEY_STREAM],
        dailyAvailable: 15625,
        pair: "UMB",
        pastIterations: pastIterationsFor(ETH, HADLEY_STREAM),
        contractName: UMB,
      },
      [BSC]: {
        enabled: true,
        address: contractAddresses[BSC][HADLEY_STREAM],
        dailyAvailable: 5208,
        pair: "UMB",
        pastIterations: pastIterationsFor(BSC, HADLEY_STREAM),
        contractName: UMB,
      },
    },
  },
  [POLAR_STREAM]: {
    name: "Polar Stream",
    stream: "Polar",
    chains: [ETH, BSC],
    path: "/staking/polar",
    description:
      "Polar Stream is the Umbrella contract that distributes UMB for staking LP tokens you received from providing liquidity to our Uniswap UMB-ETH pool or to our Pancakeswap UMB-BNB pool.",
    shouldFetchRatio: true,
    isLockup: false,
    mainToken: "LP",
    options: {
      [ETH]: {
        enabled: true,
        address: contractAddresses[ETH][POLAR_STREAM],
        dailyAvailable: 5208,
        pair: "Uniswap LP UMB-ETH",
        pool: "UMB-ETH",
        poolType: "UniSwap V2",
        poolUrl: `https://app.uniswap.org/#/add/v2/ETH/${contractAddresses[ETH][UMB_TOKEN]}`,
        pastIterations: pastIterationsFor(ETH, POLAR_STREAM),
        contractName: UNISWAP,
      },
      [BSC]: {
        enabled: true,
        address: contractAddresses[BSC][POLAR_STREAM],
        dailyAvailable: 1736,
        pair: "PancakeSwap LP UMB-BNB",
        pool: "UMB-BNB",
        poolType: "PancakeSwap",
        poolUrl: `https://pancakeswap.finance/add/BNB/${contractAddresses[BSC][UMB_TOKEN]}`,
        pastIterations: pastIterationsFor(BSC, POLAR_STREAM),
        contractName: PANCAKESWAP,
      },
    },
  },
  [ASTRO_STREAM]: {
    name: "Astro Stream",
    stream: "Astro",
    chains: [ETH, BSC],
    path: "/lockup/astro",
    description:
      "Astro Stream is the Umbrella contract that distributes rUMB2 for staking your rUMB1 tokens.",
    shouldFetchRatio: false,
    isLockup: true,
    mainToken: "rUMB1",
    options: {
      [ETH]: {
        enabled: true,
        address: contractAddresses[ETH][ASTRO_STREAM],
        dailyAvailable: 80548,
        pair: "rUMB1 Lockup",
        contractName: UMB,
        lensContract: process.env.REACT_APP_LENS_CONTRACT_ETH,
      },
      [BSC]: {
        enabled: true,
        address: contractAddresses[BSC][ASTRO_STREAM],
        dailyAvailable: 8950,
        pair: "rUMB1 Lockup",
        contractName: UMB,
        lensContract: process.env.REACT_APP_LENS_CONTRACT_BSC,
      },
    },
  },
};

export const allowedNetworks = {
  [DEV]: [GOERLI, BSC_TESTNET],
  [PROD]: [ETH_MAINNET, BSC_MAINNET],
}[STAGE];

const supportedChainIds = allowedNetworks.map((id) => parseInt(id));

export const connectors = {
  injected: new InjectedConnector({ supportedChainIds }),
  bsc: new BscConnector({ supportedChainIds }),
};

export const wallets = [
  {
    title: "MetaMask",
    icon: MetamaskWallet,
    connectorId: "metaMask",
    url: "https://metamask.io/",
  },
  {
    title: "TrustWallet",
    icon: TrustWallet,
    connectorId: "trustWallet",
    url: "https://trustwallet.com/",
  },
  {
    title: "Binance Wallet",
    icon: BinanceChainWallet,
    connectorId: "bsc",
    url: "https://www.binance.com/en/wallet-direct",
  },
  {
    title: "SafePal Wallet",
    icon: SafePalWallet,
    connectorId: "injected",
    url: "https://safepal.io/",
  },
  {
    title: "MathWallet",
    icon: MathWallet,
    connectorId: "injected",
    url: "https://mathwallet.org/",
  },
  {
    title: "TokenPocket",
    icon: TokenPocketWallet,
    connectorId: "injected",
    url: "https://www.tokenpocket.pro/en/download/app",
  },
];

export const ethNetworks = [GOERLI, ETH_MAINNET];

export const bscNetworks = [BSC_TESTNET, BSC_MAINNET];
