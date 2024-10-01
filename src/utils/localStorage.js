import { web3ToStorageTransaction } from "utils/formatters";

export function getStorageItem(key) {
  const data = window.localStorage.getItem(key);
  return JSON.parse(data);
}

export function setStorageItem(key, value) {
  const data = JSON.stringify(value);
  window.localStorage.setItem(key, data);
}

export function removeStorageItem(key) {
  window.localStorage.removeItem(key);
}

export function pushTxIntoLocalStorage({
  method,
  txData,
  chainId,
  stakingContractSymbol,
}) {
  const storedTransactions =
    JSON.parse(localStorage.getItem("transactions")) ?? [];

  localStorage.setItem(
    "transactions",
    JSON.stringify([
      {
        ...web3ToStorageTransaction(txData, method),
        chainId,
        stakingContractSymbol,
      },
      ...storedTransactions,
    ])
  );
}
