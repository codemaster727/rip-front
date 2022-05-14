import { ChainId } from "@pancakeswap/sdk";

import { CHAIN_ID } from "../constants/networks";
import { GAS_PRICE_GWEI } from "../slices/types";
import store from "../store";

/**
 * Function to return gasPrice outwith a react component
 */
const getGasPrice = (): string => {
  const chainId = CHAIN_ID;
  const state = store.getState();
  const userGas = state.user.gasPrice || GAS_PRICE_GWEI.default;
  return chainId === ChainId.MAINNET.toString() ? userGas : GAS_PRICE_GWEI.testnet;
};

export default getGasPrice;
