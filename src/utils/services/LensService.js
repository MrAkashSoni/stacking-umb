import { ABI } from "./ABI";
import { LENS } from "utils/constants";
import { readContract } from "./Providers";

const GET_ACTIVE_LOCK_IDS = "getActiveLockIds";
const GET_PERIODS_AND_MULTIPLIERS = "getPeriodsAndMultipliers";
const GET_VESTED_LOCK_IDS = "getVestedLockIds";

const callSmartContract = async (
  contractAddress,
  contractMethod,
  params = []
) => {
  const contract = await readContract(contractAddress, ABI[LENS]);

  return contract[contractMethod](...params);
};

const getActiveLockIds = ({ contractAddress, params }) =>
  callSmartContract(contractAddress, GET_ACTIVE_LOCK_IDS, [...params, 0]);

const getPeriodsAndMultipliers = ({ contractAddress, params }) =>
  callSmartContract(contractAddress, GET_PERIODS_AND_MULTIPLIERS, params);

const getVestedLockIds = ({ contractAddress, params }) =>
  callSmartContract(contractAddress, GET_VESTED_LOCK_IDS, [...params, 0]);

export const lensService = {
  getActiveLockIds,
  getPeriodsAndMultipliers,
  getVestedLockIds,
};
