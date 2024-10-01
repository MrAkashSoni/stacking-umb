import { UmbToken, Uniswap, Pancakeswap, UmbTokenAlt } from "assets/images";

import { UMB, UNISWAP, PANCAKESWAP, RUMB1 } from "utils/constants";

export function currencyIcons(contractName) {
  switch (contractName) {
    case UMB:
      return UmbToken;
    case RUMB1:
      return UmbTokenAlt;
    case UNISWAP:
      return Uniswap;
    case PANCAKESWAP:
      return Pancakeswap;
    default:
      return UmbToken;
  }
}
