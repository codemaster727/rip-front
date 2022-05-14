import BigNumber from "bignumber.js";
import {
  DeserializedCakeVault,
  DeserializedPool,
  // SerializedBigNumber,
  SerializedCakeVault,
  SerializedFarm,
  SerializedPool,
} from "src/slices/types";
import { deserializeToken } from "src/slices/user/hooks/helpers";
import { BIG_ZERO } from "src/utils/bigNumber";
import { convertSharesToCake } from "src/views/Pools/helpers";

type UserData =
  | DeserializedPool["userData"]
  | {
      allowance: number | string;
      stakingTokenBalance: number | string;
      stakedBalance: number | string;
      pendingReward: number | string;
    };

export const transformUserData = (userData: UserData) => {
  return {
    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalance: userData ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    pendingReward: userData ? new BigNumber(userData.pendingReward) : BIG_ZERO,
  };
};

const transformProfileRequirement = (profileRequirement?: { required: boolean; thresholdPoints: string }) => {
  return profileRequirement
    ? {
        required: profileRequirement.required,
        thresholdPoints: profileRequirement.thresholdPoints
          ? new BigNumber(profileRequirement.thresholdPoints)
          : BIG_ZERO,
      }
    : undefined;
};

export const transformPool = (pool: SerializedPool): DeserializedPool => {
  const {
    totalStaked,
    stakingLimit,
    numberBlocksForUserLimit,
    userData,
    stakingToken,
    earningToken,
    profileRequirement,
    startBlock,
    ...rest
  } = pool;
  //@ts-ignore
  return {
    ...rest,
    startBlock,
    //@ts-ignore
    profileRequirement: transformProfileRequirement(profileRequirement as SerializedPool),
    stakingToken: deserializeToken(stakingToken),
    earningToken: deserializeToken(earningToken),
    //@ts-ignore
    userData: transformUserData(userData as string),
    totalStaked: new BigNumber(totalStaked as string),
    stakingLimit: new BigNumber(stakingLimit as string),
    stakingLimitEndBlock: ((numberBlocksForUserLimit as number) + (startBlock as number)) as number,
  };
};

export const transformLockedVault = (vault: SerializedCakeVault): DeserializedCakeVault => {
  const {
    totalShares: totalSharesAsString,
    totalLockedAmount: totalLockedAmountAsString,
    pricePerFullShare: pricePerFullShareAsString,
    totalCakeInVault: totalCakeInVaultAsString,
    //@ts-ignore
    fees: { performanceFee, withdrawalFee, withdrawalFeePeriod } = {},
    //@ts-ignore
    userData: {
      //@ts-ignore
      isLoading,
      //@ts-ignore
      userShares: userSharesAsString,
      //@ts-ignore
      cakeAtLastUserAction: cakeAtLastUserActionAsString,
      //@ts-ignore
      lastDepositedTime,
      //@ts-ignore
      lastUserActionTime,
      //@ts-ignore
      userBoostedShare: userBoostedShareAsString,
      //@ts-ignore
      lockEndTime,
      //@ts-ignore
      lockStartTime,
      //@ts-ignore
      locked,
      //@ts-ignore
      lockedAmount: lockedAmountAsString,
      //@ts-ignore
      currentOverdueFee: currentOverdueFeeAsString,
      //@ts-ignore
      currentPerformanceFee: currentPerformanceFeeAsString,
    } = {},
  } = vault;

  const totalShares = totalSharesAsString ? new BigNumber(totalSharesAsString) : BIG_ZERO;
  const totalLockedAmount = new BigNumber(totalLockedAmountAsString as string);
  const pricePerFullShare = pricePerFullShareAsString ? new BigNumber(pricePerFullShareAsString) : BIG_ZERO;
  const totalCakeInVault = new BigNumber(totalCakeInVaultAsString as string);
  const userShares = new BigNumber(userSharesAsString as string);
  const cakeAtLastUserAction = new BigNumber(cakeAtLastUserActionAsString as string);
  const lockedAmount = new BigNumber(lockedAmountAsString as string);
  const userBoostedShare = new BigNumber(userBoostedShareAsString as string);
  const currentOverdueFee = currentOverdueFeeAsString ? new BigNumber(currentOverdueFeeAsString) : BIG_ZERO;
  const currentPerformanceFee = currentPerformanceFeeAsString ? new BigNumber(currentPerformanceFeeAsString) : BIG_ZERO;

  const performanceFeeAsDecimal = performanceFee && performanceFee / 100;

  const balance = convertSharesToCake(
    userShares,
    pricePerFullShare,
    undefined,
    undefined,
    currentOverdueFee.plus(currentPerformanceFee).plus(userBoostedShare),
  );

  return {
    totalShares,
    totalLockedAmount,
    pricePerFullShare,
    totalCakeInVault,
    fees: {
      performanceFee: performanceFee as number,
      withdrawalFee: withdrawalFee as number,
      withdrawalFeePeriod: withdrawalFeePeriod as number,
      performanceFeeAsDecimal: performanceFeeAsDecimal as number,
    },
    userData: {
      isLoading: isLoading as boolean,
      userShares,
      cakeAtLastUserAction,
      lastDepositedTime: lastDepositedTime as string,
      lastUserActionTime: lastUserActionTime as string,
      lockEndTime: lockEndTime as string,
      lockStartTime: lockStartTime as string,
      locked: locked as boolean,
      lockedAmount,
      userBoostedShare,
      currentOverdueFee,
      currentPerformanceFee,
      balance,
    },
  };
};

export const getTokenPricesFromFarm = (farms: SerializedFarm[]) => {
  return farms.reduce((prices: any, farm) => {
    const quoteTokenAddress: string = farm.quoteToken.address.toLocaleLowerCase();
    const tokenAddress: string = farm.token.address.toLocaleLowerCase();
    /* eslint-disable no-param-reassign */
    if (!prices[quoteTokenAddress]) {
      prices[quoteTokenAddress] = new BigNumber(farm.quoteTokenPriceBusd as string).toNumber();
    }
    if (!prices[tokenAddress]) {
      prices[tokenAddress] = new BigNumber(farm.tokenPriceBusd as string).toNumber();
    }
    /* eslint-enable no-param-reassign */
    return prices;
  }, {});
};
