import { Order } from "@gelatonetwork/limit-orders-lib";
import { Currency, CurrencyAmount, Price, Token, TokenAmount } from "@pancakeswap/sdk";
import { useMemo } from "react";
// import useActiveWeb3React from '../../../hooks/useActiveWeb3React'
import { useWeb3Context } from "src/hooks";

import useGelatoLimitOrdersLib from "../../../hooks/limitOrders/useGelatoLimitOrdersLib";
import { useCurrency } from "../../../hooks/Tokens";
import { useIsTransactionPending } from "../../../slices/transactions/hooks";
import { getBscScanLink } from "../../../utils";
import { LimitOrderStatus } from "../types";
import getPriceForOneToken from "../utils/getPriceForOneToken";

export interface FormattedOrderData {
  inputToken: Currency | Token | undefined | null;
  outputToken: Currency | Token | undefined | null;
  inputAmount: string | undefined | null;
  outputAmount: string | undefined | null;
  executionPrice: string | undefined | null;
  invertedExecutionPrice: string | undefined | null;
  isOpen: boolean;
  isCancelled: boolean;
  isExecuted: boolean;
  isSubmissionPending: boolean;
  isCancellationPending: boolean;
  bscScanUrls: {
    created: string;
    executed: string;
    cancelled: string;
  };
}

const formatForDisplay = (amount: CurrencyAmount | Price) => {
  if (!amount) {
    return undefined;
  }
  return parseFloat(amount.toSignificant(18)).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  });
};

// Transforms Gelato Order type into types ready to be displayed in UI
const useFormattedOrderData = (order: Order): FormattedOrderData => {
  const { networkId: chainId } = useWeb3Context();
  const gelatoLibrary = useGelatoLimitOrdersLib();
  const inputToken = useCurrency(order.inputToken);
  const outputToken = useCurrency(order.outputToken);

  const isSubmissionPending = useIsTransactionPending(order.createdTxHash);
  const isCancellationPending = useIsTransactionPending(order.cancelledTxHash ?? undefined);

  const inputAmount = useMemo(() => {
    if (inputToken && order.inputAmount) {
      if (inputToken instanceof Token) {
        return new TokenAmount(inputToken, order.inputAmount);
      }
      return CurrencyAmount.ether(order.inputAmount);
    }
    return undefined;
  }, [inputToken, order.inputAmount]);

  const rawMinReturn = useMemo(
    () =>
      order.adjustedMinReturn
        ? order.adjustedMinReturn
        : gelatoLibrary && chainId && order.minReturn
        ? gelatoLibrary.getAdjustedMinReturn(order.minReturn)
        : undefined,
    [chainId, gelatoLibrary, order.adjustedMinReturn, order.minReturn],
  );

  const outputAmount = useMemo(() => {
    if (outputToken && rawMinReturn) {
      if (outputToken instanceof Token) {
        return new TokenAmount(outputToken, rawMinReturn);
      }
      return CurrencyAmount.ether(rawMinReturn);
    }
    return undefined;
  }, [outputToken, rawMinReturn]);

  const executionPrice = useMemo(
    () => getPriceForOneToken(inputAmount as CurrencyAmount, outputAmount as CurrencyAmount),
    [inputAmount, outputAmount],
  );

  return {
    inputToken,
    outputToken,
    inputAmount: formatForDisplay(inputAmount as CurrencyAmount),
    outputAmount: formatForDisplay(outputAmount as CurrencyAmount),
    executionPrice: formatForDisplay(executionPrice as Price),
    invertedExecutionPrice: formatForDisplay(executionPrice?.invert() as Price),
    isOpen: order.status === LimitOrderStatus.OPEN,
    isCancelled: order.status === LimitOrderStatus.CANCELLED,
    isExecuted: order.status === LimitOrderStatus.EXECUTED,
    isSubmissionPending,
    isCancellationPending,
    bscScanUrls: {
      created: order.createdTxHash ? getBscScanLink(order.createdTxHash, "transaction") : "",
      executed: order.executedTxHash ? getBscScanLink(order.executedTxHash, "transaction") : "",
      cancelled: order.cancelledTxHash ? getBscScanLink(order.cancelledTxHash, "transaction") : "",
    },
  };
};

export default useFormattedOrderData;
