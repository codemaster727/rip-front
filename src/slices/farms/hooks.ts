import { ChainId } from "@pancakeswap/sdk";
import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { farmsConfig } from "src/constants";
import { CHAIN_ID } from "src/constants/networks";
import { useWeb3Context } from "src/hooks";
import { useFastRefreshEffect, useSlowRefreshEffect } from "src/hooks/useRefreshEffect";

import { DeserializedFarm, DeserializedFarmsState, DeserializedFarmUserData, State } from "../types";
import { fetchFarmsPublicDataAsync, fetchFarmUserDataAsync } from ".";
import {
  farmFromLpSymbolSelector,
  farmSelector,
  makeBusdPriceFromPidSelector,
  makeFarmFromPidSelector,
  makeLpTokenPriceFromLpSymbolSelector,
  makeUserFarmFromPidSelector,
  priceCakeFromPidSelector,
} from "./selectors";

export const usePollFarmsWithUserData = () => {
  const dispatch = useDispatch();
  const { account } = useWeb3Context();

  useSlowRefreshEffect(() => {
    const pids = farmsConfig.map(farmToFetch => farmToFetch.pid);

    dispatch(fetchFarmsPublicDataAsync(pids));

    if (account) {
      dispatch(fetchFarmUserDataAsync({ account, pids }));
    }
  }, [dispatch, account]);
};

/**
 * Fetches the "core" farm data used globally
 * 2 = CAKE-BNB LP
 * 3 = BUSD-BNB LP
 */
const coreFarmPIDs = CHAIN_ID === String(ChainId.MAINNET) ? [2, 3] : [1, 2];
export const usePollCoreFarmData = () => {
  const dispatch = useDispatch();

  useFastRefreshEffect(() => {
    dispatch(fetchFarmsPublicDataAsync(coreFarmPIDs));
  }, [dispatch]);
};

export const useFarms = (): DeserializedFarmsState => {
  return useSelector(farmSelector);
};

export const useFarmsPoolLength = (): number => {
  return useSelector((state: State) => state.farms.poolLength ?? 0);
};

export const useFarmFromPid = (pid: number): DeserializedFarm => {
  const farmFromPid = useMemo(() => makeFarmFromPidSelector(pid), [pid]);
  return useSelector(farmFromPid);
};

export const useFarmFromLpSymbol = (lpSymbol: string): DeserializedFarm => {
  const farmFromLpSymbol = useMemo(() => farmFromLpSymbolSelector(lpSymbol), [lpSymbol]);
  return useSelector(farmFromLpSymbol);
};

export const useFarmUser = (pid: number): DeserializedFarmUserData => {
  const farmFromPidUser = useMemo(() => makeUserFarmFromPidSelector(pid), [pid]);
  return useSelector(farmFromPidUser);
};

// Return the base token price for a farm, from a given pid
export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const busdPriceFromPid = useMemo(() => makeBusdPriceFromPidSelector(pid), [pid]);
  return useSelector(busdPriceFromPid);
};

export const useLpTokenPrice = (symbol: string) => {
  const lpTokenPriceFromLpSymbol = useMemo(() => makeLpTokenPriceFromLpSymbolSelector(symbol), [symbol]);
  return useSelector(lpTokenPriceFromLpSymbol);
};

/**
 * @@deprecated use the BUSD hook in /hooks
 */
export const usePriceCakeBusd = (): BigNumber => {
  return useSelector(priceCakeFromPidSelector);
};
