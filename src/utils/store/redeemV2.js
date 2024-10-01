import React, { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";

import { V2 } from "config/redeem";
import { useERC20, useRUMB2, useStakingV2 } from "hooks/useContract";
import { useWallet } from "./Wallet";

import {
  TX_FAILED_STATUS,
  WAITING,
  ERROR,
  SUCCESS,
  doneStatuses,
} from "utils/constants";

import { web3Provider } from "utils/services";

const RedeemV2Context = React.createContext();

const actionTypes = {
  setTransactionHash: "redeemReducer/set_transaction_hash",
  setTransactionStatus: "redeem/set_transaction_status",
  clearTransaction: "redeem/clear_transaction",
};

export const initialState = {
  rewardToken: {
    symbol: "rUMB2",
    balance: BigNumber.from(0),
    contractAddress: V2.eth.rewardToken,
  },
  token: {
    symbol: "UMB",
    balance: BigNumber.from(0),
    contractAddress: V2.eth.mainToken,
  },
  earned: BigNumber.from(0),
  staked: BigNumber.from(0),
  dailyCap: BigNumber.from(0),
  isReady: false,
  isSwapStarted: false,
  redeemableAmount: BigNumber.from(0),
  canSwapTokens: false,
  transactionStatus: undefined,
  transactionHash: undefined,
};

export function redeemV2Reducer(state = {}, action = {}) {
  const { payload, type } = action;

  switch (type) {
    case "loadStakingDetails":
      return {
        ...state,
        earned: payload.earned,
        staked: payload.staked,
        isSwapStarted: payload.isSwapStarted,
        canSwapTokens: payload.canSwapTokens,
        redeemableAmount: payload.redeemableAmount,
        token: {
          ...state.token,
          balance: payload.mainTokenBalance,
        },
        rewardToken: {
          ...state.rewardToken,
          balance: payload.rewardTokenBalance,
        },
        isReady: true,
        dailyCap: payload.dailyCap,
      };
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
    default:
      return state;
  }
}

async function fetchStakingDetails(
  stakingContract,
  mainTokenContract,
  rewardTokenContract,
  address
) {
  return Promise.all([
    stakingContract.balances(address),
    stakingContract.earned(address),
    mainTokenContract.balanceOf(address),
    rewardTokenContract.balanceOf(address),
    rewardTokenContract.canSwapTokens(address),
    rewardTokenContract.isSwapStarted(),
    rewardTokenContract.swapData(),
    rewardTokenContract.currentLimit(),
  ]);
}

export function RedeemV2Provider({ children }) {
  const [state, dispatch] = React.useReducer(redeemV2Reducer, initialState);

  const { address } = useWallet();

  const { mainToken, rewardToken, stakingContract: stakingAddress } = V2.eth;

  const stakingContract = useStakingV2(stakingAddress);
  const mainTokenContract = useERC20(mainToken);
  const rewardTokenContract = useRUMB2(rewardToken);

  const [shouldReloadData, setShouldReloadData] = useState(true);

  async function claimRewards() {
    try {
      dispatch({ type: actionTypes.setTransactionStatus, payload: WAITING });

      const response = await stakingContract.getReward();

      dispatch({
        type: actionTypes.setTransactionHash,
        payload: response.hash,
      });

      (await web3Provider())
        .waitForTransaction(response.hash)
        .then(({ status }) => {
          if (status === TX_FAILED_STATUS) {
            throw Error;
          }
          dispatch({
            type: actionTypes.setTransactionStatus,
            payload: SUCCESS,
          });
          setShouldReloadData(true);
        })
        .catch(() =>
          dispatch({ type: actionTypes.setTransactionStatus, payload: ERROR })
        );
    } catch (e) {
      console.error("redeemV2/claimRewards", e);

      dispatch({ type: actionTypes.setTransactionStatus, payload: ERROR });
    }
  }

  async function redeemTokens() {
    try {
      dispatch({ type: actionTypes.setTransactionStatus, payload: WAITING });

      const response = await rewardTokenContract.swapForUMB();

      dispatch({
        type: actionTypes.setTransactionHash,
        payload: response.hash,
      });

      (await web3Provider())
        .waitForTransaction(response.hash)
        .then(({ status }) => {
          if (status === TX_FAILED_STATUS) {
            throw Error;
          }
          dispatch({
            type: actionTypes.setTransactionStatus,
            payload: SUCCESS,
          });
          setShouldReloadData(true);
        })
        .catch(() =>
          dispatch({ type: actionTypes.setTransactionStatus, payload: ERROR })
        );
    } catch (e) {
      console.error("redeemV2/redeemTokens", e);

      dispatch({ type: actionTypes.setTransactionStatus, payload: ERROR });
    }
  }

  useEffect(() => {
    if (address && shouldReloadData) {
      setShouldReloadData(false);

      fetchStakingDetails(
        stakingContract,
        mainTokenContract,
        rewardTokenContract,
        address
      ).then(
        ([
          balances,
          earned,
          mainTokenBalance,
          rewardTokenBalance,
          canSwapTokens,
          isSwapStarted,
          swapData,
          currentLimit,
        ]) => {
          dispatch({
            type: "loadStakingDetails",
            payload: {
              earned,
              staked: balances.umbBalance,
              mainTokenBalance,
              rewardTokenBalance,
              canSwapTokens,
              isSwapStarted,
              dailyCap: ethers.utils.parseEther(`${swapData.dailyCup}`),
              redeemableAmount: currentLimit,
            },
          });
        }
      );
    }
  }, [
    address,
    shouldReloadData,
    mainTokenContract,
    rewardTokenContract,
    stakingContract,
  ]);

  return (
    <RedeemV2Context.Provider
      value={{
        state,
        dispatch,
        claimRewards,
        redeemTokens,
      }}
    >
      {children}
    </RedeemV2Context.Provider>
  );
}

export function useRedeemV2() {
  return React.useContext(RedeemV2Context);
}
