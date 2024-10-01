import { useMemo } from "react";
import { useAccount, useProvider, useSigner } from "wagmi";

export const useProviderOrSigner = (withSignerIfPossible = true) => {
  const provider = useProvider();
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();

  return useMemo(
    () =>
      withSignerIfPossible && address && isConnected && signer
        ? signer
        : provider,
    [address, isConnected, provider, signer, withSignerIfPossible]
  );
};
