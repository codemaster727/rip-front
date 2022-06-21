import { FetchStatus } from "src/constants/types";
import { useWeb3Context } from "src/hooks";
import { getAddress } from "src/utils/addressHelpers";
import { getActivePools } from "src/utils/calls";
import { simpleRpcProvider } from "src/utils/providers";
import useSWRImmutable from "swr/immutable";

import { getVotingPower } from "../helpers";

interface State {
  cakeBalance?: number;
  cakeVaultBalance?: number;
  cakePoolBalance?: number;
  poolsBalance?: number;
  cakeBnbLpBalance?: number;
  ifoPoolBalance?: number;
  total?: number;
}

const useGetVotingPower = (block?: number, isActive = true): State & { isLoading: boolean; isError: boolean } => {
  const { account } = useWeb3Context();
  //@ts-ignore
  const { data, status, error } = useSWRImmutable(
    account && isActive ? [account, block, "votingPower"] : null,
    async () => {
      const blockNumber = block || (await simpleRpcProvider.getBlockNumber());
      const eligiblePools = await getActivePools(blockNumber);
      //@ts-ignore
      const poolAddresses = eligiblePools.map(({ contractAddress }) => getAddress(contractAddress));
      const { cakeBalance, cakeBnbLpBalance, cakePoolBalance, total, poolsBalance, cakeVaultBalance, ifoPoolBalance } =
        await getVotingPower(account as string, poolAddresses, blockNumber);
      return {
        cakeBalance,
        cakeBnbLpBalance,
        cakePoolBalance,
        poolsBalance,
        cakeVaultBalance,
        ifoPoolBalance,
        total,
      };
    },
  );
  if (error) console.error(error);

  return { ...data, isLoading: status !== FetchStatus.Fetched, isError: status === FetchStatus.Failed };
};

export default useGetVotingPower;
