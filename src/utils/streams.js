import { contracts } from "utils/constants";

export function fetchSistemStreams({ chain, symbol }) {
  const { address } = contracts[symbol].options[chain];

  return Object.entries(contracts).flatMap(
    ([contractSymbol, { name, options }]) => {
      const isSameStream = contractSymbol === symbol;
      const isSameAddress = options[chain].address === address;

      return !isSameStream && isSameAddress ? [name] : [];
    }
  );
}
