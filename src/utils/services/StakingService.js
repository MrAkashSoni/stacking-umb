/* eslint-disable-next-line */
/* global BigInt */
import { ABI } from "./ABI";
import { readContract, writeContract, web3Provider } from "./Providers";
import { toUint256, web3ToStorageTransaction } from "utils/formatters";

import {
  STAKING,
  STAKING_V2,
  V2_CONTRACTS,
  TX_FAILED_STATUS,
  STAKE_MAX_VALUE,
  V3_CONTRACTS,
  STAKING_V3,
} from "utils/constants";

import { needsAllowance } from "utils/services";

import { setTokenAllowance } from "./";

const STAKING_TOKEN = "STAKING_TOKEN";
const BONUS_TOKEN = "BONUS_TOKEN";
const TOTAL_SUPPLY = "TOTAL_SUPPLY";
const REWARDS_TOKEN = "REWARDS_TOKEN";
const PERIOD_FINISH = "PERIOD_FINISH";

const REWARDS = "REWARDS";
const EARNED = "EARNED";
const STAKED = "STAKED";
const EXIT = "EXIT";
const GET_REWARD = "GET_REWARD";
const STAKE = "STAKE";
const WITHDRAW = "WITHDRAW";
const PAUSED = "PAUSED";

const contractMethods = {
  STAKING_TOKEN: {
    method: "stakingToken",
    type: "read",
    overrides: {},
  },
  TOTAL_SUPPLY: {
    method: "totalSupply",
    type: "read",
    overrides: {},
  },
  REWARDS_TOKEN: {
    method: "rewardsToken",
    type: "read",
    overrides: {},
  },
  PERIOD_FINISH: {
    method: "periodFinish",
    type: "read",
    overrides: {},
  },
  PERIOD_DURATION: {
    method: "rewardsDuration",
    type: "read",
    overrides: {},
  },
  REWARDS: {
    method: "rewards",
    type: "read",
    overrides: {},
  },
  EARNED: {
    method: "earned",
    type: "read",
    overrides: {},
  },
  STAKED: {
    method: "balanceOf",
    type: "read",
    overrides: {},
  },
  EXIT: {
    method: "exit",
    type: "write",
    overrides: {},
  },
  GET_REWARD: {
    method: "getReward",
    type: "write",
    overrides: {},
  },
  STAKE: {
    method: "stake",
    type: "write",
    overrides: {},
  },
  WITHDRAW: {
    method: "withdraw",
    type: "write",
    overrides: {},
  },
  BONUS_TOKEN: {
    method: "stakingToken",
    type: "read",
    overrides: {},
  },
  PAUSED: {
    method: "paused",
    type: "read",
    overrides: {},
  },
};

// TODO: remove once v1 is deprecated
const v2ContractMethods = {
  STAKED: {
    method: "balances",
    type: "read",
    overrides: {},
  },
  STAKING_TOKEN: {
    method: "umb",
    type: "read",
    overrides: {},
  },
  REWARDS_TOKEN: {
    method: "rUmb2",
    type: "read",
    overrides: {},
  },
  BONUS_TOKEN: {
    method: "rUmb1",
    type: "read",
    overrides: {},
  },
};

async function callback(
  contractOperation,
  successCallback,
  rejectCallback,
  contractParams = [],
  shouldWaitForChain,
  setTransaction = () => {},
  stakingContract,
  contract
) {
  const hasSuccessCallback = typeof successCallback === "function";
  const hasErrorRejectCallback = typeof rejectCallback === "function";

  try {
    const isV2 = V2_CONTRACTS.includes(stakingContract);
    const isV3 = V3_CONTRACTS.includes(stakingContract);
    let contractABI;

    if (isV2) {
      contractABI = ABI[STAKING_V2];
    } else if (isV3) {
      contractABI = ABI[STAKING_V3];
    } else {
      contractABI = ABI[STAKING];
    }

    const v1Method = contractMethods[contractOperation];
    const v2Method = isV2 ? v2ContractMethods[contractOperation] : v1Method;
    const contractMethod = v2Method ?? v1Method;

    const { type, overrides, method } = contractMethod;

    const isWriteOperation = type === "write";

    const contract_ =
      contract ??
      (isWriteOperation
        ? await writeContract(stakingContract, contractABI)
        : await readContract(stakingContract, contractABI));

    if (shouldWaitForChain) {
      const response = await contract_[method](...contractParams, overrides);
      setTransaction(web3ToStorageTransaction(response, method));

      (await web3Provider())
        .waitForTransaction(response.hash)
        .then(({ status }) => {
          if (status === TX_FAILED_STATUS) {
            throw Error;
          }
          successCallback();
        })
        .catch(rejectCallback);
    } else {
      const response = await contract_[method](
        ...contractParams,
        overrides
      ).then((promise) =>
        hasSuccessCallback ? successCallback(promise) : promise
      );

      return response;
    }
  } catch (e) {
    console.warn(contractOperation, stakingContract, e);

    hasErrorRejectCallback && rejectCallback(e);

    return e;
  }
}

async function collect(
  operations,
  successCallback,
  rejectCallback,
  methodParams,
  stakingContractSymbol,
  contract
) {
  const promises = operations.map(({ contractMethod, noArgs = false }) => {
    return new Promise((resolve, reject) =>
      callback(
        contractMethod,
        resolve,
        reject,
        noArgs ? [] : methodParams,
        undefined,
        undefined,
        stakingContractSymbol,
        contract
      )
    );
  });

  Promise.all(promises)
    .then((results) => {
      const collectResult = new Map(
        results.map((result, index) => {
          return [operations[index].key, result];
        })
      );

      successCallback(Object.fromEntries(collectResult));
    })
    .catch((error) => {
      console.error(operations, error);

      rejectCallback(error);
    });
}

export async function getStakingFinishPeriod(successCallback, rejectCallback) {
  return callback(PERIOD_FINISH, successCallback, rejectCallback);
}

export async function getTokenAddress(successCallback, rejectCallback) {
  return callback(STAKING_TOKEN, successCallback, rejectCallback);
}

export async function getRewardsTokenAddress(successCallback, rejectCallback) {
  return callback(REWARDS_TOKEN, successCallback, rejectCallback);
}

export async function getStakingBasicData(
  successCallback,
  rejectCallback,
  stakingContract
) {
  collect(
    [
      { key: "tokenAddress", contractMethod: STAKING_TOKEN },
      {
        key: "rewardsTokenAddress",
        contractMethod: REWARDS_TOKEN,
      },
      {
        key: "bonusTokenAddress",
        contractMethod: BONUS_TOKEN,
      },
    ],
    successCallback,
    rejectCallback,
    [],
    stakingContract
  );
}

export async function getUserRewards(
  successCallback,
  rejectCallback,
  methodParams
) {
  return callback(REWARDS, successCallback, rejectCallback, methodParams);
}

export async function getUserEarnedRewards(
  successCallback,
  rejectCallback,
  methodParams
) {
  return callback(EARNED, successCallback, rejectCallback, methodParams);
}

export async function getUserStakedBalance(
  successCallback,
  rejectCallback,
  methodParams
) {
  return callback(STAKED, successCallback, rejectCallback, methodParams);
}

export async function getUserInfo(
  successCallback,
  rejectCallback,
  methodParams,
  stakingContract
) {
  collect(
    [
      { key: "earned", contractMethod: EARNED },
      { key: "staked", contractMethod: STAKED },
    ],
    successCallback,
    rejectCallback,
    methodParams,
    stakingContract
  );
}

export async function stakeTokens(
  allowSuccessCallback,
  allowErrorCallback,
  stakeSuccessCallback,
  stakeErrorCallback,
  methodParams,
  address,
  trustContract,
  setTransaction,
  stakingContract,
  contract,
  tokenContr
) {
  const stakedAmount = toUint256(methodParams);

  const shouldSetAllowance = await needsAllowance({
    userAddress: address,
    stakingContract,
    value: methodParams,
  });

  const allowanceValue = trustContract
    ? toUint256(STAKE_MAX_VALUE)
    : stakedAmount;

  async function stake() {
    callback(
      STAKE,
      stakeSuccessCallback,
      stakeErrorCallback,
      [stakedAmount],
      true,
      setTransaction,
      stakingContract
    );
  }

  async function approve() {
    if (shouldSetAllowance) {
      const approveResponse = await setTokenAllowance(
        undefined,
        (e) => Promise.reject(e),
        [stakingContract, allowanceValue],
        stakingContract
      );

      if (approveResponse?.hash) {
        setTransaction(web3ToStorageTransaction(approveResponse, "allowance"));
        return (await web3Provider()).waitForTransaction(approveResponse.hash);
      }

      return Promise.reject(
        new Error(`n tem hash, ${JSON.stringify(approveResponse)}`)
      );
    }

    return Promise.resolve();
  }

  await approve()
    .then((response) => {
      if (response?.status === TX_FAILED_STATUS) {
        throw Error;
      }
      allowSuccessCallback();
      stake();
    })
    .catch((e) => {
      allowErrorCallback(e);
    });
}

export async function exitStaking(
  successCallback,
  rejectCallback,
  setTransaction,
  stakingContract
) {
  callback(
    EXIT,
    successCallback,
    rejectCallback,
    undefined,
    true,
    setTransaction,
    stakingContract
  );
}

export async function getReward(
  getRewardCallback,
  setTransaction,
  stakingContract,
  failedCallback
) {
  callback(
    GET_REWARD,
    getRewardCallback,
    failedCallback ?? getRewardCallback,
    undefined,
    true,
    setTransaction,
    stakingContract
  );
}

export async function withdrawTokens(
  withdrawTokensCallback,
  methodParams,
  setTransaction,
  stakingContract,
  handleError
) {
  callback(
    WITHDRAW,
    withdrawTokensCallback,
    handleError ?? withdrawTokensCallback,
    [toUint256(methodParams)],
    true,
    setTransaction,
    stakingContract
  );
}

export async function getTotalSupply(
  successCallback,
  rejectCallback,
  methodParams,
  stakingContract
) {
  return callback(
    TOTAL_SUPPLY,
    successCallback,
    rejectCallback,
    [],
    false,
    undefined,
    stakingContract
  );
}

export async function getPaused(
  successCallback,
  rejectCallback,
  methodParams,
  stakingContract
) {
  return callback(
    PAUSED,
    successCallback,
    rejectCallback,
    [],
    false,
    undefined,
    stakingContract
  );
}

export async function getContractAddresses(
  successCallback,
  rejectCallback,
  methodParams,
  stakingContract
) {
  collect(
    [
      {
        key: "tokenAddress",
        noArgs: true,
        contractMethod: STAKING_TOKEN,
      },
      {
        key: "rewardsTokenAddress",
        noArgs: true,
        contractMethod: REWARDS_TOKEN,
      },
    ],
    successCallback,
    rejectCallback,
    methodParams,
    stakingContract
  );
}

export async function getStakingEssentialInfo(
  successCallback,
  rejectCallback,
  methodParams,
  stakingContract
) {
  collect(
    [
      { key: "earned", contractMethod: EARNED },
      { key: "staked", contractMethod: STAKED },
      {
        key: "tokenAddress",
        noArgs: true,
        contractMethod: STAKING_TOKEN,
      },
      {
        key: "rewardsTokenAddress",
        noArgs: true,
        contractMethod: REWARDS_TOKEN,
      },
    ],
    successCallback,
    rejectCallback,
    methodParams,
    stakingContract
  );
}
