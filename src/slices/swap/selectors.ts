import get from "lodash/get";

import { AppState } from "../../Root";
import { PairDataTimeWindowEnum } from "./types";

type pairByDataIdSelectorParams = {
  pairId: string;
  timeWindow: PairDataTimeWindowEnum;
};

export const pairByDataIdSelector =
  ({ pairId, timeWindow }: pairByDataIdSelectorParams) =>
  (state: AppState) =>
    get(state, ["swap", "pairDataById", pairId, timeWindow]);

export const derivedPairByDataIdSelector =
  ({ pairId, timeWindow }: pairByDataIdSelectorParams) =>
  (state: AppState) =>
    get(state, ["swap", "derivedPairDataById", pairId, timeWindow]);
