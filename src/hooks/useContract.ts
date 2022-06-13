import { Contract, ContractInterface } from "@ethersproject/contracts";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { useMemo } from "react";
import { abi as IERC20_ABI } from "src/abi/IERC20.json";
import { abi as PAIR_CONTRACT_ABI } from "src/abi/PairContract.json";
import STAKING_ABI from "src/abi/RIPProtocolStakingv2.json";
import { NetworkId } from "src/constants";
import { AddressMap, STAKING_ADDRESSES } from "src/constants/addresses";
import { assert } from "src/helpers";
import { dai } from "src/helpers/AllBonds";
import { NodeHelper } from "src/helpers/NodeHelper";
import { IERC20, PairContract, RIPProtocolStakingv2 } from "src/typechain";

import { useWeb3Context } from ".";

const provider = NodeHelper.getMainnetStaticProvider();

/**
 * Hook for fetching a contract.
 *
 * @param addressOrMap A contract address, or a map with a contract address for each network
 * @param ABI The contract interface
 * @param provider An optional static provider to be used by the contract
 */
export function useContract<TContract extends Contract = Contract>(
  addressOrMap: AddressMap | false | undefined,
  ABI: ContractInterface,
): TContract | null;
export function useContract<TContract extends Contract = Contract>(
  addressOrMap: string | false | undefined,
  ABI: ContractInterface,
  provider?: StaticJsonRpcProvider,
): TContract;
export function useContract<TContract extends Contract = Contract>(
  addressOrMap: string | AddressMap | false | undefined,
  ABI: ContractInterface,
  provider?: StaticJsonRpcProvider,
): TContract | null {
  const { provider: currentProvider, networkId } = useWeb3Context();

  return useMemo(() => {
    if (!addressOrMap) return null;
    const address = typeof addressOrMap === "string" ? addressOrMap : addressOrMap[networkId as NetworkId];
    if (!address) return null;

    try {
      return new Contract(address, ABI, provider || currentProvider) as TContract;
    } catch (error) {
      console.error("Unable to get contract", error);
      return null;
    }
  }, [addressOrMap, ABI, provider, networkId, currentProvider]);
}

const usePairContractForRip = (address: string) => {
  return useContract<PairContract>(address, PAIR_CONTRACT_ABI);
};

export const useStakingContract = () => {
  const address = STAKING_ADDRESSES[NetworkId.MAINNET];

  return useContract<RIPProtocolStakingv2>(address, STAKING_ABI, provider);
};

export const useRipDaiReserveContract = () => {
  const address = dai.networkAddrs[NetworkId.MAINNET]?.reserveAddress;
  assert(address, "Contract should exist for NetworkId.MAINNET");

  return usePairContractForRip(address);
};

export const useTokenContractForRip = (addressMap: AddressMap) => {
  return useContract<IERC20>(addressMap, IERC20_ABI);
};

//Pancake

// import useActiveWeb3React from 'src/hooks/useActiveWeb3React'
// Imports below migrated from Exchange useContract.ts
import { WETH } from "@pancakeswap/sdk";

import { ERC20_BYTES32_ABI } from "../config/abi/erc20";
import ERC20_ABI from "../config/abi/erc20.json";
import IPancakePairABI from "../config/abi/IPancakePair.json";
import multiCallAbi from "../config/abi/Multicall.json";
import { Cake, CakeVaultV2, Erc20, Erc20Bytes32, Erc721collection, Multicall, Weth } from "../config/abi/types";
import { IPancakePair } from "../config/abi/types/IPancakePair";
import WETH_ABI from "../config/abi/weth.json";
import { getProviderOrSigner } from "../utils";
import { getMulticallAddress } from "../utils/addressHelpers";
import {
  getAnniversaryAchievementContract,
  getBep20Contract,
  getBunnyFactoryContract,
  getBunnySpecialCakeVaultContract,
  getBunnySpecialContract,
  getBunnySpecialLotteryContract,
  getBunnySpecialPredictionContract,
  getBunnySpecialXmasContract,
  getCakeContract,
  getCakeVaultV2Contract,
  getChainlinkOracleContract,
  getClaimRefundContract,
  getEasterNftContract,
  getErc721CollectionContract,
  getErc721Contract,
  getFarmAuctionContract,
  getIfoV1Contract,
  getIfoV2Contract,
  getLotteryV2Contract,
  getMasterchefContract,
  getMasterchefV1Contract,
  getNftMarketContract,
  getNftSaleContract,
  getPancakeBunniesContract,
  getPancakeSquadContract,
  getPointCenterIfoContract,
  getPredictionsContract,
  getProfileContract,
  getSouschefContract,
  getTradingCompetitionContract,
  getTradingCompetitionContractMobox,
  getTradingCompetitionContractV2,
} from "../utils/contractHelpers";

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoV1Contract = (address: string) => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getIfoV1Contract(address, library.getSigner()), [address, library]);
};

export const useIfoV2Contract = (address: string) => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getIfoV2Contract(address, library.getSigner()), [address, library]);
};

export const useERC20 = (address: string, withSignerIfPossible = true) => {
  const { provider: library, account } = useWeb3Context();

  return useMemo(
    () =>
      getBep20Contract(
        address,
        withSignerIfPossible ? getProviderOrSigner(library as Web3Provider, account) : undefined,
      ),
    [account, address, library, withSignerIfPossible],
  );
};

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string) => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getErc721Contract(address, library.getSigner()), [address, library]);
};

export const useCake = (): { reader: Cake; signer: Cake } => {
  const { account, provider: library } = useWeb3Context();
  return useMemo(
    () => ({
      reader: getCakeContract(undefined),
      signer: getCakeContract(getProviderOrSigner(library as Web3Provider, account)),
    }),
    [account, library],
  );
};

export const useBunnyFactory = () => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getBunnyFactoryContract(library.getSigner()), [library]);
};

export const usePancakeBunnies = () => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getPancakeBunniesContract(library.getSigner()), [library]);
};

export const useProfileContract = (withSignerIfPossible = true) => {
  const { provider: library, account } = useWeb3Context();
  return useMemo(
    () => getProfileContract(withSignerIfPossible ? getProviderOrSigner(library as Web3Provider, account) : undefined),
    [withSignerIfPossible, account, library],
  );
};

export const useLotteryV2Contract = () => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getLotteryV2Contract(library.getSigner()), [library]);
};

export const useMasterchef = (withSignerIfPossible = true) => {
  const { provider: library, account } = useWeb3Context();
  return useMemo(
    () =>
      getMasterchefContract(withSignerIfPossible ? getProviderOrSigner(library as Web3Provider, account) : undefined),
    [library, withSignerIfPossible, account],
  );
};

export const useMasterchefV1 = () => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getMasterchefV1Contract(library.getSigner()), [library]);
};

export const useSousChef = (id: number) => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getSouschefContract(id, library.getSigner()), [id, library]);
};

export const usePointCenterIfoContract = () => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getPointCenterIfoContract(library.getSigner()), [library]);
};

export const useBunnySpecialContract = () => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getBunnySpecialContract(library.getSigner()), [library]);
};

export const useClaimRefundContract = () => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getClaimRefundContract(library.getSigner()), [library]);
};

export const useTradingCompetitionContract = () => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getTradingCompetitionContract(library.getSigner()), [library]);
};

export const useTradingCompetitionContractV2 = (withSignerIfPossible = true) => {
  const { provider: library, account } = useWeb3Context();
  return useMemo(
    () =>
      getTradingCompetitionContractV2(
        withSignerIfPossible ? getProviderOrSigner(library as Web3Provider, account) : undefined,
      ),
    [library, withSignerIfPossible, account],
  );
};

export const useTradingCompetitionContractMobox = (withSignerIfPossible = true) => {
  const { provider: library, account } = useWeb3Context();
  return useMemo(
    () =>
      getTradingCompetitionContractMobox(
        withSignerIfPossible ? getProviderOrSigner(library as Web3Provider, account) : undefined,
      ),
    [library, withSignerIfPossible, account],
  );
};

export const useEasterNftContract = () => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getEasterNftContract(library.getSigner()), [library]);
};

export const useVaultPoolContract = (): CakeVaultV2 => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getCakeVaultV2Contract(library.getSigner()), [library]);
};

export const useCakeVaultContract = (withSignerIfPossible = true) => {
  const { provider: library, account } = useWeb3Context();
  return useMemo(
    () =>
      getCakeVaultV2Contract(withSignerIfPossible ? getProviderOrSigner(library as Web3Provider, account) : undefined),
    [withSignerIfPossible, library, account],
  );
};

export const usePredictionsContract = () => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getPredictionsContract(library.getSigner()), [library]);
};

export const useChainlinkOracleContract = (withSignerIfPossible = true) => {
  const { provider: library, account } = useWeb3Context();
  return useMemo(
    () =>
      getChainlinkOracleContract(
        withSignerIfPossible ? getProviderOrSigner(library as Web3Provider, account) : undefined,
      ),
    [account, library, withSignerIfPossible],
  );
};

export const useSpecialBunnyCakeVaultContract = () => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getBunnySpecialCakeVaultContract(library.getSigner()), [library]);
};

export const useSpecialBunnyPredictionContract = () => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getBunnySpecialPredictionContract(library.getSigner()), [library]);
};

export const useBunnySpecialLotteryContract = () => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getBunnySpecialLotteryContract(library.getSigner()), [library]);
};

export const useBunnySpecialXmasContract = () => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getBunnySpecialXmasContract(library.getSigner()), [library]);
};

export const useAnniversaryAchievementContract = () => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getAnniversaryAchievementContract(library.getSigner()), [library]);
};

export const useNftSaleContract = () => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getNftSaleContract(library.getSigner()), [library]);
};

export const usePancakeSquadContract = () => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getPancakeSquadContract(library.getSigner()), [library]);
};

export const useFarmAuctionContract = (withSignerIfPossible = true) => {
  const { account, provider: library } = useWeb3Context();
  return useMemo(
    () =>
      getFarmAuctionContract(withSignerIfPossible ? getProviderOrSigner(library as Web3Provider, account) : undefined),
    [library, account, withSignerIfPossible],
  );
};

export const useNftMarketContract = () => {
  const { provider: library } = useWeb3Context();
  return useMemo(() => getNftMarketContract(library.getSigner()), [library]);
};

export const useErc721CollectionContract = (
  collectionAddress: string,
): { reader: Erc721collection; signer: Erc721collection } => {
  const { provider: library, account } = useWeb3Context();
  return useMemo(
    () => ({
      reader: getErc721CollectionContract(collectionAddress),
      signer: getErc721CollectionContract(
        collectionAddress,
        getProviderOrSigner(library as Web3Provider, account as string),
      ),
    }),
    [account, library, collectionAddress],
  );
};

// Code below migrated from Exchange useContract.ts

// returns null on errors
// function useContract<T extends Contract = Contract>(
//   address: string | undefined,
//   ABI: any,
//   withSignerIfPossible = true,
// ): T | null {
//   const { provider: library, account } = useWeb3Context()

//   return useMemo(() => {
//     if (!address || !ABI || !library) return null
//     try {
//       return getContract(address, ABI, withSignerIfPossible ? getProviderOrSigner(library as Web3Provider, account) : undefined)
//     } catch (error) {
//       console.error('Failed to get contract', error)
//       return null
//     }
//   }, [address, ABI, library, withSignerIfPossible, account]) as T
// }

export function useTokenContract(tokenAddress: string | false | undefined, withSignerIfPossible?: boolean) {
  const { address: account, provider: library } = useWeb3Context();
  return useContract<Erc20>(
    tokenAddress,
    ERC20_ABI,
    withSignerIfPossible
      ? (getProviderOrSigner(library as Web3Provider, account as string) as StaticJsonRpcProvider)
      : undefined,
  );
}

export function useWBNBContract(withSignerIfPossible?: boolean): Contract | null {
  const { networkId: chainId, provider: library, address: account } = useWeb3Context();
  return useContract<Weth>(
    WETH[chainId as keyof typeof WETH].address,
    WETH_ABI,
    withSignerIfPossible
      ? (getProviderOrSigner(library as Web3Provider, account as string) as StaticJsonRpcProvider)
      : undefined,
  );
}

export function useBytes32TokenContract(
  tokenAddress: string | false | undefined,
  withSignerIfPossible?: boolean,
): Contract | null {
  const { provider: library, address: account } = useWeb3Context();
  return useContract<Erc20Bytes32>(
    tokenAddress,
    ERC20_BYTES32_ABI,
    withSignerIfPossible
      ? (getProviderOrSigner(library as Web3Provider, account as string) as StaticJsonRpcProvider)
      : undefined,
  );
}

export function usePairContract(pairAddress: string | undefined, withSignerIfPossible?: boolean): IPancakePair | null {
  const { provider: library, address: account } = useWeb3Context();
  return useContract(
    pairAddress,
    IPancakePairABI,
    withSignerIfPossible
      ? (getProviderOrSigner(library as Web3Provider, account as string) as StaticJsonRpcProvider)
      : undefined,
  ) as IPancakePair;
}

export function useMulticallContract() {
  return useContract<Multicall>(getMulticallAddress(), multiCallAbi, undefined);
}
