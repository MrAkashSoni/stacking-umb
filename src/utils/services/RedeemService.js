import { ABI } from "./ABI";
import { readContract, writeContract } from "./Providers";

import { REWARDS } from "utils/constants";
import { collect } from "../contract/handleContractCall";

const CAN_SWAP_TOKENS = "CAN_SWAP_TOKENS";
const IS_SWAP_STARTED = "IS_SWAP_STARTED";
const SWAP_DURATION = "SWAP_DURATION";
const SWAP_FOR = "SWAP_FOR";
const SWAP_STARTS_ON = "SWAP_STARTS_ON";
const SWAPPED_SO_FAR = "SWAPPED_SO_FAR";
const TOTAL_SUPPLY = "TOTAL_SUPPLY";
const TOTAL_UNLOCKED_AMOUNT_OF_TOKEN = "TOTAL_UNLOCKED_AMOUNT_OF_TOKEN";

const methods = {
  [CAN_SWAP_TOKENS]: {
    method: "canSwapTokens",
    isWriteOperation: false,
  },
  [IS_SWAP_STARTED]: {
    method: "isSwapStarted",
    isWriteOperation: false,
  },
  [SWAP_DURATION]: {
    method: "swapDuration",
    isWriteOperation: false,
  },
  [SWAP_FOR]: {
    method: "swapFor",
    isWriteOperation: true,
  },
  [SWAP_STARTS_ON]: {
    method: "swapStartsOn",
    isWriteOperation: false,
  },
  [SWAPPED_SO_FAR]: {
    method: "swappedSoFar",
    isWriteOperation: false,
  },
  [TOTAL_SUPPLY]: {
    method: "totalSupply",
    isWriteOperation: false,
  },
  [TOTAL_UNLOCKED_AMOUNT_OF_TOKEN]: {
    method: "totalUnlockedAmountOfToken",
    isWriteOperation: false,
  },
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
    const { method, isWriteOperation } = methods[contractMethod];

    const contract = await getContract(
      contractAddress,
      ABI[REWARDS],
      isWriteOperation
    );

    return contract[method](params);
  } catch (e) {
    console.log(contractMethod, e);
  }
};

const isSwapStarted = async (contractAddress) => {
  return callSmartContract(contractAddress, IS_SWAP_STARTED);
};

const totalSupply = async (contractAddress) => {
  return callSmartContract(contractAddress, TOTAL_SUPPLY);
};

const swappedSoFar = async (contractAddress) => {
  return callSmartContract(contractAddress, SWAPPED_SO_FAR);
};

const totalUnlockedAmountOfToken = async (contractAddress) => {
  return callSmartContract(contractAddress, TOTAL_UNLOCKED_AMOUNT_OF_TOKEN);
};

const canSwapTokens = async (contractAddress, params) => {
  return callSmartContract(contractAddress, CAN_SWAP_TOKENS, params);
};

const swapFor = async (contractAddress, params) => {
  return callSmartContract(contractAddress, SWAP_FOR, params);
};

const swapStartsOn = async (contractAddress) => {
  return callSmartContract(contractAddress, SWAP_STARTS_ON);
};

const swapDuration = async (contractAddress) => {
  return callSmartContract(contractAddress, SWAP_DURATION);
};

function getRedeemInfo({
  tokenAddress,
  successCallback,
  rejectCallback,
  userAddress,
}) {
  const operations = [
    {
      key: "isSwapStarted",
      noArgs: true,
      ...methods[IS_SWAP_STARTED],
    },
    {
      key: "canSwapTokens",
      contractParams: [userAddress],
      ...methods[CAN_SWAP_TOKENS],
    },
  ];

  collect({
    operations,
    contractAddress: tokenAddress,
    successCallback,
    rejectCallback,
    ABI: ABI[REWARDS],
  });
}

export const redeemService = {
  canSwapTokens,
  isSwapStarted,
  swapStartsOn,
  swapFor,
  swappedSoFar,
  totalUnlockedAmountOfToken,
  totalSupply,
  swapDuration,
  getRedeemInfo,
};
