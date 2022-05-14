import BigNumber from "bignumber.js";
import erc20ABI from "src/config/abi/erc20.json";
import masterchefABI from "src/config/abi/masterchef.json";
import { SerializedFarmConfig } from "src/constants/types";
import { getAddress, getMasterChefAddress } from "src/utils/addressHelpers";
import multicall from "src/utils/multicall";

export const fetchFarmUserAllowances = async (account: string, farmsToFetch: SerializedFarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress();

  const calls = farmsToFetch.map(farm => {
    const lpContractAddress = getAddress(farm.lpAddresses);
    return { address: lpContractAddress, name: "allowance", params: [account, masterChefAddress] };
  });

  const rawLpAllowances = await multicall<BigNumber[]>(erc20ABI, calls);
  const parsedLpAllowances = rawLpAllowances.map(lpBalance => {
    return new BigNumber(lpBalance).toJSON();
  });
  return parsedLpAllowances;
};

export const fetchFarmUserTokenBalances = async (account: string, farmsToFetch: SerializedFarmConfig[]) => {
  const calls = farmsToFetch.map(farm => {
    const lpContractAddress = getAddress(farm.lpAddresses);
    return {
      address: lpContractAddress,
      name: "balanceOf",
      params: [account],
    };
  });

  const rawTokenBalances = await multicall(erc20ABI, calls);
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance: any) => {
    return new BigNumber(tokenBalance).toJSON();
  });
  return parsedTokenBalances;
};

export const fetchFarmUserStakedBalances = async (account: string, farmsToFetch: SerializedFarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress();

  const calls = farmsToFetch.map(farm => {
    return {
      address: masterChefAddress,
      name: "userInfo",
      params: [farm.pid, account],
    };
  });

  const rawStakedBalances = await multicall(masterchefABI, calls);
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance: any) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON();
  });
  return parsedStakedBalances;
};

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: SerializedFarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress();

  const calls = farmsToFetch.map(farm => {
    return {
      address: masterChefAddress,
      name: "pendingCake",
      params: [farm.pid, account],
    };
  });

  const rawEarnings = await multicall(masterchefABI, calls);
  const parsedEarnings = rawEarnings.map((earnings: any) => {
    return new BigNumber(earnings).toJSON();
  });
  return parsedEarnings;
};
