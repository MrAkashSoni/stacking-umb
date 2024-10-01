import { BigNumber, ethers } from "ethers";
import { isEmpty, splitAt, map, reverse, splitEvery } from "ramda";
import { toUint256 } from "utils/formatters";
import { chainData, ETH, BSC, ethNetworks, bscNetworks } from "utils/constants";

export function handleTimerUpdate(time, setTimeUpAlert) {
  if (time === "P0H0M0S") {
    setTimeUpAlert(true);
  }
}

export function truncateTokenValue(tokenValue, decimalSize = 2) {
  if (!tokenValue || isEmpty(tokenValue)) {
    return "0." + "0".repeat(decimalSize);
  }

  const formattedTokenValue = ethers.utils.formatEther(tokenValue.toString());
  const [integer, fractional] = formattedTokenValue.split(".");

  const truncatedFractional =
    fractional.length > decimalSize
      ? fractional.slice(0, decimalSize)
      : fractional.padEnd(2, "0");

  const commifiedInteger =
    integer.length > 3
      ? reverse(splitEvery(3, reverse(integer)).join(","))
      : integer;

  return [commifiedInteger, truncatedFractional].join(".");
}

export function formatMonetaryInputValue(
  newValue,
  currentValue,
  maxDecimals = 18
) {
  if (newValue && !isEmpty(newValue)) {
    const integerValidator = /^\d+$/g;
    const decimalValidator = /^\d+\.\d*$/g;

    if (newValue.match(integerValidator)) {
      return newValue;
    }

    if (newValue.match(decimalValidator)) {
      const [integerValue, decimalValue] = newValue.split(".");

      if (decimalValue.length > maxDecimals) {
        return toDecimalString(
          `${integerValue}${splitAt(1, decimalValue).join(".")}`
        );
      }

      return newValue;
    }

    return currentValue;
  } else {
    return "";
  }
}

export function bigNumberFromValue(value) {
  return BigNumber.from(ethers.utils.parseEther(value));
}

export function hasTokenBalance(value, maxAmount) {
  return !bigNumberFromValue(value).gt(maxAmount);
}

export function isNotZero(value) {
  return !(value && bigNumberFromValue(value).isZero());
}

export function toDecimalString(value, decimals = 18) {
  const uint256Value = toUint256(value).padStart(18, "0");
  const splitValue = splitAt(decimals * -1, uint256Value);

  const removeEmptyValues = (value) => (isEmpty(value) ? "0" : `${value}`);

  return map(removeEmptyValues, splitValue).join(".");
}

export function hasTrustedForever(allowance) {
  const referenceAmount = BigNumber.from(
    toUint256("140282366920938463463374607431768211455")
  );

  return allowance.gt(referenceAmount);
}

export function verifyCurrentAllowance(amountToStake, currentAllowance) {
  return BigNumber.from(amountToStake).gt(currentAllowance);
}

export function bigNumberToFloat(bigNumber) {
  const [integer, decimal] = splitAt(-18, bigNumber.toString());
  const [parsedDecimal] = splitAt(4, decimal);

  return parseFloat([integer, parsedDecimal].join("."));
}

export function calculateTokenRatio({ tokenReserves, tokenTotalSupply }) {
  const [pooledTokenReserve] = tokenReserves;

  return (
    bigNumberToFloat(pooledTokenReserve) / bigNumberToFloat(tokenTotalSupply)
  );
}

export function networkMatchesChain(networkId, chain) {
  switch (chain) {
    case ETH:
      return ethNetworks.includes(String(networkId));
    case BSC:
      return bscNetworks.includes(String(networkId));
    default:
      return;
  }
}

export function getChainFromNetworkId(networkId) {
  return chainData[networkId]?.networkSymbol;
}

export const getTotalLockedFromLocks = (locks) => {
  const lockedLocks = locks.filter(({ hasUnlocked }) => !hasUnlocked);

  const totalLocked = lockedLocks.reduce(
    (acc, currentLock) => acc.add(currentLock.amount),
    ethers.constants.Zero
  );

  return totalLocked;
};
