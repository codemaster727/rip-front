import { DerivedOrderInfo, useDerivedOrderInfo, useOrderState } from "../../slices/limitOrders/hooks";
import { OrderState } from "../../slices/limitOrders/types";
import useGelatoLimitOrdersHandlers, { GelatoLimitOrdersHandlers } from "./useGelatoLimitOrdersHandlers";

const useGelatoLimitOrders = (): {
  handlers: GelatoLimitOrdersHandlers;
  derivedOrderInfo: DerivedOrderInfo;
  orderState: OrderState;
} => {
  const derivedOrderInfo = useDerivedOrderInfo();

  const orderState = useOrderState();

  const handlers = useGelatoLimitOrdersHandlers();

  return {
    handlers,
    derivedOrderInfo,
    orderState,
  };
};

export default useGelatoLimitOrders;
