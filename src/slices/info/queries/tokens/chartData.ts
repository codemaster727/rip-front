import { gql } from "graphql-request";
import { PCS_V2_START } from "src/constants/info";
import { ChartEntry } from "src/slices/info/types";
import { infoClient } from "src/utils/graphql";

import { fetchChartData, mapDayData } from "../helpers";
import { TokenDayDatasResponse } from "../types";

const getTokenChartData = async (skip: number, address: string): Promise<{ data?: ChartEntry[]; error: boolean }> => {
  try {
    const query = gql`
      query tokenDayDatas($startTime: Int!, $skip: Int!, $address: Bytes!) {
        tokenDayDatas(
          first: 1000
          skip: $skip
          where: { token: $address, date_gt: $startTime }
          orderBy: date
          orderDirection: asc
        ) {
          date
          dailyVolumeUSD
          totalLiquidityUSD
        }
      }
    `;
    const { tokenDayDatas } = await infoClient.request<TokenDayDatasResponse>(query, {
      startTime: PCS_V2_START,
      skip,
      address,
    });
    const data = tokenDayDatas.map(mapDayData);
    return { data, error: false };
  } catch (error) {
    console.error("Failed to fetch token chart data", error);
    return { error: true };
  }
};

const fetchTokenChartData = async (address: string): Promise<{ data?: ChartEntry[]; error: boolean }> => {
  return fetchChartData(getTokenChartData, address);
};

export default fetchTokenChartData;
