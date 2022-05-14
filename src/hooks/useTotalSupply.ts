import { BigNumber } from "@ethersproject/bignumber";
import { Token, TokenAmount } from "@pancakeswap/sdk";

import { useSingleCallResult } from "../slices/multicall/hooks";
import { useTokenContract } from "./useContract";

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
function useTotalSupply(token?: Token): TokenAmount | undefined {
  const contract = useTokenContract(token?.address as string, false);

  const totalSupply: BigNumber = useSingleCallResult(contract, "totalSupply")?.result?.[0];

  return token && totalSupply ? new TokenAmount(token, totalSupply.toString()) : undefined;
}

export default useTotalSupply;
