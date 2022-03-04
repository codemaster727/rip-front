import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { NodeHelper } from "src/helpers/NodeHelper";
import { RootState } from "src/store";

import { abi as sRIPv2 } from "../abi/sRipv2.json";
import { addresses, NetworkId } from "../constants";
import { getMarketPrice, getTokenPrice, setAll } from "../helpers";
import apollo from "../lib/apolloClient";
import { RIPProtocolStaking__factory, RIPProtocolStakingv2__factory, SRipv2 } from "../typechain";
import { IBaseAsyncThunk } from "./interfaces";

interface IProtocolMetrics {
  readonly timestamp: string;
  readonly ripCirculatingSupply: string;
  readonly sRipCirculatingSupply: string;
  readonly totalSupply: string;
  readonly ripPrice: string;
  readonly marketCap: string;
  readonly totalValueLocked: string;
  readonly treasuryMarketValue: string;
  readonly nextEpochRebase: string;
  readonly nextDistributedRip: string;
}

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    const protocolMetricsQuery = `
      query {
        _meta {
          block {
            number
          }
        }
        protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
          timestamp
          ohmCirculatingSupply
          sOhmCirculatingSupply
          totalSupply
          ohmPrice
          marketCap
          totalValueLocked
          treasuryMarketValue
          nextEpochRebase
          nextDistributedOhm
        }
      }
    `;

    if (networkID !== NetworkId.MAINNET) {
      console.log("network is wrong, not bsctest!", networkID);
      provider = NodeHelper.getMainnetStaticProvider();
      networkID = NetworkId.MAINNET;
    }
    const graphData = await apollo<{ protocolMetrics: IProtocolMetrics[] }>(protocolMetricsQuery);

    if (!graphData || graphData == null) {
      console.error("Returned a null response when querying TheGraph");
      return;
    }

    const stakingTVL = parseFloat(graphData.data.protocolMetrics[0].totalValueLocked);
    // NOTE (appleseed): marketPrice from Graph was delayed, so get CoinGecko price
    // const marketPrice = parseFloat(graphData.data.protocolMetrics[0].ripPrice);
    let marketPrice;
    try {
      const originalPromiseResult = await dispatch(
        loadMarketPrice({ networkID: networkID, provider: provider }),
      ).unwrap();
      marketPrice = originalPromiseResult?.marketPrice;
    } catch (rejectedValueOrSerializedError) {
      // handle error here
      console.error("Returned a null response from dispatch(loadMarketPrice)");
      return;
    }

    const marketCap = parseFloat(graphData.data.protocolMetrics[0].marketCap);
    const circSupply = parseFloat(graphData.data.protocolMetrics[0].ripCirculatingSupply);
    const totalSupply = parseFloat(graphData.data.protocolMetrics[0].totalSupply);
    const treasuryMarketValue = parseFloat(graphData.data.protocolMetrics[0].treasuryMarketValue);
    // const currentBlock = parseFloat(graphData.data._meta.block.number);

    if (!provider) {
      console.error("failed to connect to provider, please connect your wallet");
      return {
        stakingTVL,
        marketPrice,
        marketCap,
        circSupply,
        totalSupply,
        treasuryMarketValue,
      } as IAppData;
    }
    const currentBlock = await provider.getBlockNumber();
    console.log("here1", networkID);
    const stakingContract = RIPProtocolStakingv2__factory.connect(addresses[networkID].STAKING_V2, provider);
    const stakingContractV1 = RIPProtocolStaking__factory.connect(addresses[networkID].STAKING_ADDRESS, provider);
    const sripMainContract = new ethers.Contract(addresses[networkID].SRIP_V2 as string, sRIPv2, provider) as SRipv2;
    // Calculating staking
    const epoch = await stakingContract.epoch();
    console.log(epoch);
    console.log(stakingContract);
    // console.log(await stakingContract.secondsToNextEpoch());
    let secondsToEpoch;
    try {
      secondsToEpoch = await stakingContract.secondsToNextEpoch();
    } catch (error) {
      secondsToEpoch = 0;
      console.log(error);
    }
    console.log(secondsToEpoch);
    const stakingReward = epoch.distribute;
    const circ = await sripMainContract.circulatingSupply();
    const stakingRebase = Number(circ.toString()).valueOf()
      ? Number(stakingReward.toString()) / Number(circ.toString())
      : Number("0");
    console.log(circ);
    console.log(stakingReward);
    console.log(stakingRebase);
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;
    // Current index
    const currentIndex = await stakingContract.index();
    const currentIndexV1 = await stakingContractV1.index();
    return {
      currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
      currentIndexV1: ethers.utils.formatUnits(currentIndexV1, "gwei"),
      currentBlock,
      fiveDayRate,
      stakingAPY,
      stakingTVL,
      stakingRebase,
      marketCap,
      marketPrice,
      circSupply,
      totalSupply,
      treasuryMarketValue,
      secondsToEpoch,
    } as IAppData;
  },
);

/**
 * checks if app.slice has marketPrice already
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ networkID: networkID, provider: provider }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk(
  "app/findOrLoadMarketPrice",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState();
    let marketPrice;
    // check if we already have loaded market price
    if (state.app.loadingMarketPrice === false && state.app.marketPrice) {
      // go get marketPrice from app.state
      marketPrice = state.app.marketPrice;
    } else {
      // we don't have marketPrice in app.state, so go get it
      try {
        const originalPromiseResult = await dispatch(
          loadMarketPrice({ networkID: networkID, provider: provider }),
        ).unwrap();
        marketPrice = originalPromiseResult?.marketPrice;
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.error("Returned a null response from dispatch(loadMarketPrice)");
        return;
      }
    }
    return { marketPrice };
  },
);

/**
 * - fetches the RIP price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from rip-dai contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async ({ networkID, provider }: IBaseAsyncThunk) => {
  let marketPrice: number;
  try {
    // only get marketPrice from eth mainnet
    marketPrice = await getMarketPrice();
    // v1MarketPrice = await getV1MarketPrice();
  } catch (e) {
    marketPrice = await getTokenPrice("olympus");
  }
  return { marketPrice };
});

export interface IAppData {
  readonly circSupply?: number;
  readonly currentIndex?: string;
  readonly currentIndexV1?: string;
  readonly currentBlock?: number;
  readonly fiveDayRate?: number;
  readonly loading: boolean;
  readonly loadingMarketPrice: boolean;
  readonly marketCap?: number;
  readonly marketPrice?: number;
  readonly stakingAPY?: number;
  readonly stakingRebase?: number;
  readonly stakingTVL?: number;
  readonly totalSupply?: number;
  readonly treasuryBalance?: number;
  readonly treasuryMarketValue?: number;
  readonly secondsToEpoch?: number;
}

const initialState: IAppData = {
  loading: false,
  loadingMarketPrice: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadMarketPrice.pending, (state, action) => {
        state.loadingMarketPrice = true;
      })
      .addCase(loadMarketPrice.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingMarketPrice = false;
      })
      .addCase(loadMarketPrice.rejected, (state, { error }) => {
        state.loadingMarketPrice = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
