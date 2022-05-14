import { ChainId, Token } from "@pancakeswap/sdk";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import { CHAIN_ID } from "../../../constants/networks";
import { AppState } from "../../../Root";
import { deserializeToken } from "./helpers";

const selectUserTokens = ({ user: { tokens } }: AppState) => tokens;

export const userAddedTokenSelector = createSelector(selectUserTokens, serializedTokensMap =>
  Object.values(serializedTokensMap?.[CHAIN_ID as unknown as ChainId] ?? {}).map(deserializeToken),
);
export default function useUserAddedTokens(): Token[] {
  return useSelector(userAddedTokenSelector);
}
