import React, { useEffect, useCallback } from "react";
import { ONGOING, farmingStatusFromEndTime } from "utils/farming";
import { useWallet } from "utils/store/Wallet";
import { secondsUntil, daysUntil, calculateTokenRatio } from "utils";
import { isEmpty } from "ramda";
import {
  getTokenBalance,
  getTokenRatio,
  getTokenAllowance,
  getTotalSupply,
  getUserInfo,
  getStakingBasicData,
  getRewardsTokenInfo,
  getRewardsTokenBalance,
  getStakingEssentialInfo,
  getPaused,
} from "utils/services";
import { BigNumber } from "ethers";

import { useNewBlockListener } from "utils/hooks";

import {
  contracts,
  availableStreams,
  contractAddresses,
} from "utils/constants";
import { useERC20 } from "hooks/useContract";

const ContractContext = React.createContext();

const STAKING_CONTRACT_SET = "STAKING_CONTRACT_SET";

const HAS_LOADED = "HAS_LOADED";

const STAKING_INFO_REQUESTED = "STAKING_INFO_REQUESTED";
const STAKING_INFO_FULFILLED = "STAKING_INFO_FULFILLED";
const STAKING_INFO_REJECTED = "STAKING_INFO_REJECTED";

const TOKEN_CONTRACTS_FULFILLED = "TOKEN_CONTRACTS_FULFILLED";
const TOKEN_CONTRACTS_REJECTED = "TOKEN_CONTRACTS_REJECTED";

const FARMING_TIME_REQUESTED = "FARMING_TIME_REQUESTED";
const FARMING_TIME_FULFILLED = "FARMING_TIME_FULFILLED";
const FARMING_TIME_REJECTED = "FARMING_TIME_REJECTED";

const UPDATE_FARMING_STATUS = "UPDATE_FARMING_STATUS";

const USER_WALLET_UNAVAILABLE_LAYER_OPEN = "WALLET_UNAVAILABLE_LAYER_OPEN";
const USER_WALLET_UNAVAILABLE_LAYER_CLOSED = "WALLET_UNAVAILABLE_LAYER_CLOSED";

const USER_INFO_REQUESTED = "USER_INFO_REQUESTED";

const USER_TOKEN_BALANCE_FULFILLED = "USER_TOKEN_BALANCE_FULFILLED";
const USER_TOKEN_BALANCE_REJECTED = "USER_TOKEN_BALANCE_REJECTED";

const USER_TOKEN_ALLOWANCE_FULFILLED = "USER_TOKEN_ALLOWANCE_FULFILLED";
const USER_TOKEN_ALLOWANCE_REJECTED = "USER_TOKEN_ALLOWANCE_REJECTED";

const USER_TOTAL_SUPPLY_FULFILLED = "USER_TOTAL_SUPPLY_FULFILLED";
const USER_TOTAL_SUPPLY_REJECTED = "USER_TOTAL_SUPPLY_REJECTED";

const USER_R_TOKEN_BALANCE_FULFILLED = "USER_R_TOKEN_BALANCE_FULFILLED";
const USER_R_TOKEN_BALANCE_REJECTED = "USER_R_TOKEN_BALANCE_REJECTED";

const USER_REWARDS_TOKEN_INFO_FULFILLED = "USER_REWARDS_TOKEN_INFO_FULFILLED";
const USER_REWARDS_TOKEN_INFO_REJECTED = "USER_REWARDS_TOKEN_INFO_REJECTED";

const USER_STAKING_INFO_FULFILLED = "USER_STAKING_INFO_FULFILLED";
const USER_STAKING_INFO_REJECTED = "USER_STAKING_INFO_REJECTED";

const USER_TRANSACTION_SET = "USER_TRANSACTION_SET";
const USER_TRANSACTION_UNSET = "USER_TRANSACTION_UNSET";
const USER_TRANSACTIONS_SET = "USER_TRANSACTIONS_SET";

const USER_CLEAR = "USER_CLEAR";
const USER_INFO_FINISH = "USER_INFO_FINISH";

const REFRESH_BALANCES = "REFRESH_BALANCES";
const BALANCES_REFRESHED = "BALANCES_REFRESHED";
const BALANCES_RESET = "BALANCES_RESET";

const TOKEN_RATIO_FULFILLED = "TOKEN_RATIO_FULFILLED";
const TOKEN_RATIO_REJECTED = "TOKEN_RATIO_REJECTED";

const TOKEN_STAKING_BALANCE_SET = "TOKEN_STAKING_BALANCE_SET";
const TOKEN_BONUS_BALANCE_SET = "TOKEN_BONUS_BALANCE_SET";

const TOKEN_PAST_ITERATION_INFO_FULFILLED =
  "TOKEN_PAST_ITERATION_INFO_FULFILLED";

const PAUSED_FULFILLED = "PAUSED_FULFILLED";
const PAUSED_REJECTED = "PAUSED_REJECTED";

const tokenProps = {
  allowance: BigNumber.from(0),
  balance: BigNumber.from(0),
  staked: BigNumber.from(0),
  totalSupply: BigNumber.from(0),
  totalBalance: BigNumber.from(0),
  totalBonus: BigNumber.from(0),
  totalStakingBalance: BigNumber.from(0),
  bonusTokenBalance: BigNumber.from(0),
  ratio: undefined,
  pastIterations: {},
};

const contractsDataModel = Object.fromEntries(
  availableStreams.map((contract) => [contract, tokenProps])
);

export const initialState = {
  stakingContractSymbol: undefined,
  isLoading: true,
  user: {
    isUnavavailableModal: false,
    isLoading: false,
    transactions: [],
    rToken: {
      name: "Umbrella Reward Token",
      symbol: "UMB",
      rBalance: BigNumber.from(0),
      rPending: BigNumber.from(0),
    },
    token: contractsDataModel,
  },
  staking: {
    isLoading: false,
    rewardsTokenAddress: undefined,
    tokenAddress: undefined,
    bonusTokenAddress: undefined,
    isPaused: undefined,
  },
};

export function reducer(state = {}, action = {}) {
  switch (action.type) {
    case TOKEN_CONTRACTS_FULFILLED:
      return {
        ...state,
        staking: {
          ...state.staking,
          tokenAddress: action.payload.tokenAddress,
          rewardsTokenAddress: action.payload.rewardsTokenAddress,
          bonusTokenAddress: action.payload.bonusTokenAddress,
        },
      };
    case TOKEN_CONTRACTS_REJECTED:
      return {
        ...state,
        staking: {
          ...state.staking,
          tokenAddress: undefined,
          rewardsTokenAddress: undefined,
        },
      };
    case USER_INFO_REQUESTED:
      return {
        ...state,
        user: {
          ...state.user,
          isLoading: true,
        },
      };
    case USER_TOKEN_BALANCE_FULFILLED:
      return {
        ...state,
        user: {
          ...state.user,
          token: {
            ...state.user.token,
            [action.payload.contractSymbol]: {
              ...state.user.token[action.payload.contractSymbol],
              balance: action.payload.balance,
            },
          },
        },
      };
    case USER_TOKEN_BALANCE_REJECTED:
      return {
        ...state,
        user: {
          ...state.user,
          token: {
            ...initialState.user.token,
          },
        },
      };
    case USER_TOKEN_ALLOWANCE_FULFILLED:
      return {
        ...state,
        user: {
          ...state.user,
          token: {
            ...state.user.token,
            [action.payload.contractSymbol]: {
              ...state.user.token[action.payload.contractSymbol],
              allowance: action.payload.allowance,
            },
          },
        },
      };
    case USER_TOKEN_ALLOWANCE_REJECTED:
      return state;
    case USER_TOTAL_SUPPLY_FULFILLED:
      return {
        ...state,
        user: {
          ...state.user,
          token: {
            ...state.user.token,
            [action.payload.contractSymbol]: {
              ...state.user.token[action.payload.contractSymbol],
              // TODO: remove once v1 is deprecated
              totalSupply:
                action.payload.totalSupply.totalBalance ??
                action.payload.totalSupply,
              totalBalance: action.payload.totalSupply?.totalBalance,
              totalBonus: action.payload.totalSupply?.totalBonus,
            },
          },
        },
      };
    case TOKEN_STAKING_BALANCE_SET:
      return {
        ...state,
        user: {
          ...state.user,
          token: {
            ...state.user.token,
            [action.payload.stakingContractSymbol]: {
              ...state.user.token[action.payload.stakingContractSymbol],
              // TODO: remove once v1 is deprecated
              totalStakingBalance: action.payload.totalStakingBalance,
            },
          },
        },
      };
    case TOKEN_BONUS_BALANCE_SET:
      return {
        ...state,
        user: {
          ...state.user,
          token: {
            ...state.user.token,
            [action.payload.stakingContractSymbol]: {
              ...state.user.token[action.payload.stakingContractSymbol],
              bonusTokenBalance: action.payload.bonusTokenBalance,
            },
          },
        },
      };
    case USER_TOTAL_SUPPLY_REJECTED:
      return state;
    case USER_R_TOKEN_BALANCE_FULFILLED:
      return {
        ...state,
        user: {
          ...state.user,
          rToken: {
            ...state.user.rToken,
            rBalance: action.payload,
          },
        },
      };
    case USER_R_TOKEN_BALANCE_REJECTED:
      return state;
    case USER_REWARDS_TOKEN_INFO_FULFILLED:
      return {
        ...state,
        user: {
          ...state.user,
          rToken: {
            ...state.user.rToken,
            ...action.payload,
          },
        },
      };
    case USER_REWARDS_TOKEN_INFO_REJECTED:
      return state;
    case USER_STAKING_INFO_FULFILLED:
      return {
        ...state,
        user: {
          ...state.user,
          rToken: {
            ...state.user.rToken,
            rPending: action.payload.earned,
          },
          token: {
            ...state.user.token,
            [action.payload.contractSymbol]: {
              ...state.user.token[action.payload.contractSymbol],
              // TODO: remove once v1 is deprecated
              staked: action.payload.staked.umbBalance ?? action.payload.staked,
            },
          },
        },
      };
    case USER_STAKING_INFO_REJECTED:
      return state;
    case USER_TRANSACTION_SET:
      localStorage.setItem(
        "transactions",
        JSON.stringify([action.payload, ...state.user.transactions])
      );

      return {
        ...state,
        user: {
          ...state.user,
          transactions: [action.payload, ...state.user.transactions],
        },
      };
    case USER_TRANSACTION_UNSET:
      localStorage.setItem(
        "transactions",
        JSON.stringify(
          state.user.transactions.filter(({ hash }) => hash !== action.payload)
        )
      );

      return {
        ...state,
        user: {
          ...state.user,
          transactions: state.user.transactions.filter(
            ({ hash }) => hash !== action.payload
          ),
        },
      };
    case USER_TRANSACTIONS_SET:
      return {
        ...state,
        user: {
          ...state.user,
          transactions: action.payload,
        },
      };
    case USER_INFO_FINISH:
      return {
        ...state,
        user: {
          ...state.user,
          isLoading: false,
        },
      };
    case USER_CLEAR:
      return {
        ...state,
        stakingContractSymbol: undefined,
        user: {
          ...initialState.user,
        },
      };
    case STAKING_INFO_REQUESTED:
      return {
        ...state,
        staking: {
          ...state.staking,
          isLoading: true,
        },
      };
    case STAKING_INFO_FULFILLED:
      return {
        ...state,
        staking: {
          isLoading: false,
          ...state.staking,
          ...action.payload,
        },
      };
    case STAKING_INFO_REJECTED:
      return {
        ...state,
        staking: {
          ...initialState.staking,
        },
      };
    case FARMING_TIME_REQUESTED:
      return {
        ...state,
        staking: {
          ...state.staking,
          endsAt: {
            ...initialState.staking.endsAt,
            isLoading: true,
          },
        },
      };
    case FARMING_TIME_FULFILLED:
      return {
        ...state,
        staking: {
          ...state.staking,
          endsAt: {
            timestamp: action.payload.end.toString(),
            duration: action.payload.duration.toString(),
            secondsRemaining:
              farmingStatusFromEndTime(action.payload.end.toString()) ===
                ONGOING
                ? secondsUntil(action.payload.end.toString())
                : 0,
            daysRemaining:
              farmingStatusFromEndTime(action.payload.end.toString()) ===
                ONGOING
                ? daysUntil(action.payload.end.toString())
                : 0,
            status: farmingStatusFromEndTime(action.payload.end.toString()),
            isLoading: false,
          },
        },
      };
    case FARMING_TIME_REJECTED:
      return {
        ...state,
        staking: {
          ...state.staking,
          endsAt: {
            ...initialState.staking.endsAt,
            isLoading: false,
          },
        },
      };

    case UPDATE_FARMING_STATUS:
      return {
        ...state,
        staking: {
          ...state.staking,
          endsAt: {
            timestamp: state.staking.endsAt.timestamp,
            secondsRemaining:
              farmingStatusFromEndTime(state.staking.endsAt.timestamp) ===
                ONGOING
                ? secondsUntil(state.staking.endsAt.timestamp)
                : 0,
            daysRemaining:
              farmingStatusFromEndTime(state.staking.endsAt.timestamp) ===
                ONGOING
                ? daysUntil(state.staking.endsAt.timestamp)
                : 0,
            status: farmingStatusFromEndTime(state.staking.endsAt.timestamp),
            isLoading: false,
          },
        },
      };
    case USER_WALLET_UNAVAILABLE_LAYER_OPEN:
      return {
        ...state,
        user: {
          ...state.user,
          isUnavavailableModal: true,
        },
      };
    case USER_WALLET_UNAVAILABLE_LAYER_CLOSED:
      return {
        ...state,
        user: {
          ...state.user,
          isUnavavailableModal: false,
        },
      };
    case STAKING_CONTRACT_SET:
      return {
        ...state,
        stakingContractSymbol: action.payload,
      };
    case HAS_LOADED:
      return {
        ...state,
        isLoading: false,
      };
    case BALANCES_RESET:
      return {
        ...state,
        user: {
          rToken: {
            ...state.user.rToken,
            rBalance: BigNumber.from(0),
            rPending: BigNumber.from(0),
          },
          token: {
            ...state.user.token,
            balance: BigNumber.from(0),
            staked: BigNumber.from(0),
          },
        },
      };
    case TOKEN_PAST_ITERATION_INFO_FULFILLED:
      return {
        ...state,
        user: {
          ...state.user,
          token: {
            ...state.user.token,
            [action.payload.contractSymbol]: {
              ...state.user.token[action.payload.contractSymbol],
              pastIterations: {
                ...state.user.token[action.payload.contractSymbol]
                  .pastIterations,
                [action.payload.contractAddress]: {
                  ...action.payload,
                },
              },
            },
          },
        },
      };
    case TOKEN_RATIO_FULFILLED:
      return {
        ...state,
        user: {
          ...state.user,
          token: {
            ...state.user.token,
            [action.payload.contractSymbol]: {
              ...state.user.token[action.payload.contractSymbol],
              ratio: action.payload.ratio,
            },
          },
        },
      };
    case TOKEN_RATIO_REJECTED:
      return state;
    case PAUSED_REJECTED:
      return state;
    case PAUSED_FULFILLED:
      return {
        ...state,
        staking: {
          ...state.staking,
          isPaused: action.payload.isPaused,
        },
      };
    default:
      return state;
  }
}

export function userInfoFinish() {
  return { type: USER_INFO_FINISH };
}

export function userInfoRequested() {
  return { type: USER_INFO_REQUESTED };
}

export function userStakingInfoFulfilled(info, contractSymbol) {
  return {
    type: USER_STAKING_INFO_FULFILLED,
    payload: { ...info, contractSymbol },
  };
}

export function userStakingInfoRejected() {
  return { type: USER_STAKING_INFO_REJECTED };
}

export function transactionSet(payload) {
  return { type: USER_TRANSACTION_SET, payload };
}

export function transactionUnset({ hash }) {
  return { type: USER_TRANSACTION_UNSET, payload: hash };
}

export function transactionsSet(payload) {
  return { type: USER_TRANSACTIONS_SET, payload };
}

export function userTokenBalanceFulfilled(balance, contractSymbol) {
  return {
    type: USER_TOKEN_BALANCE_FULFILLED,
    payload: { balance, contractSymbol },
  };
}

export function userTokenBalanceRejected() {
  return { type: USER_TOKEN_BALANCE_REJECTED };
}

export function userTokenAllowanceFulfilled(allowance, contractSymbol) {
  return {
    type: USER_TOKEN_ALLOWANCE_FULFILLED,
    payload: { allowance, contractSymbol },
  };
}

export function userTokenAllowanceRejected() {
  return { type: USER_TOKEN_ALLOWANCE_REJECTED };
}

export function userTotalSupplyFulfilled(response, contractSymbol) {
  return {
    type: USER_TOTAL_SUPPLY_FULFILLED,
    payload: { totalSupply: response, contractSymbol },
  };
}

export function userTotalSupplyRejected() {
  return { type: USER_TOTAL_SUPPLY_REJECTED };
}

export function pausedFulfilled(response) {
  return {
    type: PAUSED_FULFILLED,
    payload: { isPaused: response },
  };
}

export function pausedRejected() {
  return { type: PAUSED_REJECTED };
}

export function rewardsTokenInfoFulfilled(payload) {
  return { type: USER_REWARDS_TOKEN_INFO_FULFILLED, payload };
}

export function rewardsTokenInfoRejected() {
  return { type: USER_REWARDS_TOKEN_INFO_REJECTED };
}

export function userRewardsTokenBalanceFulfilled(payload) {
  return { type: USER_R_TOKEN_BALANCE_FULFILLED, payload };
}

export function userRewardsTokenBalanceRejected() {
  return { type: USER_R_TOKEN_BALANCE_REJECTED };
}

export function userClear() {
  return { type: USER_CLEAR };
}

export function stakingInfoRequested() {
  return { type: STAKING_INFO_REQUESTED };
}

export function userPastIterationInfoFullfiled(
  payload,
  contractSymbol,
  contractAddress,
  iteration
) {
  return {
    type: TOKEN_PAST_ITERATION_INFO_FULFILLED,
    payload: {
      ...payload,
      staked: payload.staked?.umbBalance ?? payload.staked,
      contractSymbol,
      contractAddress,
      iteration,
    },
  };
}

export function stakingInfoFulfilled({
  rewardsTokenAddress,
  stakingEndsAt,
  tokenAddress,
}) {
  return {
    type: STAKING_INFO_FULFILLED,
    payload: {
      rewardsTokenAddress,
      stakingEndsAt: stakingEndsAt.toString(),
      tokenAddress,
    },
  };
}

export function stakingInfoRejected() {
  return { type: STAKING_INFO_REJECTED };
}

export function farmingTimeRequested() {
  return { type: FARMING_TIME_REQUESTED };
}

export function farmingTimeFulfilled(payload) {
  return { type: FARMING_TIME_FULFILLED, payload };
}

export function farmingTimeRejected() {
  return { type: FARMING_TIME_REJECTED };
}

export function updateFarmingStatus() {
  return { type: UPDATE_FARMING_STATUS };
}

export function walletUnavailableLayerOpen() {
  return { type: USER_WALLET_UNAVAILABLE_LAYER_OPEN };
}

export function walletUnavailableLayerClose() {
  return { type: USER_WALLET_UNAVAILABLE_LAYER_CLOSED };
}

export function stakingContractSet(contractSymbol) {
  return { type: STAKING_CONTRACT_SET, payload: contractSymbol };
}

export function hasLoaded() {
  return { type: HAS_LOADED };
}

export function refreshBalances() {
  return { type: REFRESH_BALANCES };
}

export function balancesRefreshed() {
  return { type: BALANCES_REFRESHED };
}

export function resetBalances() {
  return { type: BALANCES_RESET };
}

export function tokenContractsFulfilled(payload) {
  return { type: TOKEN_CONTRACTS_FULFILLED, payload };
}

export function tokenContractsRejected() {
  return { type: TOKEN_CONTRACTS_REJECTED };
}

export function tokenRatioFulfilled(response, contractSymbol) {
  return {
    type: TOKEN_RATIO_FULFILLED,
    payload: {
      ratio: calculateTokenRatio(response),
      contractSymbol,
    },
  };
}

export function tokenRatioRejected() {
  return { type: TOKEN_RATIO_REJECTED };
}

export function tokenStakingBalanceSet(payload) {
  return { type: TOKEN_STAKING_BALANCE_SET, payload };
}

export function tokenBonusBalanceSet(payload) {
  return { type: TOKEN_BONUS_BALANCE_SET, payload };
}

export function ContractProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const {
    stakingContractSymbol,
    staking: { tokenAddress, bonusTokenAddress },
  } = state;

  const shouldRefreshOnNewBlock = useNewBlockListener();

  const { address, isCorrectNetwork, chainId, currentChain } = useWallet();

  const contract = useERC20(
    currentChain && stakingContractSymbol
      ? contractAddresses[currentChain][stakingContractSymbol]
      : ""
  );

  const fetchTokenInfo = useCallback(() => {
    if (contract) {
      const stakingContract =
        contractAddresses[currentChain][stakingContractSymbol];

      getRewardsTokenInfo(
        (response) => dispatch(rewardsTokenInfoFulfilled(response)),
        console.warn,
        [],
        stakingContract
      );
    }
    /* eslint-disable-next-line */
  }, [contract, chainId]);

  const fetchTransactions = useCallback(() => {
    const storageTransactions = JSON.parse(
      localStorage.getItem("transactions")
    );

    if (storageTransactions) {
      dispatch(transactionsSet(storageTransactions));
    }
  }, []);

  const fetchPastIterations = useCallback(
    (contracts, contractSymbol) => {
      if (address && shouldRefreshOnNewBlock) {
        contracts.forEach(({ address: contractAddress, iteration }) => {
          getStakingEssentialInfo(
            (response) =>
              dispatch(
                userPastIterationInfoFullfiled(
                  response,
                  contractSymbol,
                  contractAddress,
                  iteration
                )
              ),
            console.error,
            [address],
            contractAddress
          );
        });
      }
    },
    [address, shouldRefreshOnNewBlock]
  );

  const fetchContractsData = useCallback(
    (contractSymbols) => {
      if (address && contractSymbols && shouldRefreshOnNewBlock) {
        contractSymbols.forEach((symbol) => {
          const stakingContract = contractAddresses[currentChain][symbol];
          const { shouldFetchRatio, options, isLockup } = contracts[symbol];
          const { pastIterations } = options[currentChain];

          if (pastIterations && !isEmpty(pastIterations)) {
            fetchPastIterations(pastIterations, symbol);
          }

          if (!isLockup) {
            getTokenBalance(
              (response) =>
                dispatch(userTokenBalanceFulfilled(response, symbol)),
              (response) =>
                dispatch(userTokenBalanceRejected(response, symbol)),
              [address],
              stakingContract
            );

            getTokenAllowance(
              (response) =>
                dispatch(userTokenAllowanceFulfilled(response, symbol)),
              (response) =>
                dispatch(userTokenAllowanceRejected(response, symbol)),
              [address, stakingContract],
              stakingContract
            );

            getTotalSupply(
              (response) =>
                dispatch(userTotalSupplyFulfilled(response, symbol)),
              (response) => dispatch(userTotalSupplyRejected(response, symbol)),
              [],
              stakingContract
            );

            getPaused(
              (response) => dispatch(pausedFulfilled(response)),
              (response) => dispatch(pausedRejected(response)),
              [],
              stakingContract
            );

            getUserInfo(
              (response) =>
                dispatch(userStakingInfoFulfilled(response, symbol)),
              (response) => dispatch(userStakingInfoRejected(response, symbol)),
              [address],
              stakingContract
            );

            getStakingBasicData(
              (response) => dispatch(tokenContractsFulfilled(response)),
              () => dispatch(tokenContractsRejected()),
              stakingContract
            );

            getRewardsTokenBalance(
              (response) =>
                dispatch(userRewardsTokenBalanceFulfilled(response, symbol)),
              (response) =>
                dispatch(userRewardsTokenBalanceRejected(response, symbol)),
              [address],
              stakingContract
            );

            if (shouldFetchRatio) {
              getTokenRatio(
                (response) => dispatch(tokenRatioFulfilled(response, symbol)),
                (response) => dispatch(tokenRatioRejected(response, symbol)),
                [],
                stakingContract
              );
            }
          }
        });
      }
      dispatch(balancesRefreshed());
    },
    /* eslint-disable-next-line */
    [address, shouldRefreshOnNewBlock, currentChain]
  );

  const fetchStakingTokenBalance = ({
    tokenAddress,
    stakingContractSymbol,
    currentChain,
  }) =>
    getTokenBalance(
      (totalStakingBalance) =>
        dispatch(
          tokenStakingBalanceSet({ stakingContractSymbol, totalStakingBalance })
        ),
      undefined,
      [contractAddresses[currentChain][stakingContractSymbol]],
      undefined,
      tokenAddress
    );

  useEffect(() => {
    if (tokenAddress && address && currentChain) {
      fetchStakingTokenBalance({
        tokenAddress,
        stakingContractSymbol,
        currentChain,
      });
    }
    /* eslint-disable-next-line */
  }, [
    shouldRefreshOnNewBlock,
    tokenAddress,
    stakingContractSymbol,
    currentChain,
    address,
  ]);

  const fetchBonusTokenBalance = ({
    bonusTokenAddress,
    stakingContractSymbol,
    currentChain,
  }) =>
    getTokenBalance(
      (bonusTokenBalance) =>
        dispatch(
          tokenBonusBalanceSet({ stakingContractSymbol, bonusTokenBalance })
        ),
      undefined,
      [contractAddresses[currentChain][stakingContractSymbol]],
      undefined,
      bonusTokenAddress
    );

  useEffect(() => {
    if (bonusTokenAddress && address && currentChain) {
      fetchBonusTokenBalance({
        bonusTokenAddress,
        stakingContractSymbol,
        currentChain,
      });
    }
    /* eslint-disable-next-line */
  }, [
    shouldRefreshOnNewBlock,
    bonusTokenAddress,
    stakingContractSymbol,
    currentChain,
    address,
  ]);

  useEffect(() => {
    async function startApp() {
      dispatch(hasLoaded());

      if (isCorrectNetwork && address) {
        fetchTokenInfo();
      }
    }

    startApp();
  }, [fetchTokenInfo, isCorrectNetwork, address]);

  useEffect(() => {
    if (address) {
      fetchTransactions();
    }
  }, [address, fetchTransactions]);

  useEffect(() => {
    if (address && shouldRefreshOnNewBlock) {
      fetchContractsData(
        stakingContractSymbol ? [stakingContractSymbol] : availableStreams
      );
    }
  }, [
    address,
    shouldRefreshOnNewBlock,
    fetchContractsData,
    stakingContractSymbol,
  ]);

  return (
    <ContractContext.Provider value={{ state, dispatch }}>
      {children}
    </ContractContext.Provider>
  );
}

export function useContract() {
  return React.useContext(ContractContext);
}
