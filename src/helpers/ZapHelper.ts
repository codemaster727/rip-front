import { addresses, NetworkId } from "../constants";

export const isSupportedChain = (networkId: NetworkId): boolean => {
  return !!addresses[networkId] && !!addresses[networkId].ZAP;
};
