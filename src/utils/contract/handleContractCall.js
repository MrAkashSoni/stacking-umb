import { TX_FAILED_STATUS } from "../constants";
import provider, { readContract, writeContract } from "./provider";

async function handleContractCall({
  method,
  overrides = {},
  contractParams = [],
  isWriteOperation,
  ABI,
  contractAddress,
  successCallback,
  rejectCallback,
  shouldWaitForChain = false,
  setTransaction = () => {},
  chainedCallback = () => {},
}) {
  const hasSuccessCallback = typeof successCallback === "function";
  const hasRejectCallback = typeof rejectCallback === "function";

  try {
    const contract = isWriteOperation
      ? await writeContract(contractAddress, ABI)
      : await readContract(contractAddress, ABI);

    if (shouldWaitForChain) {
      const response = await contract[method](...contractParams, overrides);
      setTransaction({ response, method });

      (await provider())
        .waitForTransaction(response.hash)
        .then(({ status }) => {
          if (status === TX_FAILED_STATUS) {
            throw Error;
          }

          hasSuccessCallback && successCallback(response);
          chainedCallback();
        })
        .catch((e) => {
          console.warn(method, contractAddress, e);
          rejectCallback(e);
        });
    } else {
      const response = await contract[method](
        ...contractParams,
        overrides
      ).then((promise) =>
        hasSuccessCallback ? successCallback(promise) : promise
      );

      return response;
    }
  } catch (e) {
    console.warn(method, contractAddress, e);

    hasRejectCallback && rejectCallback(e);

    return e;
  }
}

export async function collect({
  operations,
  ABI,
  contractAddress,
  successCallback,
  rejectCallback,
}) {
  const hasSuccessCallback = typeof successCallback === "function";
  const hasRejectCallback = typeof rejectCallback === "function";

  const promises = operations.map((operation) => {
    return new Promise((resolve, reject) =>
      handleContractCall({
        successCallback: resolve,
        rejectCallback: reject,
        ABI,
        contractParams: operation.noArgs ? [] : operation.contractParams,
        contractAddress,
        ...operation,
      })
    );
  });

  Promise.all(promises)
    .then((results) => {
      const collectResult = new Map(
        results.map((result, index) => {
          return [operations[index].key, result];
        })
      );

      const entries = Object.fromEntries(collectResult);
      hasSuccessCallback && successCallback(entries);

      return entries;
    })
    .catch((error) => {
      console.error(operations, error);

      hasRejectCallback && rejectCallback(error);
      return error;
    });
}
