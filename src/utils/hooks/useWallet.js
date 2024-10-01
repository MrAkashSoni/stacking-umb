import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";

export function useWallet() {
  const { chain } = useNetwork();
  const { address, connector, isConnected, isConnecting } = useAccount();

  const [isUnavailableModalOpen, setIsUnavailableModalOpen] = useState(false);

  useEffect(() => {
    if (isConnected && chain?.unsupported) {
      setIsUnavailableModalOpen(true);
    }
  }, [isConnected]);

  return {
    chainId: chain?.id,
    address,
    isConnected,
    isConnecting,
    chain,
    connector,
    isUnavailableModalOpen,
    toggleUnavailableModal: () => setIsUnavailableModalOpen((state) => !state),
  };
}
