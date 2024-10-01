import React, { useEffect, createContext, useReducer, useContext } from "react";

import { BigNumber } from "ethers";

import { useWallet } from "utils/store/Wallet";
import { useNewBlockListener } from "utils/hooks";

import {
  lensService,
  lockupService,
  collectSymbols,
  collectBalances,
  getTokenAllowance,
  getTotalSupply,
  getTokenBalance,
} from "utils/services";

import { contracts, WAITING, ERROR, SUCCESS } from "utils/constants";

import { pushTxIntoLocalStorage, hasUnixTimeGonePast } from "utils";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const LockupContext = createContext();

const actionTypes = {
  tokenAdressesSet: "lockup/token_adresses_set",
  periodsAndMultipliersSet: "lockup/periods_and_multipliers_set",
  symbolsSet: "lockup/symbols_set",
  balancesSet: "lockup/balances_set",
  allowanceSet: "lockup/allowance_set",
  clearTransactions: "lockup/clear_transactions",
  lockRequested: "lockup/lock_requested",
  allowanceHashSet: "lockup/allowance_hash_set",
  allowanceSuccessful: "lockup/allowance_successful",
  allowanceError: "lockup/allowance_error",
  lockingHashSet: "lockup/locking_hash_set",
  lockingSuccess: "lockup/locking_success",
  lockingError: "lockup/locking_error",
  setLoading: "lockup/set_loading",
  infoSet: "lockup/info_set",
  unlockRequested: "lockup/unlock_requested",
  claimHashSet: "lockup/claim_hash_set",
  claimSuccess: "lockup/claim_success",
  claimSkipped: "lockup/claim_skipped",
  claimError: "lockup/claim_error",
  unlockHashSet: "lockup/unlock_hash_set",
  unlockSuccess: "lockup/unlock_success",
  unlockError: "lockup/unlock_error",
  totalSupplySuccess: "lockup/total_supply_success",
  bonusTokenBalanceSet: "lockup/bonus_token_balance",
  totalStakingBalanceSet: "lockup/staking_token_balance_set",
  setIsTransactioning: "lockup/set_is_transactioning",
};

export const initialState = {
  rewardToken: {
    symbol: "rUMB",
    balance: BigNumber.from(0),
    contractAdress: undefined,
  },
  token: {
    symbol: "UMB",
    balance: BigNumber.from(0),
    allowance: BigNumber.from(0),
    contractAdress: undefined,
  },
  isTransactioning: false,
  lockSteps: [],
  isLoadingData: false,
  periodsAndMultipliers: [],
  unlocked: [false, true, false],
  bonusContractAddress: undefined,
  staked: BigNumber.from(0),
  totalRewards: BigNumber.from(0),
  totalBalance: BigNumber.from(0),
  totalBonus: BigNumber.from(0),
  totalStakingBalance: BigNumber.from(0),
  bonusTokenBalance: BigNumber.from(0),
  isReady: false,
  unlockSteps: [],
};

export function lockupReducer(state = {}, action = {}) {
  const { payload, type } = action;

  switch (type) {
    case actionTypes.bonusTokenBalanceSet:
      return {
        ...state,
        bonusTokenBalance: payload,
      };
    case actionTypes.unlockRequested:
      return {
        ...state,
        isTransactioning: true,
        unlockSteps: [
          {
            type: "blockchain",
            label: "Claiming Rewards",
            status: WAITING,
            hash: undefined,
          },
          {
            type: "blockchain",
            label: "Unlocking Tokens",
            status: undefined,
            hash: undefined,
          },
          {
            type: "wallet",
            label: "Tokens Unlocked",
            statuses: undefined,
          },
        ],
      };
    case actionTypes.claimHashSet:
      pushTxIntoLocalStorage({
        method: "claim",
        txData: payload.tx,
        chainId: payload.chainId,
        stakingContractSymbol: payload.stakingContractSymbol,
      });

      return {
        ...state,
        unlockSteps: [
          {
            type: "blockchain",
            label: "Claiming Rewards",
            status: WAITING,
            hash: payload.tx.hash,
          },
          {
            type: "blockchain",
            label: "Unlocking Tokens",
            status: undefined,
            hash: undefined,
          },
          {
            type: "wallet",
            label: "Tokens Unlocked",
            statuses: undefined,
          },
        ],
      };
    case actionTypes.claimSuccess:
      return {
        ...state,
        unlockSteps: [
          {
            type: "blockchain",
            label: "Claiming Rewards",
            status: SUCCESS,
            hash: state.unlockSteps[0].hash,
          },
          {
            type: "blockchain",
            label: "Unlocking Tokens",
            status: WAITING,
            hash: undefined,
          },
          {
            type: "wallet",
            label: "Tokens Unlocked",
            statuses: undefined,
          },
        ],
      };
    case actionTypes.claimSkipped:
      return {
        ...state,
        unlockSteps: [
          {
            type: "blockchain",
            label: "Claiming Rewards",
            status: SUCCESS,
            hash: undefined,
            message: "No claimable rewards",
          },
          {
            type: "blockchain",
            label: "Unlocking Tokens",
            status: WAITING,
            hash: undefined,
          },
          {
            type: "wallet",
            label: "Tokens Unlocked",
            statuses: undefined,
          },
        ],
      };
    case actionTypes.claimError:
      return {
        ...state,
        isTransactioning: false,
        unlockSteps: [
          {
            type: "blockchain",
            label: "Claiming Rewards",
            status: ERROR,
            hash: state.unlockSteps[0].hash,
          },
          {
            type: "blockchain",
            label: "Unlocking Tokens",
            status: undefined,
            hash: undefined,
          },
          {
            type: "wallet",
            label: "Tokens Unlocked",
            statuses: undefined,
            message: "Claiming failed",
          },
        ],
      };
    case actionTypes.unlockHashSet:
      pushTxIntoLocalStorage({
        method: "unlock",
        txData: payload.tx,
        chainId: payload.chainId,
        stakingContractSymbol: payload.stakingContractSymbol,
      });

      return {
        ...state,
        unlockSteps: [
          state.unlockSteps[0],
          {
            type: "blockchain",
            label: "Unlocking Tokens",
            status: WAITING,
            hash: payload.tx.hash,
          },
          {
            type: "wallet",
            label: "Tokens Unlocked",
            statuses: undefined,
          },
        ],
      };
    case actionTypes.unlockSuccess:
      return {
        ...state,
        isTransactioning: false,
        unlockSteps: [
          state.unlockSteps[0],
          {
            type: "blockchain",
            hash: state.unlockSteps[1].hash,
            status: SUCCESS,
            label: "Unlock Tokens",
          },
          {
            type: "wallet",
            status: SUCCESS,
            label: "Tokens Unlocked",
            message: "Tokens unlocked successfully",
          },
        ],
      };
    case actionTypes.unlockError:
      return {
        ...state,
        isTransactioning: false,
        unlockSteps: [
          state.unlockSteps[0],
          {
            type: "blockchain",
            hash: state.unlockSteps[1].hash,
            status: ERROR,
            label: "Unlock Tokens",
          },
          {
            type: "wallet",
            status: undefined,
            label: "Tokens Unlocked",
            message: "Unlocking failed",
          },
        ],
      };
    case actionTypes.infoSet:
      return {
        ...state,
        ...payload,
        isLoadingData: false,
      };
    case actionTypes.setLoading:
      return {
        ...state,
        isLoadingData: true,
      };
    case actionTypes.tokenAdressesSet:
      return {
        ...state,
        bonusContractAddress: payload.bonusContractAddress,
        rewardToken: {
          ...state.rewardToken,
          contractAdress: payload.rewardTokenContractAddress,
        },
        token: {
          ...state.token,
          contractAdress: payload.tokenContractAddress,
        },
      };
    case actionTypes.periodsAndMultipliersSet:
      return {
        ...state,
        periodsAndMultipliers: payload,
        isReady: true,
      };
    case actionTypes.symbolsSet:
      return {
        ...state,
        token: {
          ...state.token,
          symbol: payload.tokenSymbol,
        },
        rewardToken: {
          ...state.rewardToken,
          symbol: payload.rewardTokenSymbol,
        },
      };
    case actionTypes.balancesSet:
      return {
        ...state,
        token: {
          ...state.token,
          balance: payload.balance,
        },
        rewardToken: {
          ...state.rewardToken,
          balance: payload.rewardBalance,
        },
      };
    case actionTypes.allowanceSet:
      return {
        ...state,
        token: {
          ...state.token,
          allowance: payload,
        },
      };
    case actionTypes.setIsTransactioning:
      return {
        ...state,
        isTransactioning: true,
      };
    case actionTypes.clearTransactions:
      return {
        ...state,
        isTransactioning: false,
        lockSteps: [],
        unlockSteps: [],
      };
    case actionTypes.lockRequested:
      return {
        ...state,
        isTransactioning: true,
        lockSteps: [
          {
            type: "blockchain",
            label: "Allowance",
            status: WAITING,
            hash: undefined,
          },
          {
            type: "blockchain",
            label: "Locking",
            status: undefined,
            hash: undefined,
          },
          {
            type: "wallet",
            label: "Tokens locked",
            statuses: undefined,
            hash: undefined,
          },
        ],
      };
    case actionTypes.allowanceHashSet:
      pushTxIntoLocalStorage({
        method: "allowance",
        txData: payload.tx,
        chainId: payload.chainId,
        stakingContractSymbol: payload.stakingContractSymbol,
      });

      return {
        ...state,
        lockSteps: [
          {
            type: "blockchain",
            label: "Allowance",
            status: WAITING,
            hash: payload.tx.hash,
          },
          {
            type: "blockchain",
            label: "Locking",
            status: undefined,
            hash: undefined,
          },
          {
            type: "wallet",
            label: "Tokens locked",
            statuses: undefined,
            hash: undefined,
          },
        ],
      };
    case actionTypes.allowanceSuccessful:
      return {
        ...state,
        lockSteps: [
          {
            type: "blockchain",
            label: "Allowance",
            status: SUCCESS,
            hash: state.lockSteps[0].hash,
          },
          {
            type: "blockchain",
            label: "Locking",
            status: WAITING,
            hash: undefined,
          },
          {
            type: "wallet",
            label: "Tokens locked",
            statuses: undefined,
            hash: undefined,
          },
        ],
      };
    case actionTypes.allowanceError:
      return {
        ...state,
        lockSteps: [
          {
            type: "blockchain",
            label: "Allowance",
            status: ERROR,
            hash: state.lockSteps[0].hash,
          },
          {
            type: "blockchain",
            label: "Locking",
            status: undefined,
            hash: undefined,
          },
          {
            type: "wallet",
            label: "Tokens locked",
            statuses: undefined,
            hash: undefined,
          },
        ],
      };
    case actionTypes.lockingHashSet:
      pushTxIntoLocalStorage({
        method: "lockup",
        txData: payload.tx,
        chainId: payload.chainId,
        stakingContractSymbol: payload.stakingContractSymbol,
      });

      return {
        ...state,
        lockSteps: [
          state.lockSteps[0],
          {
            type: "blockchain",
            label: "Locking",
            status: WAITING,
            hash: payload.tx.hash,
          },
          {
            type: "wallet",
            label: "Tokens locked",
            statuses: undefined,
            hash: undefined,
          },
        ],
      };
    case actionTypes.lockingSuccess:
      return {
        ...state,
        lockSteps: [
          state.lockSteps[0],
          {
            type: "blockchain",
            label: "Locking",
            status: SUCCESS,
            hash: state.lockSteps[1].hash,
          },
          {
            type: "wallet",
            label: "Tokens locked",
            status: SUCCESS,
            message: "Tokens locked successfully",
          },
        ],
      };
    case actionTypes.lockingError:
      return {
        ...state,
        lockSteps: [
          state.lockSteps[0],
          {
            type: "blockchain",
            label: "Locking",
            status: ERROR,
            hash: undefined,
          },
          {
            type: "wallet",
            label: "Tokens locked",
            statuses: ERROR,
            hash: undefined,
          },
        ],
      };
    case actionTypes.totalSupplySuccess:
      return {
        ...state,
        totalBalance: payload.totalBalance,
        totalBonus: payload.totalBonus,
      };
    case actionTypes.totalStakingBalanceSet:
      return {
        ...state,
        totalStakingBalance: payload,
      };
    default:
      return state;
  }
}

export const clearTransaction = () => {
  return { type: actionTypes.clearTransaction };
};

export function getTokenBalanceFulfilled(address, balance) {
  return {
    type: actionTypes.getTokenBalanceFulfilled,
    payload: { [address]: balance },
  };
}

export function getStakingRewardsFulfilled(address, rewards) {
  return {
    type: actionTypes.getStakingRewardsFulfilled,
    payload: { [address]: rewards },
  };
}

const setTokenAddresses = async (dispatch, stakingContract) => {
  const rewardTokenContractAddress = await lockupService.rewardsToken({
    contractAddress: stakingContract,
  });

  const tokenContractAddress = await lockupService.stakingToken({
    contractAddress: stakingContract,
  });

  const bonusContractAddress = await lockupService.bonusToken({
    contractAddress: stakingContract,
  });

  dispatch({
    type: actionTypes.tokenAdressesSet,
    payload: {
      rewardTokenContractAddress,
      tokenContractAddress,
      bonusContractAddress,
    },
  });
};

const setMultipliersAndPeriods = async (
  dispatch,
  { lensContract, stakingContract, mainTokenContractAddress }
) => {
  const response = await lensService.getPeriodsAndMultipliers({
    contractAddress: lensContract,
    params: [stakingContract, mainTokenContractAddress],
  });

  dispatch({
    type: actionTypes.periodsAndMultipliersSet,
    payload: response,
  });
};

const getTokenSymbols = async (
  dispatch,
  { mainTokenContractAddress, rewardContractAddress }
) => {
  collectSymbols(
    ([{ tokenSymbol }, { tokenSymbol: rewardTokenSymbol }]) =>
      dispatch({
        type: actionTypes.symbolsSet,
        payload: { tokenSymbol, rewardTokenSymbol },
      }),
    [mainTokenContractAddress, rewardContractAddress]
  );
};

const getBalances = async (
  dispatch,
  { userAddress, mainTokenContractAddress, rewardContractAddress }
) => {
  collectBalances(
    ([{ tokenBalance: balance }, { tokenBalance: rewardBalance }]) =>
      dispatch({
        type: actionTypes.balancesSet,
        payload: { balance, rewardBalance },
      }),
    [mainTokenContractAddress, rewardContractAddress],
    [userAddress]
  );
};

const getAllowance = async (
  dispatch,
  { userAddress, mainTokenContractAddress, stakingContract }
) => {
  getTokenAllowance(
    (response) =>
      dispatch({ type: actionTypes.allowanceSet, payload: response }),
    undefined,
    [userAddress, stakingContract],
    stakingContract,
    mainTokenContractAddress
  );
};

const lockTokens = async (
  dispatch,
  {
    userAddress,
    stakingContract,
    tokenContract,
    trustContract,
    amount,
    period,
    chainId,
    stakingContractSymbol,
  }
) => {
  dispatch({ type: actionTypes.lockRequested });

  lockupService.lockTokens({
    userAddress,
    stakingContract,
    tokenContract,
    trustContract,
    amount,
    period,
    allowHashCallback: (tx) =>
      dispatch({
        type: actionTypes.allowanceHashSet,
        payload: { tx, stakingContractSymbol, chainId, address: userAddress },
      }),
    allowSuccessCallback: () =>
      dispatch({ type: actionTypes.allowanceSuccessful }),
    allowErrorCallback: () => dispatch({ type: actionTypes.allowanceError }),
    lockingHashCallback: (tx) =>
      dispatch({
        type: actionTypes.lockingHashSet,
        payload: { tx, chainId, stakingContractSymbol, address: userAddress },
      }),
    lockingSuccessCallback: () =>
      dispatch({ type: actionTypes.lockingSuccess }),
    lockingErrorCallback: () => dispatch({ type: actionTypes.lockingError }),
  });
};

const getLockupInfo = async (dispatch, { userAddress, stakingContract }) => {
  const totalRewards = await lockupService.earned({
    contractAddress: stakingContract,
    params: [userAddress],
  });

  const balances = await lockupService.balances({
    contractAddress: stakingContract,
    params: [userAddress],
  });

  const staked = balances.umbBalance;

  dispatch({
    type: actionTypes.infoSet,
    payload: {
      staked,
      totalRewards,
    },
  });
};

const scanLocks = async ({ contractAddress, poolAddress, userAddress }) => {
  const locksStatus = await lensService.getVestedLockIds({
    contractAddress,
    params: [poolAddress, userAddress],
  });

  const promises = Array(locksStatus.length)
    .fill(null)
    .map((_, index) =>
      lockupService.locks({
        contractAddress: poolAddress,
        params: [userAddress, index],
      })
    );

  const locks = await Promise.all(promises);

  const formattedLocks = locks.map((lock) => ({
    ...lock,
    mayUnlock: hasUnixTimeGonePast(lock.unlockDate),
    hasUnlocked: Boolean(lock.withdrawnAt),
  }));

  return formattedLocks;
};

const unlockTokens = async (
  dispatch,
  {
    stakingContract,
    userAddress,
    chainId,
    stakingContractSymbol,
    ids,
    successCallback,
    totalRewards,
  }
) => {
  dispatch({ type: actionTypes.unlockRequested });

  lockupService.unlockTokens({
    stakingContract,
    params: [ids],
    totalRewards,
    claimHashCallback: (tx) =>
      dispatch({
        type: actionTypes.claimHashSet,
        payload: { tx, stakingContractSymbol, chainId, address: userAddress },
      }),
    claimSuccessCallback: () => dispatch({ type: actionTypes.claimSuccess }),
    claimSkippedCallback: () => dispatch({ type: actionTypes.claimSkipped }),
    claimErrorCallback: () => dispatch({ type: actionTypes.claimError }),
    unlockingHashCallback: (tx) =>
      dispatch({
        type: actionTypes.unlockHashSet,
        payload: { tx, stakingContractSymbol, chainId, address: userAddress },
      }),
    unlockingSuccessCallback: () => {
      dispatch({ type: actionTypes.unlockSuccess });
      successCallback && successCallback();
    },
    unlockingErrorCallback: () => dispatch({ type: actionTypes.unlockError }),
  });
};

const setTotalSupply = async (dispatch, { stakingContract }) =>
  getTotalSupply(
    (payload) => dispatch({ type: actionTypes.totalSupplySuccess, payload }),
    undefined,
    undefined,
    stakingContract
  );

const settotalStakingBalance = async (
  dispatch,
  { stakingContract, mainTokenContractAddress }
) =>
  getTokenBalance(
    (payload) =>
      dispatch({ type: actionTypes.totalStakingBalanceSet, payload }),
    undefined,
    [stakingContract],
    undefined,
    mainTokenContractAddress
  );

const setBonusTokenBalance = async (
  dispatch,
  { bonusContractAddress, stakingContract }
) =>
  getTokenBalance(
    (payload) => dispatch({ type: actionTypes.bonusTokenBalanceSet, payload }),
    undefined,
    [stakingContract],
    undefined,
    bonusContractAddress
  );

export function LockupProvider({ children }) {
  const [state, dispatch] = useReducer(lockupReducer, initialState);

  const {
    bonusContractAddress,
    isLoadingData,
    token: { contractAdress: mainTokenContractAddress },
    rewardToken: { contractAdress: rewardContractAddress },
  } = state;

  const queryClient = useQueryClient();
  const { chainId, address: userAddress, currentChain } = useWallet();
  const shouldRefreshOnNewBlock = useNewBlockListener();
  const { id } = useParams();

  const { options } = contracts[id];
  const { address: stakingContract, lensContract } = options[currentChain];

  const {
    data: locks,
    isLoading,
    isRefetching,
  } = useQuery(
    ["locks"],
    () =>
      scanLocks({
        contractAddress: lensContract,
        poolAddress: stakingContract,
        userAddress,
      }),
    { enabled: !!userAddress }
  );

  useEffect(() => {
    if (stakingContract && userAddress) {
      setTokenAddresses(dispatch, stakingContract);
    }
  }, [stakingContract, userAddress]);

  useEffect(() => {
    if (lensContract && stakingContract && mainTokenContractAddress) {
      setMultipliersAndPeriods(dispatch, {
        lensContract,
        stakingContract,
        mainTokenContractAddress,
      });

      setTotalSupply(dispatch, {
        stakingContract,
      });
    }
  }, [lensContract, stakingContract, mainTokenContractAddress]);

  const hasNecessaryInfoForDataFetching =
    mainTokenContractAddress && rewardContractAddress && userAddress;

  useEffect(() => {
    if (hasNecessaryInfoForDataFetching && !isLoadingData) {
      dispatch({ type: actionTypes.setLoading });

      getTokenSymbols(dispatch, {
        userAddress,
        rewardContractAddress,
        mainTokenContractAddress,
      });

      getBalances(dispatch, {
        userAddress,
        rewardContractAddress,
        mainTokenContractAddress,
      });

      getAllowance(dispatch, {
        userAddress,
        mainTokenContractAddress,
        stakingContract,
      });

      getLockupInfo(dispatch, { userAddress, stakingContract });
    }
    /* eslint-disable-next-line */
  }, [hasNecessaryInfoForDataFetching, shouldRefreshOnNewBlock]);

  useEffect(() => {
    if (stakingContract && mainTokenContractAddress) {
      settotalStakingBalance(dispatch, {
        stakingContract,
        mainTokenContractAddress,
      });
    }
    /* eslint-disable-next-line */
  }, [stakingContract, mainTokenContractAddress, shouldRefreshOnNewBlock]);

  useEffect(() => {
    if (bonusContractAddress && stakingContract) {
      setBonusTokenBalance(dispatch, {
        bonusContractAddress,
        stakingContract,
      });
    }
    /* eslint-disable-next-line */
  }, [bonusContractAddress, stakingContract, shouldRefreshOnNewBlock]);

  useEffect(() => {
    if (shouldRefreshOnNewBlock) {
      queryClient.invalidateQueries(["locks"]);
    }

    /* eslint-disable-next-line */
  }, [shouldRefreshOnNewBlock]);

  return (
    <LockupContext.Provider
      value={{
        locks,
        isLoading,
        isRefetching,
        state,
        dispatch,
        claim: () => lockupService.claim({ contractAddress: stakingContract }),
        exit: (params) =>
          lockupService.exit({
            contractAddress: stakingContract,
            params: [params],
          }),
        setIsTransactioning: () =>
          dispatch({ type: actionTypes.setIsTransactioning }),
        clearTransactions: () =>
          dispatch({ type: actionTypes.clearTransactions }),
        lockTokens: (args) =>
          lockTokens(dispatch, {
            stakingContract,
            userAddress,
            chainId,
            tokenContract: mainTokenContractAddress,
            ...args,
          }),
        unlockTokens: (args) =>
          unlockTokens(dispatch, {
            stakingContract,
            userAddress,
            chainId,
            ...args,
          }),
      }}
    >
      {children}
    </LockupContext.Provider>
  );
}

export function useLockup() {
  return useContext(LockupContext);
}
