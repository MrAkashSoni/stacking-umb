import { WAITING, ERROR, SUCCESS } from "utils/constants";

export const initialSteps = [];

export const RESET = "RESET";

export const WITHDRAW_REQUESTED = "WITHDRAW_REQUESTED";
export const WITHDRAW_HASH_SET = "WITHDRAW_HASH_SET";
export const WITHDRAW_SUCCESS = "WITHDRAW_SUCCESS";
export const WITHDRAW_ERROR = "WITHDRAW_ERROR";

export const RESTAKE_WITHDRAW_REQUESTED = "RESTAKE_WITHDRAW_REQUESTED";
export const RESTAKE_WITHDRAW_HASH_SET = "RESTAKE_WITHDRAW_HASH_SET";
export const RESTAKE_WITHDRAW_SUCCESS = "RESTAKE_WITHDRAW_SUCCESS";
export const RESTAKE_WITHDRAW_FAILED = "RESTAKE_WITHDRAW_FAILED";

export const RESTAKE_ALLOWANCE_SUCCESSFULL = "RESTAKE_ALLOWANCE_SUCCESSFULL";
export const RESTAKE_ALLOWANCE_ERROR = "RESTAKE_ALLOWANCE_ERROR";

export const RESTAKE_STAKING_HASH_SET = "RESTAKE_STAKING_HASH_SET";
export const RESTAKE_STAKING_SUCCESSFULL = "RESTAKE_STAKING_SUCCESSFULL";
export const RESTAKE_STAKING_ERROR = "RESTAKE_STAKING_ERROR";

export function reducer(state, action) {
  switch (action.type) {
    case RESET:
      return [];
    case WITHDRAW_REQUESTED:
      return [
        {
          type: "blockchain",
          label: "Withdraw",
          status: undefined,
          hash: undefined,
        },
        {
          type: "wallet",
          label: "Withdraw Successful",
          status: undefined,
        },
      ];
    case WITHDRAW_HASH_SET:
      return [
        {
          type: "blockchain",
          label: "Withdraw",
          status: WAITING,
          hash: action.payload,
        },
        {
          type: "wallet",
          label: "Withdraw Successful",
          status: undefined,
        },
      ];
    case WITHDRAW_SUCCESS:
      return [
        { ...state[0], status: SUCCESS },
        {
          type: "wallet",
          label: "Withdraw Successful",
          status: SUCCESS,
        },
      ];
    case WITHDRAW_ERROR:
      return [
        {
          ...state[0],
          status: ERROR,
        },
        {
          type: "wallet",
          label: "Withdraw Successful",
          status: undefined,
        },
      ];
    case RESTAKE_WITHDRAW_REQUESTED:
      return [
        {
          type: "blockchain",
          label: "Withdraw",
          status: undefined,
        },
        {
          type: "wallet",
          label: "Allowance",
          status: undefined,
        },
        {
          type: "blockchain",
          label: "Stake",
          status: undefined,
        },
      ];
    case RESTAKE_WITHDRAW_HASH_SET:
      return [
        {
          type: "blockchain",
          label: "Withdraw",
          status: WAITING,
          hash: action.payload,
        },
        {
          type: "wallet",
          label: "Allowance",
          status: undefined,
        },
        {
          type: "blockchain",
          label: "Stake",
          status: undefined,
        },
      ];
    case RESTAKE_WITHDRAW_SUCCESS:
      return [
        {
          type: "blockchain",
          label: "Withdraw",
          status: SUCCESS,
          hash: state[0].hash,
        },
        {
          type: "wallet",
          label: "Allowance",
          status: WAITING,
        },
        {
          type: "blockchain",
          label: "Stake",
          status: undefined,
        },
      ];
    case RESTAKE_WITHDRAW_FAILED:
      return [
        {
          type: "blockchain",
          label: "Withdraw",
          status: ERROR,
          hash: state[0].hash,
        },
        {
          type: "wallet",
          label: "Allowance",
          status: undefined,
        },
        {
          type: "blockchain",
          label: "Stake",
          status: undefined,
        },
      ];
    case RESTAKE_ALLOWANCE_SUCCESSFULL:
      return [
        { ...state[0], status: SUCCESS },
        {
          type: "wallet",
          label: "Allowance",
          status: SUCCESS,
        },
        {
          type: "blockchain",
          label: "Stake",
          status: undefined,
        },
      ];
    case RESTAKE_ALLOWANCE_ERROR:
      return [
        state[0],
        {
          type: "wallet",
          label: "Allowance",
          status: ERROR,
        },
        {
          type: "blockchain",
          label: "Stake",
          status: undefined,
        },
      ];
    case RESTAKE_STAKING_HASH_SET:
      return [
        { ...state[0], status: SUCCESS },
        { ...state[1], status: SUCCESS },
        {
          type: "blockchain",
          label: "Stake",
          status: WAITING,
          hash: action.payload,
        },
      ];
    case RESTAKE_STAKING_SUCCESSFULL:
      return [
        { ...state[0], status: SUCCESS },
        { ...state[1], status: SUCCESS },
        {
          type: "blockchain",
          label: "Stake",
          status: SUCCESS,
          hash: state[2].hash,
        },
      ];
    case RESTAKE_STAKING_ERROR:
      return [
        state[0],
        state[1],
        {
          type: "blockchain",
          label: "Stake",
          status: ERROR,
          hash: state[2].hash,
        },
      ];
    default:
      return state;
  }
}
