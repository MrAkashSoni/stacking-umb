import { BigNumber } from "ethers";

export function isLessThanOrEqual(number, reference) {
  const referenceBN = BigNumber.from(reference);

  return BigNumber.from(number).lte(referenceBN);
}

export function subtractFrom(minuend, subtrahend) {
  const subtrahendBN = BigNumber.from(subtrahend);

  return BigNumber.from(minuend).sub(subtrahendBN).toString();
}
