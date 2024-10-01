import { Contract } from "ethers";
import { useProviderOrSigner } from "./useProviderOrSigner";

import { ABI } from "utils/services/ABI";
import { useMemo } from "react";
import { provider } from "MainContent";

export const getContract = ({ abi, address, chainId = 1, signer }) => {
  const signerOrProvider = signer ?? provider({ chainId });

  return new Contract(address, abi, signerOrProvider);
};

export const getBep20Contract = (address, signer) => {
  return getContract({ abi: ABI.umb, address, signer });
};

export const getRUMB2Contract = (address, signer) => {
  return getContract({ abi: ABI.rewards2, address, signer });
};

export const getStakingV2Contract = (address, signer) => {
  return getContract({ abi: ABI.staking_v2, address, signer });
};

export const useERC20 = (address) => {
  const providerOrSigner = useProviderOrSigner();
  return useMemo(
    () => (address ? getBep20Contract(address, providerOrSigner) : undefined),
    [address, providerOrSigner]
  );
};

export const useRUMB2 = (address) => {
  const providerOrSigner = useProviderOrSigner();
  return useMemo(
    () => (address ? getRUMB2Contract(address, providerOrSigner) : undefined),
    [address, providerOrSigner]
  );
};

export const useStakingV2 = (address) => {
  const providerOrSigner = useProviderOrSigner();
  return useMemo(
    () =>
      address ? getStakingV2Contract(address, providerOrSigner) : undefined,
    [address, providerOrSigner]
  );
};
