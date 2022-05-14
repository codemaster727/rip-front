import { ChainId, GelatoLimitOrders } from "@gelatonetwork/limit-orders-lib";
import { useMemo } from "react";

import { GELATO_HANDLER } from "../../constants";
// import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useWeb3Context } from "../web3Context";

const useGelatoLimitOrdersLib = (): GelatoLimitOrders | undefined => {
  const { networkId: chainId, provider: library } = useWeb3Context();

  return useMemo(() => {
    if (!chainId || !library) {
      console.error("Could not instantiate GelatoLimitOrders: missing chainId or library");
      return undefined;
    }
    try {
      return new GelatoLimitOrders(chainId as ChainId, library?.getSigner(), GELATO_HANDLER, false);
    } catch (error: any) {
      console.error(`Could not instantiate GelatoLimitOrders: ${error.message}`);
      return undefined;
    }
  }, [chainId, library]);
};

export default useGelatoLimitOrdersLib;
