import { ethers } from "ethers";
import { Ethereum } from "utils";

export const web3Provider = async () =>
  new ethers.providers.Web3Provider(await Ethereum());

export const signer = async () => (await web3Provider()).getSigner();

export const readContract = async (address, ABI) => {
  return new ethers.Contract(address, ABI, await web3Provider());
};

export const writeContract = async (address, ABI) => {
  return new ethers.Contract(address, ABI, await signer());
};
