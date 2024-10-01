import { ethers } from "ethers";
import { Ethereum } from "utils/Ethereum";

export const provider = async () =>
  new ethers.providers.Web3Provider(await Ethereum());

export const signer = async () => (await provider()).getSigner();

export const readContract = async (address, ABI) => {
  return new ethers.Contract(address, ABI, await provider());
};

export const writeContract = async (address, ABI) => {
  return new ethers.Contract(address, ABI, await signer());
};

export default provider;
