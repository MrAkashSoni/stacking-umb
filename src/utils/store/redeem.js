import React, { useEffect } from "react";
import { BigNumber } from "ethers";

import { useNewBlockListener, useLocalStorage } from "utils/hooks";

import {
  web3Provider,
  redeemService,
  collectSymbols,
  collectBalances,
  getStakingEssentialInfo,
  getReward,
} from "utils/services";

import {
  TX_FAILED_STATUS,
  WAITING,
  ERROR,
  SUCCESS,
  doneStatuses,
} from "utils/constants";

import { addTxToRedeemStoredData, loadRedeemStoredData } from "utils/redeem";

const RedeemContext = React.createContext();

const actionTypes = {
  getTokenBalanceFulfilled: "get_token_balance_fulfilled",
  getRedeemInfo: "redeem/get_redeem_info",
  setTransactionHash: "redeemReducer/set_transaction_hash",
  setTransactionStatus: "redeem/set_transaction_status",
  setContracts: "redeem/set_contracts",
  stakingInfoSet: "redeem/staking_info_set",
  symbolsSet: "redeemReducer/symbols_set",
  balancesSet: "redeemReducer/balances_set",
  setIsLoadingData: "redeem/loading",
  getStoredRedeemableAmount: "redeem/get_stored_redeemable_amount",
  storedDataRefreshed: "redeem/stored_data_refreshed",
};

export const initialState = {
  rewardToken: {
    symbol: "rUMB1",
    balance: BigNumber.from(0),
    contractAdress: undefined,
  },
  token: {
    symbol: "UMB",
    balance: BigNumber.from(0),
    contractAdress: undefined,
  },
  earned: BigNumber.from(0),
  stakingContract: undefined,
  userAddress: undefined,
  isReady: false,
  shouldRefreshStoredData: true,
  isSwapStarted: null,
  redeemableAmount: BigNumber.from(0),
  canSwapTokens: false,
  transactionStatus: undefined,
  transactionHash: undefined,
  isDone: false,
  isLoadingData: false,
};

export function redeemReducer(state = {}, action = {}) {
  const { payload, type } = action;

  switch (type) {
    case actionTypes.setTransactionStatus:
      return {
        ...state,
        transactionHash: doneStatuses.includes(payload)
          ? undefined
          : state.transactionHash,
        transactionStatus: payload,
        shouldRefreshStoredData: doneStatuses.includes(payload),
      };
    case actionTypes.setTransactionHash:
      return {
        ...state,
        transactionHash: payload,
      };
    case actionTypes.clearTransaction:
      return {
        ...state,
        transactionStatus: undefined,
        transactionHash: undefined,
        shouldRefreshStoredData: true,
      };
    case actionTypes.storedDataRefreshed:
      return {
        ...state,
        shouldRefreshStoredData: false,
      };
    case actionTypes.getTokenBalanceFulfilled:
      return {
        ...state,
        balances: {
          ...state.balances,
          ...payload,
        },
      };
    case actionTypes.setIsLoadingData:
      return {
        ...state,
        isLoadingData: true,
      };
    case actionTypes.getRedeemInfo:
      return {
        ...state,
        isSwapStarted: payload.isSwapStarted,
        canSwapTokens: payload.canSwapTokens,
        isLoadingData: false,
        isReady: true,
      };
    case actionTypes.getStoredRedeemableAmount:
      return {
        ...state,
        redeemableAmount: payload.redeemableAmount,
      };
    case actionTypes.setContracts:
      return {
        ...state,
        ...action.payload,
      };
    case actionTypes.stakingInfoSet:
      return {
        ...state,
        token: {
          ...state.token,
          contractAddress: payload.tokenAddress,
        },
        rewardToken: {
          ...state.rewardToken,
          contractAddress: payload.rewardsTokenAddress,
        },
        earned: action.payload.earned,
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
    default:
      return state;
  }
}

export const getStoredRedeemableAmount = (storedData) => {
  return {
    type: actionTypes.getStoredRedeemableAmount,
    payload: {
      redeemableAmount: BigNumber.from(storedData?.availableQuota ?? "0"),
    },
  };
};

export const clearTransaction = () => {
  return { type: actionTypes.clearTransaction };
};

const handleContractCallWithTransaction = async (
  dispatch,
  contractCall,
  { storedData, updateStoredData, redeemableBalance }
) => {
  try {
    dispatch({ type: actionTypes.setTransactionStatus, payload: WAITING });

    const response = await contractCall();

    addTxToRedeemStoredData(
      storedData,
      { hash: response.hash, amount: redeemableBalance.toString() },
      updateStoredData
    );

    dispatch({
      type: actionTypes.setTransactionHash,
      payload: response.hash,
    });

    (await web3Provider())
      .waitForTransaction(response.hash)
      .then(({ status }) => {
        dispatch({
          type: actionTypes.setTransactionStatus,
          payload: status === TX_FAILED_STATUS ? ERROR : SUCCESS,
        });
      });
  } catch (e) {
    dispatch({ type: actionTypes.clearTransaction });
    console.error(e);
  }
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

const getTokenSymbols = async (
  dispatch,
  { tokenContract, rewardTokenContract }
) => {
  collectSymbols(
    ([{ tokenSymbol }, { tokenSymbol: rewardTokenSymbol }]) =>
      dispatch({
        type: actionTypes.symbolsSet,
        payload: { tokenSymbol, rewardTokenSymbol },
      }),
    [tokenContract, rewardTokenContract]
  );
};

const getBalances = async (
  dispatch,
  { userAddress, tokenContract, rewardTokenContract }
) => {
  collectBalances(
    ([{ tokenBalance: balance }, { tokenBalance: rewardBalance }]) =>
      dispatch({
        type: actionTypes.balancesSet,
        payload: { balance, rewardBalance },
      }),
    [tokenContract, rewardTokenContract],
    [userAddress]
  );
};

const getStakingInfo = async (dispatch, { stakingContract, userAddress }) => {
  getStakingEssentialInfo(
    (response) =>
      dispatch({ type: actionTypes.stakingInfoSet, payload: response }),
    console.error,
    [userAddress],
    stakingContract
  );
};

const getRedeemInfoFulfilled = ({ isSwapStarted, canSwapTokens }) => ({
  type: actionTypes.getRedeemInfo,
  payload: {
    isSwapStarted,
    canSwapTokens,
  },
});

export const getRedeemInfo = async (
  dispatch,
  { rewardTokenContract, userAddress }
) => {
  dispatch({ type: actionTypes.setIsLoadingData });

  redeemService.getRedeemInfo({
    tokenAddress: rewardTokenContract,
    userAddress,
    successCallback: (data) => dispatch(getRedeemInfoFulfilled(data)),
  });
};

const setContracts = (dispatch, payload) => {
  dispatch({ type: actionTypes.setContracts, payload });
};

const claimRewards = async (dispatch, stakingContract) => {
  dispatch({ type: actionTypes.setTransactionStatus, payload: WAITING });

  getReward(
    () =>
      dispatch({ type: actionTypes.setTransactionStatus, payload: SUCCESS }),
    ({ hash }) =>
      dispatch({ type: actionTypes.setTransactionHash, payload: hash }),
    stakingContract,
    () => dispatch({ type: actionTypes.setTransactionStatus, payload: ERROR })
  );
};

const redeemTokens = async (
  dispatch,
  {
    rewardTokenContract,
    tokenContract,
    storedData,
    updateStoredData,
    redeemableBalance,
  }
) => {
  handleContractCallWithTransaction(
    dispatch,
    () => redeemService.swapFor(rewardTokenContract, tokenContract),
    { storedData, updateStoredData, redeemableBalance }
  );
};

export function RedeemProvider({ children }) {
  const [state, dispatch] = React.useReducer(redeemReducer, initialState);
  const {
    stakingContract,
    userAddress,
    isLoadingData,
    rewardToken: {
      contractAddress: rewardTokenContract,
      balance: redeemableBalance,
    },
    token: { contractAddress: tokenContract },
    shouldRefreshStoredData,
    isReady,
  } = state;

  const shouldRefreshData = useNewBlockListener();
  const { value: storedData, update: updateStoredData } = useLocalStorage(
    "redeem",
    {}
  );

  useEffect(() => {
    if (stakingContract && userAddress) {
      getStakingInfo(dispatch, { stakingContract, userAddress });
    }
  }, [stakingContract, userAddress]);

  useEffect(() => {
    const hasNecessaryData =
      rewardTokenContract && tokenContract && !isLoadingData;

    if (hasNecessaryData) {
      getTokenSymbols(dispatch, { rewardTokenContract, tokenContract });
    }
    /* eslint-disable-next-line */
  }, [rewardTokenContract, tokenContract, isLoadingData]);

  useEffect(() => {
    const hasNecessaryData =
      rewardTokenContract && tokenContract && userAddress && !isLoadingData;

    if (hasNecessaryData) {
      getBalances(dispatch, {
        userAddress,
        rewardTokenContract,
        tokenContract,
      });
    }
    /* eslint-disable-next-line */
  }, [
    rewardTokenContract,
    tokenContract,
    userAddress,
    shouldRefreshData,
    isLoadingData,
  ]);

  useEffect(() => {
    if (shouldRefreshStoredData) {
      loadRedeemStoredData(storedData, updateStoredData);
      dispatch({ type: actionTypes.storedDataRefreshed });
    }
    /* eslint-disable-next-line */
  }, [shouldRefreshStoredData]);

  useEffect(() => {
    dispatch(getStoredRedeemableAmount(storedData));
  }, [storedData]);

  useEffect(() => {
    if (rewardTokenContract && userAddress && (shouldRefreshData || !isReady)) {
      getRedeemInfo(dispatch, { rewardTokenContract, userAddress });
    }
    /* eslint-disable-next-line */
  }, [rewardTokenContract, userAddress, shouldRefreshData]);

  return (
    <RedeemContext.Provider
      value={{
        state,
        dispatch,
        setContracts: (args) => setContracts(dispatch, args),
        redeemTokens: () =>
          redeemTokens(dispatch, {
            rewardTokenContract,
            tokenContract,
            storedData,
            updateStoredData,
            redeemableBalance,
          }),
        claimRewards: () => claimRewards(dispatch, stakingContract),
      }}
    >
      {children}
    </RedeemContext.Provider>
  );
}

export function useRedeem() {
  return React.useContext(RedeemContext);
}
