import { NetworkId } from "src/networkDetails";

import { useWeb3Context } from "./web3Context";

const getTestnet = <TTargetNetwork extends NetworkId, TTestNetwork extends NetworkId>(
  targetNetwork: TTargetNetwork,
  testNetwork: TTestNetwork,
  currentNetwork: NetworkId,
  secondTestNetwork?: TTestNetwork,
): TTargetNetwork | TTestNetwork => {
  return secondTestNetwork && currentNetwork === secondTestNetwork
    ? secondTestNetwork
    : currentNetwork === testNetwork
    ? testNetwork
    : targetNetwork;
};

export const useTestableNetworks = () => {
  const { networkId: chainId = 56 } = useWeb3Context();

  return {
    MAINNET: getTestnet(NetworkId.MAINNET, chainId, NetworkId.BSC_TEST),
    AVALANCHE: getTestnet(NetworkId.AVALANCHE, NetworkId.AVALANCHE_TESTNET, chainId),
    ARBITRUM: getTestnet(NetworkId.ARBITRUM, NetworkId.ARBITRUM_TESTNET, chainId),
    POLYGON: getTestnet(NetworkId.POLYGON, NetworkId.POLYGON_TESTNET, chainId),
    FANTOM: getTestnet(NetworkId.FANTOM, NetworkId.FANTOM_TESTNET, chainId),
  };
};
