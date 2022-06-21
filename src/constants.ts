// export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/drondin/olympus-protocol-metrics";
export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/alan115-skyhand/rip-rinkeby";
export const EPOCH_INTERVAL = 2200;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 13.14;

export const TOKEN_DECIMALS = 9;

interface IPoolGraphURLS {
  [index: string]: string;
}

export const POOL_GRAPH_URLS: IPoolGraphURLS = {
  4: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  1: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
};

export * from "./networkDetails";
export * from "./helpers/v2BondDetails";

//rip

import { BigNumber } from "@ethersproject/bignumber";
import { ChainId, JSBI, Percent, Token } from "@pancakeswap/sdk";
import { BIG_TEN } from "src/utils/bigNumber";

import { mainnetTokens, testnetTokens } from "./constants/tokens";

export const ROUTER_ADDRESS = {
  [ChainId.MAINNET]: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  [ChainId.TESTNET]: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
};

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.MAINNET]: [
    mainnetTokens.wbnb,
    mainnetTokens.cake,
    mainnetTokens.busd,
    mainnetTokens.usdt,
    mainnetTokens.btcb,
    mainnetTokens.ust,
    mainnetTokens.eth,
    mainnetTokens.usdc,
  ],
  [ChainId.TESTNET]: [testnetTokens.wbnb, testnetTokens.cake, testnetTokens.busd],
};

/**
 * Addittional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {},
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {},
};

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.MAINNET]: [mainnetTokens.busd, mainnetTokens.cake, mainnetTokens.btcb],
  [ChainId.TESTNET]: [testnetTokens.wbnb, testnetTokens.cake, testnetTokens.busd],
};

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.MAINNET]: [mainnetTokens.wbnb, mainnetTokens.dai, mainnetTokens.busd, mainnetTokens.usdt],
  [ChainId.TESTNET]: [testnetTokens.wbnb, testnetTokens.cake, testnetTokens.busd],
};

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [mainnetTokens.cake, mainnetTokens.wbnb],
    [mainnetTokens.busd, mainnetTokens.usdt],
    [mainnetTokens.dai, mainnetTokens.usdt],
  ],
};

export const NetworkContextName = "NETWORK";

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

export const BIG_INT_ZERO = JSBI.BigInt(0);

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE); // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_BNB: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)); // .01 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000));

export const ZERO_PERCENT = new Percent("0");
export const ONE_HUNDRED_PERCENT = new Percent("1");

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  "0x7F367cC41522cE07553e823bf3be79A889DEbe1B",
  "0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b",
  "0x901bb9583b24D97e995513C6778dc6888AB6870e",
  "0xA7e5d5A720f06526557c513402f2e6B5fA20b008",
  "0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C",
];

export { default as farmsConfig } from "./constants/farms";
export { default as poolsConfig } from "./constants/pools";
export { default as ifosConfig } from "./constants/ifo";

export const FAST_INTERVAL = 10000;
export const SLOW_INTERVAL = 60000;

export const NOT_ON_SALE_SELLER = "0x0000000000000000000000000000000000000000";

// Gelato uses this address to define a native currency in all chains
export const GELATO_NATIVE = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
// Handler string is passed to Gelato to use PCS router
export const GELATO_HANDLER = "pancakeswap";
export const GENERIC_GAS_LIMIT_ORDER_EXECUTION = BigNumber.from(500000);

export const EXCHANGE_DOCS_URLS = "https://docs.pancakeswap.finance/products/pancakeswap-exchange";
export const LIMIT_ORDERS_DOCS_URL = "https://docs.pancakeswap.finance/products/pancakeswap-exchange/limit-orders";

// BigNumber.config({
//   EXPONENTIAL_AT: 1000,
//   DECIMAL_PLACES: 80,
// })

export const BSC_BLOCK_TIME = 3;

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: "https://bscscan.com",
  [ChainId.TESTNET]: "https://testnet.bscscan.com",
};

// CAKE_PER_BLOCK details
// 40 CAKE is minted per block
// 20 CAKE per block is sent to Burn pool (A farm just for burning cake)
// 10 CAKE per block goes to CAKE syrup pool
// 9 CAKE per block goes to Yield farms and lottery
// CAKE_PER_BLOCK in config/index.ts = 40 as we only change the amount sent to the burn pool which is effectively a farm.
// CAKE/Block in src/views/Home/components/CakeDataRow.tsx = 15 (40 - Amount sent to burn pool)
export const CAKE_PER_BLOCK = 40;
export const BLOCKS_PER_YEAR = (60 / BSC_BLOCK_TIME) * 60 * 24 * 365; // 10512000
export const CAKE_PER_YEAR = CAKE_PER_BLOCK * BLOCKS_PER_YEAR;
export const BASE_URL = "https://pancakeswap.finance";
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`;
export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[ChainId.MAINNET];
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18);
export const DEFAULT_GAS_LIMIT = 250000;
export const AUCTION_BIDDERS_TO_FETCH = 500;
export const RECLAIM_AUCTIONS_TO_FETCH = 500;
export const AUCTION_WHITELISTED_BIDDERS_TO_FETCH = 500;
export const IPFS_GATEWAY = "https://ipfs.io/ipfs";
