import { V2_CONTRACTS } from "utils/constants";

import {
  last,
  filter,
  either,
  isNil,
  isEmpty,
  not,
  map,
  prop,
  compose,
} from "ramda";

import { BigNumber, ethers, FixedNumber, utils } from "ethers";

import { $1E6, DAYS_IN_A_YEAR } from "utils/constants";
import { bigNumberToFloat } from "utils";

import { SECONDS_IN_A_DAY } from "utils/constants";

export function toUint256(value) {
  return BigNumber.isBigNumber(value)
    ? value.toString()
    : utils.parseEther(value).toString();
}

export const notEmpty = compose(not, either(isNil, isEmpty));

export function calcDailySupply({ totalSupply, swappedSoFar, swapDuration }) {
  const totalTokens = totalSupply.add(swappedSoFar);
  const tokensBySecond = totalTokens.div(swapDuration);

  return tokensBySecond.mul(SECONDS_IN_A_DAY);
}

const multiplierToFloat = (multiplier) => parseFloat(`${multiplier}`) / $1E6;

export function multiplyBigNumberByFloat(bigNumber, float) {
  const fixedBigNumber = FixedNumber.from(ethers.utils.formatEther(bigNumber));
  const fixedFloat = FixedNumber.from(float.toString());

  const result = fixedBigNumber.mulUnsafe(fixedFloat);

  return BigNumber.from(result);
}

const calculateV2AnnualReward = ({
  dailyAvailable,
  totalStakingBalance,
  totalSupply,
}) => {
  const stakingTokenPercetage = totalStakingBalance / totalSupply;
  const rewardRatio = dailyAvailable / totalSupply;
  const tokenRatio = stakingTokenPercetage * rewardRatio;
  const annualReward = tokenRatio * DAYS_IN_A_YEAR * 100;

  return annualReward;
};

const calculateV2AnnualRewardWithMultiplier = ({
  dailyAvailable,
  bonusTokenBalance,
  totalBonus,
  multiplier,
  totalSupply,
}) => {
  const bonusPercetage = (bonusTokenBalance + totalBonus) / totalSupply;
  const rewardPercetage = bonusTokenBalance / totalSupply;

  const bonusRatio = bonusPercetage / rewardPercetage;
  const distribution = dailyAvailable / totalSupply;
  const rewardBonusRatio = bonusPercetage * distribution;
  const averageRatio = rewardBonusRatio * bonusRatio;

  const averageAnnualReward = averageRatio * DAYS_IN_A_YEAR * 100;

  const annualReward = (averageAnnualReward * multiplier) / bonusRatio;

  return annualReward;
};

const calculateV1AnnualReward = ({ bonusTokenBalance, dailyAvailable }) => {
  const tokenRatio = dailyAvailable / bonusTokenBalance;

  return tokenRatio * DAYS_IN_A_YEAR * 100;
};

export const calcAnnualReward = ({
  dailyAvailable,
  totalStakingBalance,
  bonusTokenBalance,
  totalBonus,
  multiplier,
  stakingContract,
}) => {
  const isV2 = V2_CONTRACTS.includes(stakingContract);

  if (isV2) {
    const balances = [totalStakingBalance, bonusTokenBalance, totalBonus];
    const hasAllBalances = !balances.some((balance) => !balance?.gt(0));
    const totalSupply = totalStakingBalance
      .add(bonusTokenBalance)
      .add(totalBonus);

    if (hasAllBalances) {
      return multiplier
        ? calculateV2AnnualRewardWithMultiplier({
            dailyAvailable,
            bonusTokenBalance: bigNumberToFloat(bonusTokenBalance),
            totalBonus: bigNumberToFloat(totalBonus),
            totalSupply: bigNumberToFloat(totalSupply),
            multiplier: multiplierToFloat(multiplier),
          })
        : calculateV2AnnualReward({
            dailyAvailable,
            totalStakingBalance: bigNumberToFloat(totalStakingBalance),
            totalSupply: bigNumberToFloat(totalSupply),
          });
    }
  } else {
    const hasBalance = bonusTokenBalance?.gt(0);

    if (hasBalance) {
      return calculateV1AnnualReward({
        bonusTokenBalance: bigNumberToFloat(bonusTokenBalance),
        dailyAvailable,
      });
    }
  }

  return 0.0;
};

export const takeLastPropFromObjects = (objects, propName) =>
  last(filter(notEmpty, map(prop(propName), objects)));

export const readableMultiplier = (multiplier) =>
  (multiplier / $1E6).toFixed(1);
