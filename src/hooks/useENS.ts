import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { queryAssertion } from "src/helpers";

import { useWeb3Context } from ".";

export const ensQueryKey = (address?: string) => [address, "useEns"];

export const useEns = () => {
  const { provider, address, networkId } = useWeb3Context();

  const isEnsSupported = networkId === NetworkId.MAINNET || networkId === NetworkId.TESTNET_RINKEBY;

  return useQuery<{ name: string | null; avatar: string | null }, Error>(
    ensQueryKey(address),
    async () => {
      queryAssertion(address, ensQueryKey(address));
      let name: string | null = "";
      let avatar: string | null = "";
      try {
        name = await provider.lookupAddress(address);
        avatar = name ? await provider.getAvatar(name) : null;
        console.log(name, avatar);
      } catch (error) {
        console.log(error);
      }
      return { name, avatar };
    },

    { enabled: !!address && isEnsSupported },
  );
};
