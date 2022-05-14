import { useEffect, useMemo } from "react";
import usePoolDatas from "src/slices/info/queries/pools/poolData";
import useTopPoolAddresses from "src/slices/info/queries/pools/topPools";
import useFetchGlobalChartData from "src/slices/info/queries/protocol/chart";
import useFetchProtocolData from "src/slices/info/queries/protocol/overview";
import fetchTopTransactions from "src/slices/info/queries/protocol/transactions";
import useFetchedTokenDatas from "src/slices/info/queries/tokens/tokenData";
import useTopTokenAddresses from "src/slices/info/queries/tokens/topTokens";

import {
  useAddPoolKeys,
  useAddTokenKeys,
  useAllPoolData,
  useAllTokenData,
  useProtocolChartData,
  useProtocolData,
  useProtocolTransactions,
  useUpdatePoolData,
  useUpdateTokenData,
} from "./hooks";

export const ProtocolUpdater: React.FC = () => {
  const [protocolData, setProtocolData] = useProtocolData();
  const { data: fetchedProtocolData, error } = useFetchProtocolData();

  const [chartData, updateChartData] = useProtocolChartData();
  const { data: fetchedChartData, error: chartError } = useFetchGlobalChartData();

  const [transactions, updateTransactions] = useProtocolTransactions();

  // update overview data if available and not set
  useEffect(() => {
    if (protocolData === undefined && fetchedProtocolData && !error) {
      setProtocolData(fetchedProtocolData);
    }
  }, [error, fetchedProtocolData, protocolData, setProtocolData]);

  // update global chart data if available and not set
  useEffect(() => {
    if (chartData === undefined && fetchedChartData && !chartError) {
      updateChartData(fetchedChartData);
    }
  }, [chartData, chartError, fetchedChartData, updateChartData]);

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchTopTransactions();
      if (data) {
        updateTransactions(data);
      }
    };
    if (!transactions) {
      fetch();
    }
  }, [transactions, updateTransactions]);

  return null;
};

export const PoolUpdater: React.FC = () => {
  const updatePoolData = useUpdatePoolData();
  const addPoolKeys = useAddPoolKeys();

  const allPoolData = useAllPoolData();
  const addresses = useTopPoolAddresses();

  // add top pools on first load
  useEffect(() => {
    if (addresses.length > 0) {
      addPoolKeys(addresses);
    }
  }, [addPoolKeys, addresses]);

  // detect for which addresses we havent loaded pool data yet
  const unfetchedPoolAddresses = useMemo(() => {
    return Object.keys(allPoolData).reduce((accum: string[], address) => {
      const poolData = allPoolData[address];
      if (!poolData.data) {
        accum.push(address);
      }
      return accum;
    }, []);
  }, [allPoolData]);

  // fetch data for unfetched pools and update them
  const { error: poolDataError, data: poolDatas } = usePoolDatas(unfetchedPoolAddresses);
  useEffect(() => {
    if (poolDatas && !poolDataError) {
      updatePoolData(Object.values(poolDatas));
    }
  }, [poolDataError, poolDatas, updatePoolData]);

  return null;
};

export const TokenUpdater = (): null => {
  const updateTokenDatas = useUpdateTokenData();
  const addTokenKeys = useAddTokenKeys();

  const allTokenData = useAllTokenData();
  const addresses = useTopTokenAddresses();

  // add top tokens on first load
  useEffect(() => {
    if (addresses.length > 0) {
      addTokenKeys(addresses);
    }
  }, [addTokenKeys, addresses]);

  // detect for which addresses we havent loaded token data yet
  const unfetchedTokenAddresses = useMemo(() => {
    return Object.keys(allTokenData).reduce((accum: string[], key) => {
      const tokenData = allTokenData[key];
      if (!tokenData.data) {
        accum.push(key);
      }
      return accum;
    }, []);
  }, [allTokenData]);

  // fetch data for unfetched tokens and update them
  const { error: tokenDataError, data: tokenDatas } = useFetchedTokenDatas(unfetchedTokenAddresses);
  useEffect(() => {
    if (tokenDatas && !tokenDataError) {
      updateTokenDatas(Object.values(tokenDatas));
    }
  }, [tokenDataError, tokenDatas, updateTokenDatas]);

  return null;
};
