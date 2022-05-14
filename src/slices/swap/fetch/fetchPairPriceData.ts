import { infoClient } from "../../../utils/graphql";
import requestWithTimeout from "../../../utils/requestWithTimeout";
import lastPairDayId from "../queries/lastPairDayId";
import lastPairHourId from "../queries/lastPairHourId";
import pairDayDatas from "../queries/pairDayDatas";
import pairDayDatasByIdsQuery from "../queries/pairDayDatasByIdsQuery";
import pairHourDatas from "../queries/pairHourDatas";
import pairHourDatasByIds from "../queries/pairHourDatasByIds";
import { PairDataTimeWindowEnum } from "../types";
import { timeWindowIdsCountMapping } from "./constants";
import {
  fetchPairDataParams,
  LastPairDayIdResponse,
  LastPairHourIdResponse,
  PairDayDatasResponse,
  PairHoursDatasResponse,
} from "./types";
import { getIdsByTimeWindow, getPairSequentialId } from "./utils";

const fetchPairPriceData = async ({ pairId, timeWindow }: fetchPairDataParams) => {
  const client = infoClient;

  try {
    switch (timeWindow) {
      case PairDataTimeWindowEnum.DAY: {
        const data = await requestWithTimeout<PairHoursDatasResponse>(client, pairHourDatas, {
          pairId,
          first: timeWindowIdsCountMapping[timeWindow],
        });
        return { data, error: false };
      }
      case PairDataTimeWindowEnum.WEEK: {
        const lastPairHourIdData = await requestWithTimeout<LastPairHourIdResponse>(client, lastPairHourId, { pairId });
        const lastId = lastPairHourIdData?.pairHourDatas ? lastPairHourIdData.pairHourDatas[0]?.id : null;
        if (!lastId) {
          return { data: { pairHourDatas: [] }, error: false };
        }
        const pairHourId = getPairSequentialId({ id: lastId, pairId });
        const pairHourIds = getIdsByTimeWindow({
          pairAddress: pairId,
          pairLastId: pairHourId,
          timeWindow,
          idsCount: timeWindowIdsCountMapping[timeWindow],
        });

        const pairHoursData = await requestWithTimeout<PairHoursDatasResponse>(client, pairHourDatasByIds, {
          pairIds: pairHourIds,
        });
        return { data: pairHoursData, error: false };
      }
      case PairDataTimeWindowEnum.MONTH: {
        const data = await requestWithTimeout<PairHoursDatasResponse>(client, pairDayDatas, {
          pairId,
          first: timeWindowIdsCountMapping[timeWindow],
        });
        return { data, error: false };
      }
      case PairDataTimeWindowEnum.YEAR: {
        const lastPairDayIdData = await requestWithTimeout<LastPairDayIdResponse>(client, lastPairDayId, { pairId });
        const lastId = lastPairDayIdData?.pairDayDatas ? lastPairDayIdData.pairDayDatas[0]?.id : null;
        if (!lastId) {
          return { data: { pairDayDatas: [] }, error: false };
        }
        const pairLastId = getPairSequentialId({ id: lastId, pairId });
        const pairDayIds = getIdsByTimeWindow({
          pairAddress: pairId,
          pairLastId,
          timeWindow,
          idsCount: timeWindowIdsCountMapping[timeWindow],
        });
        const pairDayData = await requestWithTimeout<PairDayDatasResponse>(client, pairDayDatasByIdsQuery, {
          pairIds: pairDayIds,
        });
        return { data: pairDayData, error: false };
      }
      default:
        return { data: null, error: false };
    }
  } catch (error) {
    console.error("Failed to fetch price chart data", error);
    return { error: true };
  }
};

export default fetchPairPriceData;
