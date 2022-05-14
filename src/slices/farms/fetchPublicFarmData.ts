import chunk from "lodash/chunk";
import erc20 from "src/config/abi/erc20.json";
import { getAddress, getMasterChefAddress } from "src/utils/addressHelpers";
import { multicallv2 } from "src/utils/multicall";

import { SerializedFarmConfig } from "../../constants/types";
import { SerializedFarm } from "../types";

const fetchFarmCalls = (farm: SerializedFarm) => {
  const { lpAddresses, token, quoteToken } = farm;
  const lpAddress = getAddress(lpAddresses);
  return [
    // Balance of token in the LP contract
    {
      address: token.address,
      name: "balanceOf",
      params: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      address: quoteToken.address,
      name: "balanceOf",
      params: [lpAddress],
    },
    // Balance of LP tokens in the master chef contract
    {
      address: lpAddress,
      name: "balanceOf",
      params: [getMasterChefAddress()],
    },
    // Total supply of LP tokens
    {
      address: lpAddress,
      name: "totalSupply",
    },
    // Token decimals
    {
      address: token.address,
      name: "decimals",
    },
    // Quote token decimals
    {
      address: quoteToken.address,
      name: "decimals",
    },
  ];
};

export const fetchPublicFarmsData = async (farms: SerializedFarmConfig[]): Promise<any[]> => {
  const farmCalls = farms.flatMap(farm => fetchFarmCalls(farm));
  const chunkSize = farmCalls.length / farms.length;
  const farmMultiCallResult = await multicallv2(erc20, farmCalls);
  return chunk(farmMultiCallResult, chunkSize);
};
