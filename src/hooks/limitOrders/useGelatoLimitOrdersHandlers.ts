import { TransactionResponse } from "@ethersproject/abstract-provider";
import { BigNumber } from "@ethersproject/bignumber";
import { Overrides } from "@ethersproject/contracts";
import { Order } from "@gelatonetwork/limit-orders-lib";
import { Currency, Price } from "@pancakeswap/sdk";
import { useCallback } from "react";
import { useSWRConfig } from "swr";

import { useOrderActionHandlers } from "../../slices/limitOrders/hooks";
import { Field, Rate } from "../../slices/limitOrders/types";
import { useTransactionAdder } from "../../slices/transactions/hooks";
import {
  EXECEUTED_CANCELLED_ORDERS_SWR_KEY,
  OPEN_ORDERS_SWR_KEY,
} from "../../views/LimitOrders/hooks/useGelatoLimitOrdersHistory";
// import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useWeb3Context } from "../web3Context";
import useGelatoLimitOrdersLib from "./useGelatoLimitOrdersLib";

export interface GelatoLimitOrdersHandlers {
  handleLimitOrderSubmission: (orderToSubmit: {
    inputToken: string;
    outputToken: string;
    inputAmount: string;
    outputAmount: string;
    owner: string;
    overrides?: Overrides;
  }) => Promise<TransactionResponse>;
  handleLimitOrderCancellation: (
    order: Order,
    orderDetails?: {
      inputTokenSymbol: string;
      outputTokenSymbol: string;
      inputAmount: string;
      outputAmount: string;
    },
    overrides?: Overrides,
  ) => Promise<TransactionResponse>;
  handleInput: (field: Field, value: string) => void;
  handleCurrencySelection: (field: Field.INPUT | Field.OUTPUT, currency: Currency) => void;
  handleSwitchTokens: () => void;
  handleRateType: (rateType: Rate, price?: Price) => void;
}

const useGelatoLimitOrdersHandlers = (): GelatoLimitOrdersHandlers => {
  const { networkId: chainId, account } = useWeb3Context();

  const { mutate } = useSWRConfig();

  const gelatoLimitOrders = useGelatoLimitOrdersLib();

  const addTransaction = useTransactionAdder();

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRateType } = useOrderActionHandlers();

  const handleLimitOrderSubmission = useCallback(
    async (
      orderToSubmit: {
        inputToken: string;
        outputToken: string;
        inputAmount: string;
        outputAmount: string;
        owner: string;
      },
      overrides?: Overrides,
    ) => {
      if (!gelatoLimitOrders) {
        throw new Error("Could not reach Gelato Limit Orders library");
      }

      if (!chainId) {
        throw new Error("No chainId");
      }

      if (!gelatoLimitOrders?.signer) {
        throw new Error("No signer");
      }

      const { witness, payload, order } = await gelatoLimitOrders.encodeLimitOrderSubmissionWithSecret(
        orderToSubmit.inputToken,
        orderToSubmit.outputToken,
        orderToSubmit.inputAmount,
        orderToSubmit.outputAmount,
        orderToSubmit.owner,
      );

      const tx = await gelatoLimitOrders.signer.sendTransaction({
        ...(overrides ?? {}),
        to: payload.to,
        data: payload.data,
        value: BigNumber.from(payload.value),
      });

      const now = Math.round(Date.now() / 1000);

      addTransaction(tx, {
        summary: `Order submission`,
        type: "limit-order-submission",
        order: {
          ...order,
          createdTxHash: tx?.hash.toLowerCase(),
          witness,
          status: "open",
          updatedAt: now.toString(),
        } as Order,
      });

      mutate(OPEN_ORDERS_SWR_KEY);
      mutate(EXECEUTED_CANCELLED_ORDERS_SWR_KEY);

      return tx;
    },
    [addTransaction, chainId, gelatoLimitOrders, mutate],
  );

  const handleLimitOrderCancellation = useCallback(
    async (
      orderToCancel: Order,
      orderDetails?: {
        inputTokenSymbol: string;
        outputTokenSymbol: string;
        inputAmount: string;
        outputAmount: string;
      },
      overrides?: Overrides,
    ) => {
      if (!gelatoLimitOrders) {
        throw new Error("Could not reach Gelato Limit Orders library");
      }

      if (!chainId) {
        throw new Error("No chainId");
      }

      if (!account) {
        throw new Error("No account");
      }

      const checkIfOrderExists = Boolean(
        orderToCancel.module &&
          orderToCancel.inputToken &&
          orderToCancel.owner &&
          orderToCancel.witness &&
          orderToCancel.data,
      );

      const tx = await gelatoLimitOrders.cancelLimitOrder(
        orderToCancel,
        checkIfOrderExists,
        overrides ?? {
          gasLimit: 2_000_000,
        },
      );

      const now = Math.round(Date.now() / 1000);

      const summary = orderDetails
        ? `Order cancellation: ${orderDetails.inputAmount} ${orderDetails.inputTokenSymbol} for ${orderDetails.outputAmount} ${orderDetails.outputTokenSymbol}`
        : "Order cancellation";

      addTransaction(tx, {
        summary,
        type: "limit-order-cancellation",
        order: {
          ...orderToCancel,
          updatedAt: now.toString(),
          status: "cancelled",
          cancelledTxHash: tx?.hash.toLowerCase(),
        },
      });

      mutate(OPEN_ORDERS_SWR_KEY);
      mutate(EXECEUTED_CANCELLED_ORDERS_SWR_KEY);

      return tx;
    },
    [gelatoLimitOrders, chainId, account, addTransaction, mutate],
  );

  const handleInput = useCallback(
    (field: Field, value: string) => {
      onUserInput(field, value);
    },
    [onUserInput],
  );

  const handleCurrencySelection = useCallback(
    (field: Field.INPUT | Field.OUTPUT, currency: Currency) => {
      onCurrencySelection(field, currency);
    },
    [onCurrencySelection],
  );

  const handleSwitchTokens = useCallback(() => {
    onSwitchTokens();
  }, [onSwitchTokens]);

  const handleRateType = useCallback(
    async (rateType: Rate, price?: Price) => {
      if (rateType === Rate.MUL) {
        if (price) onUserInput(Field.PRICE, price.invert().toSignificant(6));
        onChangeRateType(Rate.DIV);
      } else {
        if (price) onUserInput(Field.PRICE, price.toSignificant(6));
        onChangeRateType(Rate.MUL);
      }
    },
    [onChangeRateType, onUserInput],
  );

  return {
    handleLimitOrderSubmission,
    handleLimitOrderCancellation,
    handleInput,
    handleCurrencySelection,
    handleSwitchTokens,
    handleRateType,
  };
};

export default useGelatoLimitOrdersHandlers;
