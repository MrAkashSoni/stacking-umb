import { useEffect, useState, useRef, useMemo } from "react";

import { web3Provider } from "utils/services";

import { useWallet } from "utils/store/Wallet";

export function useNewBlockListener(callback = () => {}) {
  const [shouldCallback, setShouldCallback] = useState(false);
  const { address, isConnectedProperly } = useWallet();

  const shouldRefreshOnNewBlock = useMemo(() => {
    return !shouldCallback;
  }, [shouldCallback]);

  const stateRef = useRef();
  stateRef.current = shouldRefreshOnNewBlock;

  useEffect(() => {
    if (shouldCallback) {
      setShouldCallback(false);
    }
  }, [shouldCallback]);

  useEffect(() => {
    async function setBlockListener() {
      const web3ProviderInstance = await web3Provider();
      web3ProviderInstance.on("block", function (e) {
        const shouldRefresh = stateRef.current;
        if (shouldRefresh) {
          setShouldCallback(true);
          callback();
        }
      });
    }

    if (address && isConnectedProperly) {
      setBlockListener();
    }

    /* eslint-disable-next-line */
  }, [address, isConnectedProperly]);

  return shouldCallback;
}
