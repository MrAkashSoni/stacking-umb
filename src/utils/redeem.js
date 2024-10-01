import { REDEEM_DAILY_CAP } from "utils/constants";

import { isSameDay } from "date-fns";
import { isLessThanOrEqual, subtractFrom } from "./BigNumber";

export const defaultRedeemStoredData = () => ({
  availableQuota: REDEEM_DAILY_CAP,
  timestamp: Date.now(),
  txsQueue: [],
});

export const validateRedeemStoredData = (storedData) =>
  storedData &&
  isSameDay(storedData.timestamp, Date.now()) &&
  isLessThanOrEqual(storedData.availableQuota, REDEEM_DAILY_CAP);

export const setRedeemStoredData = (callback) => {
  const storedData = defaultRedeemStoredData();

  callback(storedData);
};

export const addTxToRedeemStoredData = (
  storedData,
  txData,
  callback = () => {}
) => {
  const updatedData = {
    ...storedData,
    txsQueue: [...storedData.txsQueue, txData],
  };

  callback(updatedData);
};

export const computeRedeemStoredDataTxsQueue = (storedData, callback) => {
  const updatedAvailableQuota = storedData.txsQueue.reduce(
    (acc, { amount }) => subtractFrom(acc, amount),
    storedData.availableQuota
  );

  const updatedData = {
    ...storedData,
    availableQuota: updatedAvailableQuota,
    txsQueue: [],
  };

  callback(updatedData);
};

export const loadRedeemStoredData = async (storedData, callback) => {
  const isUserDataValid = validateRedeemStoredData(storedData);

  if (!isUserDataValid) {
    setRedeemStoredData(callback);
    return;
  }

  computeRedeemStoredDataTxsQueue(storedData, callback);
};
