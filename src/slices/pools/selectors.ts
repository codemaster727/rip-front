import { createSelector } from "@reduxjs/toolkit";

import { SerializedPool, State, VaultKey } from "../types";
import { transformLockedVault, transformPool } from "./helpers";
import { initialPoolVaultState } from "./index";

const selectPoolsData = (state: State) => state.pools.data;
const selectPoolData = (sousId: any) => (state: State) => state.pools.data.find(p => p.sousId === sousId);
const selectUserDataLoaded = (state: State) => state.pools.userDataLoaded;
const selectVault = (key: VaultKey) => (state: State) => key ? state.pools[key] : initialPoolVaultState;

export const makePoolWithUserDataLoadingSelector = (sousId: any) =>
  createSelector([selectPoolData(sousId), selectUserDataLoaded], (pool, userDataLoaded) => {
    return { pool: transformPool(pool as SerializedPool), userDataLoaded };
  });

export const poolsWithUserDataLoadingSelector = createSelector(
  [selectPoolsData, selectUserDataLoaded],
  (pools, userDataLoaded) => {
    return { pools: pools.map(transformPool), userDataLoaded };
  },
);

export const makeVaultPoolByKey = (key: any) =>
  createSelector([selectVault(key)], vault => transformLockedVault(vault));

export const poolsWithVaultSelector = createSelector(
  [poolsWithUserDataLoadingSelector, makeVaultPoolByKey(VaultKey.CakeVault)],
  (poolsWithUserDataLoading, deserializedCakeVault) => {
    const { pools, userDataLoaded } = poolsWithUserDataLoading;
    const cakePool = pools.find(pool => !pool.isFinished && pool.sousId === 0);
    const withoutCakePool = pools.filter(pool => pool.sousId !== 0);

    const cakeAutoVault = {
      ...cakePool,
      ...deserializedCakeVault,
      vaultKey: VaultKey.CakeVault,
      userData: { ...cakePool.userData, ...deserializedCakeVault.userData },
    };

    const cakeAutoVaultWithApr = {
      ...cakeAutoVault,
    };
    return { pools: [cakeAutoVaultWithApr, ...withoutCakePool], userDataLoaded };
  },
);
