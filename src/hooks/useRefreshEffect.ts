import { DependencyList, EffectCallback, useEffect } from "react";
import { FAST_INTERVAL, SLOW_INTERVAL } from "src/constants";
import useSWR from "swr";

type BlockEffectCallback = (blockNumber: number) => ReturnType<EffectCallback>;

const EMPTY_ARRAY: any[] = [];

export function useFastRefreshEffect(effect: BlockEffectCallback, deps?: DependencyList) {
  const { data = 0 } = useSWR([FAST_INTERVAL, "blockNumber"]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect.bind(null, data), [data, ...(deps || EMPTY_ARRAY)]);
}

export function useSlowRefreshEffect(effect: BlockEffectCallback, deps?: DependencyList) {
  const { data = 0 } = useSWR([SLOW_INTERVAL, "blockNumber"]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect.bind(null, data), [data, ...(deps || EMPTY_ARRAY)]);
}
