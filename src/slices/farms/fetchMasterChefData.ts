import chunk from "lodash/chunk";
import masterchefABI from "src/config/abi/masterchef.json";
import { Call, multicallv2 } from "src/utils/multicall";

import { SerializedFarmConfig } from "../../constants/types";
import { getMasterChefAddress } from "../../utils/addressHelpers";
import { getMasterchefContract } from "../../utils/contractHelpers";
import { SerializedFarm } from "../types";

const masterChefAddress = getMasterChefAddress();
const masterChefContract = getMasterchefContract();

export const fetchMasterChefFarmPoolLength = async () => {
  const poolLength = await masterChefContract.poolLength();
  return poolLength;
};

const masterChefFarmCalls = (farm: SerializedFarm) => {
  const { pid } = farm;
  return pid || pid === 0
    ? [
        {
          address: masterChefAddress,
          name: "poolInfo",
          params: [pid],
        },
        {
          address: masterChefAddress,
          name: "totalRegularAllocPoint",
        },
      ]
    : [null, null];
};

export const fetchMasterChefData = async (farms: SerializedFarmConfig[]): Promise<any[]> => {
  const masterChefCalls = farms.map(farm => masterChefFarmCalls(farm));
  const chunkSize = masterChefCalls.flat().length / farms.length;
  const masterChefAggregatedCalls = masterChefCalls
    .filter(masterChefCall => masterChefCall[0] !== null && masterChefCall[1] !== null)
    .flat();
  const masterChefMultiCallResult = await multicallv2(masterchefABI, masterChefAggregatedCalls as Call[]);
  const masterChefChunkedResultRaw = chunk(masterChefMultiCallResult, chunkSize);
  let masterChefChunkedResultCounter = 0;
  return masterChefCalls.map(masterChefCall => {
    if (masterChefCall[0] === null && masterChefCall[1] === null) {
      return [null, null];
    }
    const data = masterChefChunkedResultRaw[masterChefChunkedResultCounter];
    masterChefChunkedResultCounter++;
    return data;
  });
};
