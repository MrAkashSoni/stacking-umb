import { ABI } from "./ABI";
import { readContract, writeContract } from "./Providers";

import {
  STAKING,
  STAKING_V2,
  V2_CONTRACTS,
  LP,
  UMB,
  V3_CONTRACTS,
  STAKING_V3,
} from "utils/constants";

import { toUint256 } from "utils/formatters";

import { verifyCurrentAllowance, hasTrustedForever } from "utils";

const SYMBOL = "SYMBOL";
const TOKEN_BALANCE = "TOKEN_BALANCE";
const GET_TOKEN_ALLOWANCE = "GET_TOKEN_ALLOWANCE";
const SET_TOKEN_ALLOWANCE = "SET_TOKEN_ALLOWANCE";
const TOKEN_TOTAL_SUPPLY = "TOKEN_TOTAL_SUPPLY";
const LP_GET_RESERVES = "LP_GET_RESERVES";

// TODO: remove once v1 is deprecated
export async function fetchContractAddress(stakingAddress) {
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
      ? stakingContract.umb()
      : stakingContract.stakingToken();

    return address;
  } catch (error) {
    console.error(error);

    return error;
  }
}

async function callback(
  contractOperation,
  successCallback,
  rejectCallback,
  contractParams = [],
  stakingContract,
  isLiquidityPoolStream = false,
  contractAddress,
  contract
) {
  const hasSuccessCallback = typeof successCallback === "function";
  const hasErrorRejectCallback = typeof rejectCallback === "function";

  try {
    const { type, method } = contractOperation;

    const isWriteOperation = type === "write";

    let contract_;

    if (contract) {
      contract_ = contract;
    } else {
      const tokenAddress =
        contractAddress ?? (await fetchContractAddress(stakingContract));
      const contractABI = ABI[isLiquidityPoolStream ? LP : UMB];

      contract_ = isWriteOperation
        ? await writeContract(tokenAddress, contractABI)
        : await readContract(tokenAddress, contractABI);
    }

    const gasLimit =
      isWriteOperation &&
      (await contract_.estimateGas[method](...contractParams));

    const overrides = isWriteOperation ? { gasLimit: gasLimit.toNumber() } : {};

    const response = await contract_[method](...contractParams, overrides).then(
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
  isLiquidityPoolStream
) {
  const promises = operations.map(({ contractMethod, usesParams }) => {
    return new Promise((resolve, reject) =>
      callback(
        contractMethod,
        resolve,
        reject,
        usesParams ? methodParams : [],
        stakingContract,
        isLiquidityPoolStream
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
  SYMBOL: {
    method: "symbol",
    type: "read",
  },
  TOKEN_BALANCE: {
    method: "balanceOf",
    type: "read",
  },
  GET_TOKEN_ALLOWANCE: {
    method: "allowance",
    type: "read",
  },
  SET_TOKEN_ALLOWANCE: {
    method: "approve",
    type: "write",
  },
  TOKEN_TOTAL_SUPPLY: {
    method: "totalSupply",
    type: "read",
  },
  LP_GET_RESERVES: {
    method: "getReserves",
    type: "read",
  },
};

export async function getTokenBalance(
  successCallback,
  rejectCallback,
  methodParams,
  stakingContract,
  contractAddress
) {
  callback(
    contractMethods[TOKEN_BALANCE],
    successCallback,
    rejectCallback,
    methodParams,
    stakingContract,
    false,
    contractAddress
  );
}

export async function getTokenAllowance(
  successCallback,
  rejectCallback,
  methodParams,
  stakingContract,
  contractAddress,
  contract
) {
  return callback(
    contractMethods[GET_TOKEN_ALLOWANCE],
    successCallback,
    rejectCallback,
    methodParams,
    stakingContract,
    false,
    contractAddress,
    contract
  );
}

export async function setTokenAllowance(
  successCallback,
  rejectCallback,
  methodParams,
  stakingContract,
  contractAddress
) {
  return callback(
    contractMethods[SET_TOKEN_ALLOWANCE],
    successCallback,
    rejectCallback,
    methodParams,
    stakingContract,
    false,
    contractAddress
  );
}

export async function getTokenRatio(
  successCallback,
  rejectCallback,
  methodParams,
  stakingContract
) {
  collect(
    [
      {
        key: "tokenReserves",
        contractMethod: contractMethods[LP_GET_RESERVES],
      },
      {
        key: "tokenTotalSupply",
        contractMethod: contractMethods[TOKEN_TOTAL_SUPPLY],
      },
    ],
    successCallback,
    rejectCallback,
    methodParams,
    stakingContract,
    true
  );
}

export async function getTokenSymbol(
  successCallback,
  rejectCallback,
  methodParams,
  stakingContract,
  contractAddress
) {
  return callback(
    contractMethods[SYMBOL],
    successCallback,
    rejectCallback,
    methodParams,
    stakingContract,
    false,
    contractAddress
  );
}

export async function collectFromContracts(
  contractFunction,
  successCallback,
  rejectCallback = console.error,
  addresses,
  property,
  methodParams = []
) {
  const promises = addresses.map(
    (tokenContract) =>
      new Promise((resolve, reject) =>
        contractFunction(
          (result) => resolve({ tokenContract, [property]: result }),
          reject,
          methodParams,
          undefined,
          tokenContract
        )
      )
  );

  Promise.all(promises)
    .then((results) => {
      successCallback(results);
    })
    .catch((error) => {
      console.error(error);

      rejectCallback(error);
    });
}

export async function collectSymbols(
  successCallback,
  addresses,
  rejectCallback = console.error
) {
  collectFromContracts(
    getTokenSymbol,
    successCallback,
    rejectCallback,
    addresses,
    "tokenSymbol"
  );
}

export async function collectBalances(
  successCallback,
  addresses,
  methodParams,
  rejectCallback = console.error
) {
  collectFromContracts(
    getTokenBalance,
    successCallback,
    rejectCallback,
    addresses,
    "tokenBalance",
    methodParams
  );
}

export async function needsAllowance({
  userAddress,
  stakingContract,
  value,
  contractAddress,
}) {
  const alreadyAllowed = await getTokenAllowance(
    undefined,
    undefined,
    [userAddress, stakingContract],
    stakingContract,
    contractAddress
  );

  const stakedAmount = toUint256(value);

  return (
    verifyCurrentAllowance(stakedAmount, alreadyAllowed) &&
    !hasTrustedForever(alreadyAllowed)
  );
}
