import { EthNode, BscNode } from "assets/images";

import { ETH, BSC } from "utils/constants";

export function nodeIcons(contractName) {
  switch (contractName) {
    case ETH:
      return EthNode;
    case BSC:
      return BscNode;
    default:
      return EthNode;
  }
}
