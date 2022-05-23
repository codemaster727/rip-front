import BigNumber from "bignumber.js";
import sousChefV2 from "src/config/abi/sousChefV2.json";
import poolsConfig from "src/constants/pools";

import { getAddress } from "../addressHelpers";
import multicall from "../multicall";
import { simpleRpcProvider } from "../providers";

/**
 * Returns the total number of pools that were active at a given block
 */
export const getActivePools = async (block?: number) => {
  const eligiblePools = poolsConfig
    .filter(pool => pool.sousId !== 0)
    .filter(pool => pool.isFinished === false || pool.isFinished === undefined);
  const blockNumber = block || (await simpleRpcProvider.getBlockNumber());
  const startBlockCalls = eligiblePools.map(({ contractAddress }) => ({
    address: getAddress(contractAddress),
    name: "startBlock",
  }));
  const endBlockCalls = eligiblePools.map(({ contractAddress }) => ({
    address: getAddress(contractAddress),
    name: "bonusEndBlock",
  }));
  const startBlocks = await multicall(sousChefV2, startBlockCalls);
  const endBlocks = await multicall(sousChefV2, endBlockCalls);
  //@ts-ignore
  return eligiblePools.reduce((accum, poolCheck, index) => {
    const startBlock = startBlocks[index] ? new BigNumber(startBlocks[index]) : null;
    const endBlock = endBlocks[index] ? new BigNumber(endBlocks[index]) : null;

    if (!startBlock || !endBlock) {
      return accum;
    }

    if (startBlock.gte(blockNumber) || endBlock.lte(blockNumber)) {
      return accum;
    }

    return [...accum, poolCheck];
  }, []);
};
