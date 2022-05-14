import { Contract } from "@ethersproject/contracts";
import { Web3Provider } from "@ethersproject/providers";
import { JSBI, Percent, Router, SwapParameters, Trade, TradeType } from "@pancakeswap/sdk";
import { useMemo } from "react";

import { BIPS_BASE, INITIAL_ALLOWED_SLIPPAGE } from "../constants";
import { getRouterContract } from "../utils";
import useTransactionDeadline from "./useTransactionDeadline";
// import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useWeb3Context } from "./web3Context";

interface SwapCall {
  contract: Contract;
  parameters: SwapParameters;
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
export function useSwapCallArguments(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddress: string | null, // the address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
  const { account, networkId: chainId, provider: library } = useWeb3Context();

  const recipient = recipientAddress === null ? account : recipientAddress;
  const deadline = useTransactionDeadline();

  return useMemo(() => {
    if (!trade || !recipient || !library || !account || !chainId || !deadline) return [];

    const contract = getRouterContract(chainId, library as Web3Provider, account);
    if (!contract) {
      return [];
    }

    const swapMethods = [];

    swapMethods.push(
      Router.swapCallParameters(trade, {
        feeOnTransfer: false,
        allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
        recipient,
        deadline: deadline.toNumber(),
      }),
    );

    if (trade.tradeType === TradeType.EXACT_INPUT) {
      swapMethods.push(
        Router.swapCallParameters(trade, {
          feeOnTransfer: true,
          allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
          recipient,
          deadline: deadline.toNumber(),
        }),
      );
    }

    return swapMethods.map(parameters => ({ parameters, contract }));
  }, [account, allowedSlippage, chainId, deadline, library, recipient, trade]);
}
