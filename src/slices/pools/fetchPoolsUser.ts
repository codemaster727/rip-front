import BigNumber from "bignumber.js";
import uniq from "lodash/uniq";
import erc20ABI from "src/config/abi/erc20.json";
import sousChefABI from "src/config/abi/sousChef.json";
import poolsConfig from "src/constants/pools";
import { getAddress } from "src/utils/addressHelpers";
import multicall from "src/utils/multicall";
import { simpleRpcProvider } from "src/utils/providers";

// Pool 0, Cake / Cake is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const nonBnbPools = poolsConfig.filter(pool => pool.stakingToken.symbol !== "BNB");
const bnbPools = poolsConfig.filter(pool => pool.stakingToken.symbol === "BNB");
const nonMasterPools = poolsConfig.filter(pool => pool.sousId !== 0);

export const fetchPoolsAllowance = async (account: string) => {
  const calls = nonBnbPools.map(pool => ({
    address: pool.stakingToken.address,
    name: "allowance",
    params: [account, getAddress(pool.contractAddress)],
  }));

  const allowances = await multicall(erc20ABI, calls);
  return nonBnbPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(allowances[index]).toJSON() }),
    {},
  );
};

export const fetchUserBalances = async (account: string) => {
  // Non BNB pools
  const tokens = uniq(nonBnbPools.map(pool => pool.stakingToken.address));
  const calls = tokens.map(token => ({
    address: token,
    name: "balanceOf",
    params: [account],
  }));
  const tokenBalancesRaw = await multicall(erc20ABI, calls);
  const tokenBalances: any = tokens.reduce((acc, token, index) => ({ ...acc, [token]: tokenBalancesRaw[index] }), {});
  const poolTokenBalances = nonBnbPools.reduce(
    (acc, pool) => ({
      ...acc,
      ...(tokenBalances[pool.stakingToken.address] && {
        [pool.sousId]: new BigNumber(tokenBalances[pool.stakingToken.address]).toJSON(),
      }),
    }),
    {},
  );

  // BNB pools
  const bnbBalance = await simpleRpcProvider.getBalance(account);
  const bnbBalances = bnbPools.reduce(
    (acc, pool) => ({ ...acc, [pool.sousId]: new BigNumber(bnbBalance.toString()).toJSON() }),
    {},
  );

  return { ...poolTokenBalances, ...bnbBalances };
};

export const fetchUserStakeBalances = async (account: string) => {
  const calls = nonMasterPools.map(p => ({
    address: getAddress(p.contractAddress),
    name: "userInfo",
    params: [account],
  }));
  const userInfo = await multicall(sousChefABI, calls);
  return nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(userInfo[index].amount._hex).toJSON(),
    }),
    {},
  );
};

export const fetchUserPendingRewards = async (account: string) => {
  const calls = nonMasterPools.map(p => ({
    address: getAddress(p.contractAddress),
    name: "pendingReward",
    params: [account],
  }));
  const res = await multicall(sousChefABI, calls);
  return nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(res[index]).toJSON(),
    }),
    {},
  );
};
