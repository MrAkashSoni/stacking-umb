import { ethers } from "ethers";
import { ABI } from "./ABI";
import { STAKING_V2, CLAIMABLE_REWARDS_MINIMUM } from "utils/constants";
import { readContract, writeContract, web3Provider } from "./Providers";

import { setTokenAllowance } from "./";

import { toUint256 } from "utils/formatters";

import { STAKE_MAX_VALUE, TX_FAILED_STATUS, ERROR } from "utils/constants";

import { needsAllowance } from "utils/services";

const BONUS_TOKEN = "umb";
const REWARDS_TOKEN = "rUmb2";
const STAKING_TOKEN = "rUmb1";
const BALANCES = "balances";
const EARNED = "earned";
const LOCKS = "locks";
const EXIT = "exitAndUnlock";
const GET_REWARD = "getReward";
const LOCK_TOKENS = "lockTokens";
const UNLOCK_TOKENS = "unlockTokens";

const methods = {
  [BONUS_TOKEN]: { method: BONUS_TOKEN, isWrite: false },
  [REWARDS_TOKEN]: { method: REWARDS_TOKEN, isWrite: false },
  [STAKING_TOKEN]: { method: STAKING_TOKEN, isWrite: false },
  [LOCKS]: { method: LOCKS, isWrite: false },
  [BALANCES]: { method: BALANCES, isWrite: false },
  [EARNED]: { method: EARNED, isWrite: false },
  [EXIT]: { method: EXIT, isWrite: true },
  [GET_REWARD]: { method: GET_REWARD, isWrite: true },
  [LOCK_TOKENS]: {
    method: LOCK_TOKENS,
    isWrite: true,
  },
  [UNLOCK_TOKENS]: { method: UNLOCK_TOKENS, isWrite: true },
};

const getContract = async (contractAddress, contractABI, isWrite) => {
  return isWrite
    ? writeContract(contractAddress, contractABI)
    : readContract(contractAddress, contractABI);
};

const callSmartContract = async (
  contractAddress,
  contractMethod,
  params = []
) => {
  try {
    const { method, isWrite } = methods[contractMethod];

    const contract = await getContract(
      contractAddress,
      ABI[STAKING_V2],
      isWrite
    );

    return contract[method](...params);
  } catch (e) {
    console.log(contractMethod, e);
  }
};

const bonusToken = ({ contractAddress }) =>
  callSmartContract(contractAddress, BONUS_TOKEN);

const rewardsToken = ({ contractAddress }) =>
  callSmartContract(contractAddress, REWARDS_TOKEN);

const stakingToken = ({ contractAddress }) =>
  callSmartContract(contractAddress, STAKING_TOKEN);

const balances = ({ contractAddress, params }) =>
  callSmartContract(contractAddress, BALANCES, params);

const exit = ({ contractAddress, params }) =>
  callSmartContract(contractAddress, EXIT, params);
const claim = ({ contractAddress }) =>
  callSmartContract(contractAddress, GET_REWARD);

const earned = ({ contractAddress, params }) =>
  callSmartContract(contractAddress, EARNED, params);

const locks = ({ contractAddress, params }) =>
  callSmartContract(contractAddress, LOCKS, params);

export async function lockTokens({
  trustContract,
  userAddress,
  stakingContract,
  tokenContract,
  amount,
  allowHashCallback,
  allowSuccessCallback,
  allowErrorCallback,
  lockingHashCallback,
  lockingSuccessCallback,
  lockingErrorCallback,
  period,
}) {
  const lockAmount = toUint256(amount);

  const shouldSetAllowance = await needsAllowance({
    userAddress,
    stakingContract,
    value: amount,
    contractAddress: tokenContract,
  });

  const allowanceValue = trustContract
    ? toUint256(STAKE_MAX_VALUE)
    : lockAmount;

  async function lock() {
    try {
      const response = await callSmartContract(stakingContract, LOCK_TOKENS, [
        tokenContract,
        lockAmount,
        toUint256(period),
      ]);

      lockingHashCallback(response);

      (await web3Provider())
        .waitForTransaction(response.hash)
        .then(({ status }) =>
          status === TX_FAILED_STATUS
            ? lockingErrorCallback(response)
            : lockingSuccessCallback(response)
        );
    } catch {
      lockingErrorCallback(ERROR);
    }
  }

  async function approve() {
    if (shouldSetAllowance) {
      const approveResponse = await setTokenAllowance(
        undefined,
        Promise.reject,
        [stakingContract, allowanceValue],
        stakingContract,
        // TODO: remove once v1 is deprecated, this forces rUmb1 staking
        tokenContract
      );

      if (approveResponse?.hash) {
        allowHashCallback(approveResponse);
        return (await web3Provider()).waitForTransaction(approveResponse.hash);
      }

      return Promise.reject();
    }

    return Promise.resolve();
  }

  await approve()
    .then((response) => {
      if (response?.status === TX_FAILED_STATUS) {
        throw Error;
      }
      allowSuccessCallback();
      lock();
    })
    .catch(() => {
      allowErrorCallback();
    });
}

export async function unlockTokens({
  stakingContract,
  claimHashCallback,
  claimSuccessCallback,
  claimSkippedCallback,
  claimErrorCallback,
  unlockingHashCallback,
  unlockingSuccessCallback,
  unlockingErrorCallback,
  params,
  totalRewards,
}) {
  async function unlock() {
    try {
      const response = await callSmartContract(
        stakingContract,
        UNLOCK_TOKENS,
        params
      );

      unlockingHashCallback(response);

      (await web3Provider())
        .waitForTransaction(response.hash)
        .then(({ status }) =>
          status === TX_FAILED_STATUS
            ? unlockingErrorCallback(response)
            : unlockingSuccessCallback(response)
        );
    } catch {
      unlockingErrorCallback(ERROR);
    }
  }

  async function claim() {
    const hasClaimableBalance = ethers.utils
      .parseEther(CLAIMABLE_REWARDS_MINIMUM)
      .lt(totalRewards);

    if (hasClaimableBalance) {
      const response = await callSmartContract(stakingContract, GET_REWARD);

      if (response?.hash) {
        claimHashCallback(response);
        return (await web3Provider()).waitForTransaction(response.hash);
      }

      return Promise.reject();
    }

    claimSkippedCallback();
    return Promise.resolve();
  }

  await claim()
    .then((response) => {
      if (typeof response?.status === "number") {
        if (response.status === TX_FAILED_STATUS) {
          throw Error;
        }

        claimSuccessCallback();
      }

      unlock();
    })
    .catch((e) => {
      console.error(e);
      claimErrorCallback();
    });
}

export const lockupService = {
  bonusToken,
  rewardsToken,
  stakingToken,
  balances,
  earned,
  claim,
  exit,
  locks,
  lockTokens,
  unlockTokens,
};
