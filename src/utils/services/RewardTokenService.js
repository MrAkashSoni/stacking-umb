import { ABI } from "./ABI";
import { readContract, writeContract } from "./Providers";

import {
  STAKING,
  REWARDS,
  STAKING_V2,
  V2_CONTRACTS,
  V3_CONTRACTS,
  STAKING_V3,
} from "utils/constants";

const TOKEN_BALANCE = "TOKEN_BALANCE";
const TOKEN_SYMBOL = "TOKEN_SYMBOL";
const TOKEN_NAME = "TOKEN_NAME";

// TODO: remove once v1 is deprecated
export async function fetchRewardContractAddress(stakingAddress) {
  try {
    const isV2 = V2_CONTRACTS.includes(stakingAddress);
    const isV3 = V3_CONTRACTS.includes(stakingAddress);

    let contractABI;

    if (isV2) {
      contractABI = ABI[STAKING_V2];
    } else if (isV3) {
      contractABI = ABI[STAKING_V3];
    } else {
      contractABI = ABI[STAKING];
    }

    const stakingContract = await readContract(stakingAddress, contractABI);

    const address = isV2
      ? stakingContract.rUmb2()
      : stakingContract.rewardsToken();

    return address;
  } catch (error) {
    console.log(error);
  }
}

async function callback(
  contractOperation,
  successCallback,
  rejectCallback,
  contractParams = [],
  stakingContract,
  contract
) {
  const hasSuccessCallback = typeof successCallback === "function";
  const hasErrorRejectCallback = typeof rejectCallback === "function";

  try {
    const { type, method } = contractOperation;

    const tokenAddress = await fetchRewardContractAddress(stakingContract);

    const contract_ =
      contract ??
      (type === "read"
        ? await readContract(tokenAddress, ABI[REWARDS])
        : await writeContract(tokenAddress, ABI[REWARDS]));

    const response = await contract_[method](...contractParams).then(
      (promise) => (hasSuccessCallback ? successCallback(promise) : promise)
    );

    return response;
  } catch (e) {
    console.error(contractOperation, e);

    hasErrorRejectCallback && rejectCallback(e);

    return e;
  }
}

async function collect(
  operations,
  successCallback,
  rejectCallback,
  methodParams,
  stakingContract,
  contract
) {
  const promises = operations.map(({ contractMethod, usesParams }) => {
    return new Promise((resolve, reject) =>
      callback(
        contractMethod,
        resolve,
        reject,
        usesParams ? methodParams : [],
        stakingContract,
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

const contractMethods = {
  TOKEN_BALANCE: {
    method: "balanceOf",
    type: "read",
  },
  TOKEN_SYMBOL: {
    method: "symbol",
    type: "read",
  },
  TOKEN_NAME: {
    method: "name",
    type: "read",
  },
};

export async function getRewardsTokenInfo(
  successCallback,
  rejectCallback,
  methodParams,
  stakingContract,
  contract
) {
  collect(
    [
      { key: "symbol", contractMethod: contractMethods[TOKEN_SYMBOL] },
      { key: "name", contractMethod: contractMethods[TOKEN_NAME] },
    ],
    successCallback,
    rejectCallback,
    methodParams,
    stakingContract,
    contract
  );
}

export async function getRewardsTokenBalance(
  successCallback,
  rejectCallback,
  methodParams,
  stakingContract,
  contract
) {
  callback(
    contractMethods[TOKEN_BALANCE],
    successCallback,
    rejectCallback,
    methodParams,
    stakingContract
  );
}
