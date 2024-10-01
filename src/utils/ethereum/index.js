const maxRetriesForBsc = 5;
const bscWaitTime = 500;

const isBsc = window.localStorage.getItem("connectorId") === "bsc";

async function waitUntilBscIsInjectedToWindow(failedCallback) {
  for (let retries = 0; ; retries++) {
    const shouldBreak = retries >= maxRetriesForBsc;

    if (!window.BinanceChain && shouldBreak) {
      failedCallback();
      break;
    } else {
      const provider = await detectProvider();

      if (provider) break;
    }

    if (shouldBreak) break;
  }
}

const detectProvider = () =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve(
          isBsc && window.BinanceChain ? window.BinanceChain : window.ethereum
        ),
      bscWaitTime
    )
  );

export const Ethereum = async (failedCallback = () => {}) => {
  if (isBsc && !window.BinanceChain) {
    waitUntilBscIsInjectedToWindow(failedCallback);
  }

  const provider = await detectProvider();

  return provider;
};
