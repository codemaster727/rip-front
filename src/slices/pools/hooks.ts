import { useEffect, useMemo } from "react";
import { batch, useSelector } from "react-redux";
import farmsConfig from "src/constants/farms";
import { useWeb3Context } from "src/hooks";
import { useAppDispatch } from "src/hooks";
import { useFastRefreshEffect, useSlowRefreshEffect } from "src/hooks/useRefreshEffect";

import { fetchFarmsPublicDataAsync } from "../farms";
import { DeserializedPool, VaultKey } from "../types";
import {
  fetchCakeVaultFees,
  fetchCakeVaultPublicData,
  fetchCakeVaultUserData,
  fetchPoolsPublicDataAsync,
  fetchPoolsStakingLimitsAsync,
  fetchPoolsUserDataAsync,
} from ".";
import {
  makePoolWithUserDataLoadingSelector,
  makeVaultPoolByKey,
  poolsWithUserDataLoadingSelector,
  poolsWithVaultSelector,
} from "./selectors";

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch();

  useSlowRefreshEffect(
    currentBlock => {
      const fetchPoolsDataWithFarms = async () => {
        const activeFarms = farmsConfig.filter(farm => farm.pid !== 0);
        await dispatch(fetchFarmsPublicDataAsync(activeFarms.map(farm => farm.pid)));
        batch(() => {
          dispatch(fetchPoolsPublicDataAsync(currentBlock));
          dispatch(fetchPoolsStakingLimitsAsync());
        });
      };

      fetchPoolsDataWithFarms();
    },
    [dispatch],
  );
};

export const useFetchUserPools = (account: any) => {
  const dispatch = useAppDispatch();

  useFastRefreshEffect(() => {
    if (account) {
      //@ts-ignore
      dispatch(fetchPoolsUserDataAsync(account));
    }
  }, [account, dispatch]);
};

export const usePools = (): { pools: DeserializedPool[]; userDataLoaded: boolean } => {
  return useSelector(poolsWithUserDataLoadingSelector);
};

export const usePool = (sousId: number): { pool: DeserializedPool; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId]);
  return useSelector(poolWithUserDataLoadingSelector);
};

export const usePoolsWithVault = () => {
  return useSelector(poolsWithVaultSelector);
};

export const usePoolsPageFetch = () => {
  const { account } = useWeb3Context();
  const dispatch = useAppDispatch();
  useFetchPublicPoolsData();

  useFastRefreshEffect(() => {
    batch(() => {
      dispatch(fetchCakeVaultPublicData());
      if (account) {
        //@ts-ignore
        dispatch(fetchPoolsUserDataAsync(account));
        dispatch(fetchCakeVaultUserData({ account }));
      }
    });
  }, [account, dispatch]);

  useEffect(() => {
    batch(() => {
      dispatch(fetchCakeVaultFees());
    });
  }, [dispatch]);
};

export const useCakeVault = () => {
  return useVaultPoolByKey(VaultKey.CakeVault);
};

export const useVaultPools = () => {
  const cakeVault = useVaultPoolByKey(VaultKey.CakeVault);
  const vaults = useMemo(() => {
    return {
      [VaultKey.CakeVault]: cakeVault,
    };
  }, [cakeVault]);
  return vaults;
};

export const useVaultPoolByKey = (key: VaultKey) => {
  const vaultPoolByKey = useMemo(() => makeVaultPoolByKey(key), [key]);

  return useSelector(vaultPoolByKey);
};
