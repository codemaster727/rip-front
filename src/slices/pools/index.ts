import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";
import cakeAbi from "src/config/abi/cake.json";
import poolsConfig from "src/constants/pools";
import priceHelperLpsConfig from "src/constants/priceHelperLps";
import tokens from "src/constants/tokens";
import {
  AppThunk,
  PoolsState,
  SerializedCakeVault,
  SerializedLockedVaultUser,
  SerializedPool,
  SerializedVaultFees,
} from "src/slices/types";
import { getCakeVaultAddress } from "src/utils/addressHelpers";
import { getPoolApr } from "src/utils/apr";
import { BIG_ZERO } from "src/utils/bigNumber";
import { getBalanceNumber } from "src/utils/formatBalance";
import { multicallv2 } from "src/utils/multicall";
import { simpleRpcProvider } from "src/utils/providers";

import fetchFarms from "../farms/fetchFarms";
import getFarmsPrices from "../farms/getFarmsPrices";
import { resetUserState } from "../global/actions";
import {
  fetchPoolsBlockLimits,
  fetchPoolsProfileRequirement,
  fetchPoolsStakingLimits,
  fetchPoolsTotalStaking,
} from "./fetchPools";
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserPendingRewards,
  fetchUserStakeBalances,
} from "./fetchPoolsUser";
import { fetchPublicVaultData, fetchVaultFees } from "./fetchVaultPublic";
import fetchVaultUser from "./fetchVaultUser";
import { getTokenPricesFromFarm } from "./helpers";

export const initialPoolVaultState: SerializedCakeVault = Object.freeze({
  totalShares: null,
  totalLockedAmount: null,
  pricePerFullShare: null,
  totalCakeInVault: null,
  fees: {
    performanceFee: null,
    withdrawalFee: null,
    withdrawalFeePeriod: null,
  },
  userData: {
    isLoading: true,
    userShares: null,
    cakeAtLastUserAction: null,
    lastDepositedTime: null,
    lastUserActionTime: null,
    credit: null,
    locked: null,
    lockStartTime: null,
    lockEndTime: null,
    userBoostedShare: null,
    lockedAmount: null,
    currentOverdueFee: null,
    currentPerformanceFee: null,
  },
  creditStartBlock: null,
});

const initialState: PoolsState = {
  data: [...poolsConfig],
  userDataLoaded: false,
  cakeVault: initialPoolVaultState as SerializedCakeVault,
};

const cakeVaultAddress = getCakeVaultAddress();

export const fetchCakePoolUserDataAsync = (account: string) => async (dispatch: any) => {
  const allowanceCall = {
    address: tokens.cake.address,
    name: "allowance",
    params: [account, cakeVaultAddress],
  };
  const balanceOfCall = {
    address: tokens.cake.address,
    name: "balanceOf",
    params: [account],
  };
  const cakeContractCalls = [allowanceCall, balanceOfCall];
  const [[allowance], [stakingTokenBalance]] = await multicallv2(cakeAbi, cakeContractCalls);

  dispatch(
    setPoolUserData({
      sousId: 0,
      data: {
        allowance: new BigNumber(allowance.toString()).toJSON(),
        stakingTokenBalance: new BigNumber(stakingTokenBalance.toString()).toJSON(),
      },
    }),
  );
};

export const fetchPoolsPublicDataAsync = (currentBlockNumber: number) => async (dispatch: any, getState: any) => {
  try {
    const blockLimits = await fetchPoolsBlockLimits();
    const totalStakings = await fetchPoolsTotalStaking();
    const profileRequirements = await fetchPoolsProfileRequirement();
    let currentBlock = currentBlockNumber;
    if (!currentBlock) {
      currentBlock = await simpleRpcProvider.getBlockNumber();
    }

    const activePriceHelperLpsConfig = priceHelperLpsConfig.filter(priceHelperLpConfig => {
      return (
        poolsConfig
          .filter(pool => pool.earningToken.address.toLowerCase() === priceHelperLpConfig.token.address.toLowerCase())
          .filter(pool => {
            const poolBlockLimit = blockLimits.find(blockLimit => blockLimit.sousId === pool.sousId);
            if (poolBlockLimit) {
              return poolBlockLimit.endBlock > currentBlock;
            }
            return false;
          }).length > 0
      );
    });
    const poolsWithDifferentFarmToken =
      activePriceHelperLpsConfig.length > 0 ? await fetchFarms(priceHelperLpsConfig) : [];
    const farmsData = getState().farms.data;
    const bnbBusdFarm =
      activePriceHelperLpsConfig.length > 0
        ? farmsData.find((farm: any) => farm.token.symbol === "BUSD" && farm.quoteToken.symbol === "WBNB")
        : null;
    const farmsWithPricesOfDifferentTokenPools = bnbBusdFarm
      ? getFarmsPrices([bnbBusdFarm, ...poolsWithDifferentFarmToken])
      : [];

    const prices = getTokenPricesFromFarm([...farmsData, ...farmsWithPricesOfDifferentTokenPools]);

    const liveData = poolsConfig.map(pool => {
      const blockLimit = blockLimits.find(entry => entry.sousId === pool.sousId);
      const totalStaking = totalStakings.find(entry => entry.sousId === pool.sousId);
      const isPoolEndBlockExceeded =
        currentBlock > 0 && blockLimit ? currentBlock > Number(blockLimit.endBlock) : false;
      const isPoolFinished = pool.isFinished || isPoolEndBlockExceeded;

      const stakingTokenAddress = pool.stakingToken.address ? pool.stakingToken.address.toLowerCase() : null;
      const stakingTokenPrice = stakingTokenAddress ? prices[stakingTokenAddress] : 0;

      const earningTokenAddress = pool.earningToken.address ? pool.earningToken.address.toLowerCase() : null;
      const earningTokenPrice = earningTokenAddress ? prices[earningTokenAddress] : 0;
      const apr = !isPoolFinished
        ? getPoolApr(
            stakingTokenPrice,
            earningTokenPrice,
            getBalanceNumber(new BigNumber(totalStaking!.totalStaked as string), pool.stakingToken.decimals),
            parseFloat(pool.tokenPerBlock),
          )
        : 0;

      const profileRequirement = profileRequirements[pool.sousId] ? profileRequirements[pool.sousId] : undefined;

      return {
        ...blockLimit,
        ...totalStaking,
        profileRequirement,
        stakingTokenPrice,
        earningTokenPrice,
        apr,
        isFinished: isPoolFinished,
      };
    });

    dispatch(setPoolsPublicData(liveData));
  } catch (error) {
    console.error("[Pools Action] error when getting public data", error);
  }
};

export const fetchPoolsStakingLimitsAsync = () => async (dispatch: any, getState: any) => {
  const poolsWithStakingLimit = getState()
    .pools.data.filter(({ stakingLimit }: { stakingLimit: any }) => stakingLimit !== null && stakingLimit !== undefined)
    .map((pool: any) => pool.sousId);

  try {
    const stakingLimits = await fetchPoolsStakingLimits(poolsWithStakingLimit);

    const stakingLimitData = poolsConfig.map(pool => {
      if (poolsWithStakingLimit.includes(pool.sousId)) {
        return { sousId: pool.sousId };
      }
      const { stakingLimit, numberBlocksForUserLimit } = stakingLimits[pool.sousId] || {
        stakingLimit: BIG_ZERO,
        numberBlocksForUserLimit: 0,
      };
      return {
        sousId: pool.sousId,
        stakingLimit: stakingLimit.toJSON(),
        numberBlocksForUserLimit,
      };
    });

    dispatch(setPoolsPublicData(stakingLimitData));
  } catch (error) {
    console.error("[Pools Action] error when getting staking limits", error);
  }
};

export const fetchPoolsUserDataAsync =
  (account: string): AppThunk =>
  async dispatch => {
    try {
      const allowances: any = await fetchPoolsAllowance(account);
      const stakingTokenBalances: any = await fetchUserBalances(account);
      const stakedBalances: any = await fetchUserStakeBalances(account);
      const pendingRewards: any = await fetchUserPendingRewards(account);

      const userData = poolsConfig.map(pool => ({
        sousId: pool.sousId,
        allowance: allowances[pool.sousId],
        stakingTokenBalance: stakingTokenBalances[pool.sousId],
        stakedBalance: stakedBalances[pool.sousId],
        pendingReward: pendingRewards[pool.sousId],
      }));

      dispatch(setPoolsUserData(userData));
    } catch (error) {
      console.error("[Pools Action] Error fetching pool user data", error);
    }
  };

export const updateUserAllowance =
  (sousId: number, account: string): AppThunk =>
  async dispatch => {
    const allowances: any = await fetchPoolsAllowance(account);
    dispatch(updatePoolsUserData({ sousId, field: "allowance", value: allowances[sousId] }));
  };

export const updateUserBalance =
  (sousId: number, account: string): AppThunk =>
  async dispatch => {
    const tokenBalances: any = await fetchUserBalances(account);
    dispatch(updatePoolsUserData({ sousId, field: "stakingTokenBalance", value: tokenBalances[sousId] }));
  };

export const updateUserStakedBalance =
  (sousId: number, account: string): AppThunk =>
  async dispatch => {
    const stakedBalances: any = await fetchUserStakeBalances(account);
    dispatch(updatePoolsUserData({ sousId, field: "stakedBalance", value: stakedBalances[sousId] }));
  };

export const updateUserPendingReward =
  (sousId: number, account: string): AppThunk =>
  async dispatch => {
    const pendingRewards: any = await fetchUserPendingRewards(account);
    dispatch(updatePoolsUserData({ sousId, field: "pendingReward", value: pendingRewards[sousId] }));
  };

export const fetchCakeVaultPublicData = createAsyncThunk<SerializedCakeVault>("cakeVault/fetchPublicData", async () => {
  const publicVaultInfo = await fetchPublicVaultData();
  return publicVaultInfo;
});

export const fetchCakeVaultFees = createAsyncThunk<SerializedVaultFees>("cakeVault/fetchFees", async () => {
  const vaultFees = await fetchVaultFees();
  return vaultFees;
});

export const fetchCakeVaultUserData = createAsyncThunk<SerializedLockedVaultUser, { account: string }>(
  "cakeVault/fetchUser",
  async ({ account }) => {
    const userData = await fetchVaultUser(account);
    return userData;
  },
);

export const PoolsSlice = createSlice({
  name: "Pools",
  initialState,
  reducers: {
    setPoolPublicData: (state: any, action: any) => {
      const { sousId } = action.payload;
      const poolIndex = state.data.findIndex((pool: any) => pool.sousId === sousId);
      state.data[poolIndex] = {
        ...state.data[poolIndex],
        ...action.payload.data,
      };
    },
    setPoolUserData: (state: any, action: any) => {
      const { sousId } = action.payload;
      const poolIndex = state.data.findIndex((pool: any) => pool.sousId === sousId);
      state.data[poolIndex].userData = action.payload.data;
    },
    setPoolsPublicData: (state: any, action: any) => {
      const livePoolsData: SerializedPool[] = action.payload;
      state.data = state.data.map((pool: any) => {
        const livePoolData = livePoolsData.find(entry => entry.sousId === pool.sousId);
        return { ...pool, ...livePoolData };
      });
    },
    setPoolsUserData: (state: any, action: any) => {
      const userData = action.payload;
      state.data = state.data.map((pool: any) => {
        const userPoolData = userData.find((entry: any) => entry.sousId === pool.sousId);
        return { ...pool, userData: userPoolData };
      });
      state.userDataLoaded = true;
    },
    updatePoolsUserData: (state: any, action: any) => {
      const { field, value, sousId } = action.payload;
      const index = state.data.findIndex((p: any) => p.sousId === sousId);

      if (index >= 0) {
        //@ts-ignore
        state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } };
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(resetUserState, state => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state.data = state.data.map(({ userData, ...pool }) => {
        return { ...pool };
      });
      state.userDataLoaded = false;
      state.cakeVault = { ...state.cakeVault, userData: initialPoolVaultState.userData };
    });
    // Vault public data that updates frequently
    builder.addCase(fetchCakeVaultPublicData.fulfilled, (state, action: PayloadAction<SerializedCakeVault>) => {
      state.cakeVault = { ...state.cakeVault, ...action.payload };
    });
    // Vault fees
    builder.addCase(fetchCakeVaultFees.fulfilled, (state, action: PayloadAction<SerializedVaultFees>) => {
      const fees = action.payload;
      state.cakeVault = { ...state.cakeVault, fees };
    });
    // Vault user data
    builder.addCase(fetchCakeVaultUserData.fulfilled, (state, action: PayloadAction<SerializedLockedVaultUser>) => {
      const userData = action.payload;
      userData.isLoading = false;
      state.cakeVault = { ...state.cakeVault, userData };
    });
  },
});

// Actions
export const { setPoolsPublicData, setPoolsUserData, updatePoolsUserData, setPoolPublicData, setPoolUserData } =
  PoolsSlice.actions;

export default PoolsSlice.reducer;
