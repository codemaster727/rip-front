import arbitrum from "./assets/arbitrum.png";
import avalanche from "./assets/tokens/AVAX.svg";
import binance from "./assets/tokens/BNB.svg";
import polygon from "./assets/tokens/matic.svg";
import ethereum from "./assets/tokens/wETH.svg";
import { EnvHelper } from "./helpers/Environment";
import { NodeHelper } from "./helpers/NodeHelper";

export enum NetworkId {
  MAINNET = 97,
  TESTNET_RINKEBY = 4,

  BSC = 56,
  BSC_TEST = 97,

  ARBITRUM = 42161,
  ARBITRUM_TESTNET = 421611,

  AVALANCHE = 43114,
  AVALANCHE_TESTNET = 43113,

  POLYGON = 137,
  POLYGON_TESTNET = 80001,

  FANTOM = 250,
  FANTOM_TESTNET = 4002,

  Localhost = 1337,
}

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = {
  [NetworkId.TESTNET_RINKEBY]: {
    DAI_ADDRESS: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C", // duplicate
    RIP_ADDRESS: "0xC0b491daBf3709Ee5Eb79E603D73289Ca6060932",
    STAKING_ADDRESS: "0xC5d3318C0d74a72cD7C55bdf844e24516796BaB2",
    STAKING_HELPER_ADDRESS: "0xf73f23Bb0edCf4719b12ccEa8638355BF33604A1",
    OLD_STAKING_ADDRESS: "0xb640AA9082ad720c60102489b806E665d67DCE32",
    SRIP_ADDRESS: "0x1Fecda1dE7b6951B248C0B62CaeBD5BAbedc2084",
    WSRIP_ADDRESS: "0xe73384f11Bb748Aa0Bc20f7b02958DF573e6E2ad",
    OLD_SRIP_ADDRESS: "0x8Fc4167B0bdA22cb9890af2dB6cB1B818D6068AE",
    MIGRATE_ADDRESS: "0x3BA7C6346b93DA485e97ba55aec28E8eDd3e33E2",
    DISTRIBUTOR_ADDRESS: "0x0626D5aD2a230E05Fb94DF035Abbd97F2f839C3a",
    BONDINGCALC_ADDRESS: "0xaDBE4FA3c2fcf36412D618AfCfC519C869400CEB",
    CIRCULATING_SUPPLY_ADDRESS: "0x5b0AA7903FD2EaA16F1462879B71c3cE2cFfE868",
    TREASURY_ADDRESS: "0x0d722D813601E48b7DAcb2DF9bae282cFd98c6E7",
    REDEEM_HELPER_ADDRESS: "0xBd35d8b2FDc2b720842DB372f5E419d39B24781f",
    PT_TOKEN_ADDRESS: "0x0a2d026bacc573a8b5a2b049f956bdf8e5256cfd", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
    PT_PRIZE_POOL_ADDRESS: "0xf9081132864ed5e4980CFae83bDB122d86619281", // NEW
    PT_PRIZE_STRATEGY_ADDRESS: "0x2Df17EA8D6B68Ec444c9a698315AfB36425dac8b", // NEW
    GIVING_ADDRESS: "0x83D4FE6Ead62547758E094ee5BDb343ADbC2AeB9",
    MOCK_GIVING_ADDRESS: "0xfC93B6fC25D751ef1141EAB01C3f51Ecd484Ba05",
    MOCK_SRIP: "0x22C0b7Dc53a4caa95fEAbb05ea0729995a10D727",
    MIGRATOR_ADDRESS: "0x568c257BF4714864382b643fC8e6Ce5fbBcC6d3C",
    GRIP_ADDRESS: "0xcF2D6893A1CB459fD6B48dC9C41c6110B968611E",
    RIP_V2: "0xd7B98050962ec7cC8D11a83446B3217257C754B7",
    TREASURY_V2: "0x8dd0d811CEFb5CF41528C495E76638B2Ea39d2e6",
    SRIP_V2: "0xebED323CEbe4FfF65F7D7612Ea04313F718E5A75",
    STAKING_V2: "0x06984c3A9EB8e3A8df02A4C09770D5886185792D",
    BOND_DEPOSITORY: "0x9810C5c97C57Ef3F23d9ee06813eF7FD51E13042",
    DAO_TREASURY: "0xee1520f94f304e8d551cbf310fe214212e3ca34a",
  },
  // [NetworkId.MAINNET]: {
  //   DAI_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f", // duplicate
  //   RIP_ADDRESS: "0x383518188c0c6d7730d91b2c03a03c837814a899",
  //   STAKING_ADDRESS: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a", // The new staking contract
  //   STAKING_HELPER_ADDRESS: "0xc8c436271f9a6f10a5b80c8b8ed7d0e8f37a612d", // Helper contract used for Staking only
  //   OLD_STAKING_ADDRESS: "0x0822F3C03dcc24d200AFF33493Dc08d0e1f274A2",
  //   SRIP_ADDRESS: "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F",
  //   WSRIP_ADDRESS: "0xca76543cf381ebbb277be79574059e32108e3e65",
  //   OLD_SRIP_ADDRESS: "0x31932E6e45012476ba3A3A4953cbA62AeE77Fbbe",
  //   PRESALE_ADDRESS: "0xcBb60264fe0AC96B0EFa0145A9709A825afa17D8",
  //   ARIP_ADDRESS: "0x24ecfd535675f36ba1ab9c5d39b50dc097b0792e",
  //   MIGRATE_ADDRESS: "0xC7f56EC779cB9e60afA116d73F3708761197dB3d",
  //   DISTRIBUTOR_ADDRESS: "0xbe731507810C8747C3E01E62c676b1cA6F93242f",
  //   BONDINGCALC_ADDRESS: "0xcaaa6a2d4b26067a391e7b7d65c16bb2d5fa571a",
  //   CIRCULATING_SUPPLY_ADDRESS: "0x0efff9199aa1ac3c3e34e957567c1be8bf295034",
  //   TREASURY_ADDRESS: "0x31f8cc382c9898b273eff4e0b7626a6987c846e8",
  //   REDEEM_HELPER_ADDRESS: "0xE1e83825613DE12E8F0502Da939523558f0B819E",
  //   FUSE_6_SRIP: "0x59bd6774c22486d9f4fab2d448dce4f892a9ae25", // Tetranode's Locker
  //   FUSE_18_SRIP: "0x6eDa4b59BaC787933A4A21b65672539ceF6ec97b", // RIPProtocol Pool Party
  //   FUSE_36_SRIP: "0x252d447c54F33e033AD04048baEAdE7628cB1274", // Fraximalist Money Market
  //   PT_TOKEN_ADDRESS: "0x0E930b8610229D74Da0A174626138Deb732cE6e9", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
  //   PT_PRIZE_POOL_ADDRESS: "0xEaB695A8F5a44f583003A8bC97d677880D528248", // NEW
  //   PT_PRIZE_STRATEGY_ADDRESS: "0xf3d253257167c935f8C62A02AEaeBB24c9c5012a", // NEW
  //   ZAPPER_POOL_V1: "0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f",
  //   BONDINGCALC_V2: "0x7b1a5649145143F4faD8504712ca9c614c3dA2Ae",
  //   MIGRATOR_ADDRESS: "0x184f3FAd8618a6F458C16bae63F70C426fE784B3",
  //   GRIP_ADDRESS: "0x0ab87046fBb341D058F17CBC4c1133F25a20a52f",
  //   RIP_V2: "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
  //   TREASURY_V2: "0x9a315bdf513367c0377fb36545857d12e85813ef",
  //   SRIP_V2: "0x04906695D6D12CF5459975d7C3C03356E4Ccd460",
  //   STAKING_V2: "0xB63cac384247597756545b500253ff8E607a8020",
  //   FIATDAO_WSRIP_ADDRESS: "0xe98ae8cD25CDC06562c29231Db339d17D02Fd486",
  //   GIVING_ADDRESS: "0x2604170762A1dD22BB4F96C963043Cd4FC358f18",
  //   BOND_DEPOSITORY: "0x9025046c6fb25Fb39e720d97a8FD881ED69a1Ef6", // updated
  //   DAO_TREASURY: "0x245cc372C84B3645Bf0Ffe6538620B04a217988B",
  //   TOKEMAK_GRIP: "0x41f6a95bacf9bc43704c4a4902ba5473a8b00263",
  //   ZAP: "0x6F5CC3EDEa92AB52b75bad50Bcf4C6daa781B87e",
  // },
  [NetworkId.MAINNET]: {
    DAI_ADDRESS: "0x369c2333139dbB15c612F46ef8513F0768F31864", // duplicate
    RIP_ADDRESS: "",
    STAKING_ADDRESS: "", // The new staking contract
    STAKING_HELPER_ADDRESS: "0xb8117237Cc4C86999de428BeBfe1eD00eC462560", // Helper contract used for Staking only
    OLD_STAKING_ADDRESS: "",
    SRIP_ADDRESS: "",
    OLD_SRIP_ADDRESS: "",
    PRESALE_ADDRESS: "0xcBb60264fe0AC96B0EFa0145A9709A825afa17D8",
    // ARIP_ADDRESS: "",
    MIGRATE_ADDRESS: "", // aRIPMigration
    DISTRIBUTOR_ADDRESS: "0xA481cE329Ed8131F247C4923B21444646d9420B6",
    BONDINGCALC_ADDRESS: "0xa4d66791a70Af486aD4A2d1d6D8db4603188189E",
    // CIRCULATING_SUPPLY_ADDRESS: "",
    TREASURY_ADDRESS: "",
    REDEEM_HELPER_ADDRESS: "0x41E8Fd0661f7982Ea7a330D899a1149D3502734A",
    // FUSE_6_SRIP: "", // Tetranode's Locker
    // FUSE_18_SRIP: "", // RIPProtocol Pool Party
    // FUSE_36_SRIP: "", // Fraximalist Money Market
    // PT_TOKEN_ADDRESS: "", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
    // PT_PRIZE_POOL_ADDRESS: "", // NEW
    // PT_PRIZE_STRATEGY_ADDRESS: "", // NEW
    // ZAPPER_POOL_V1: "",
    BONDINGCALC_V2: "0xa4d66791a70Af486aD4A2d1d6D8db4603188189E",
    MIGRATOR_ADDRESS: "",
    GRIP_ADDRESS: "0x964fA59d357FD5Df3D8242fb05DcF6D6BeC619B2",
    RIP_V2: "0x1a0100f25CF16488069b40d932e902865B8a4Fa0",
    TREASURY_V2: "0xa0c31D96eec78833AfFdc194F5dCF667EBEB1571",
    SRIP_V2: "0x9E6090ae108502f9caB0466D40225309dCE6C04c",
    STAKING_V2: "0x622b873DF7E55310fad8064C4f0a0f3037b39A7a",
    // FIATDAO_WSRIP_ADDRESS: "",
    GIVING_ADDRESS: "0x6812Aa7B321bEED74E965cd306D2c40986c83b3C",
    BOND_DEPOSITORY: "0xA2d3A2A24709F876243aDDC837dcCbBeaee28910", // updated
    DAO_TREASURY: "0x0fbd6e14566A30906Bc0c927a75b1498aE87Fd43",
    // TOKEMAK_GRIP: "",
    ZAP: "0xf27D1dEc9224Fa03ed1E2D2DCD963B81C1473869",
  },
  // [NetworkId.ARBITRUM]: {
  //   DAI_ADDRESS: "", // duplicate
  //   RIP_ADDRESS: "",
  //   STAKING_ADDRESS: "", // The new staking contract
  //   STAKING_HELPER_ADDRESS: "", // Helper contract used for Staking only
  //   OLD_STAKING_ADDRESS: "",
  //   SRIP_ADDRESS: "",
  //   OLD_SRIP_ADDRESS: "",
  //   PRESALE_ADDRESS: "",
  //   ARIP_ADDRESS: "",
  //   MIGRATE_ADDRESS: "",
  //   DISTRIBUTOR_ADDRESS: "",
  //   BONDINGCALC_ADDRESS: "",
  //   CIRCULATING_SUPPLY_ADDRESS: "",
  //   TREASURY_ADDRESS: "",
  //   WSRIP_ADDRESS: "0x739ca6D71365a08f584c8FC4e1029045Fa8ABC4B",
  //   MIGRATOR_ADDRESS: "0x1e7902a8b0adbf81042b5e30bdfa281f0b928d6d", // good
  //   GRIP_ADDRESS: "0x8D9bA570D6cb60C7e3e0F31343Efe75AB8E65FB1", // good
  //   REDEEM_HELPER_ADDRESS: "",
  // }, // TODO: Replace with Arbitrum contract addresses when ready
  // [NetworkId.ARBITRUM_TESTNET]: {
  //   DAI_ADDRESS: "",
  //   RIP_ADDRESS: "",
  //   STAKING_ADDRESS: "",
  //   STAKING_HELPER_ADDRESS: "",
  //   OLD_STAKING_ADDRESS: "",
  //   SRIP_ADDRESS: "",
  //   OLD_SRIP_ADDRESS: "",
  //   PRESALE_ADDRESS: "",
  //   ARIP_ADDRESS: "",
  //   MIGRATE_ADDRESS: "",
  //   DISTRIBUTOR_ADDRESS: "",
  //   BONDINGCALC_ADDRESS: "",
  //   CIRCULATING_SUPPLY_ADDRESS: "",
  //   TREASURY_ADDRESS: "",
  //   REDEEM_HELPER_ADDRESS: "",
  //   WSRIP_ADDRESS: "0x3DE0150338BDeE175a8EAc6fBbBF2c55279454d5",
  //   MIGRATOR_ADDRESS: "0xde9518c8444Fa436704Fbd9db27B3910bca9F532",
  //   GRIP_ADDRESS: "0x950c3626B9E9798aA1a4832cEee603ECfb7741a8",
  // },
  // [NetworkId.AVALANCHE_TESTNET]: {
  //   DAI_ADDRESS: "",
  //   RIP_ADDRESS: "",
  //   STAKING_ADDRESS: "",
  //   STAKING_HELPER_ADDRESS: "",
  //   OLD_STAKING_ADDRESS: "",
  //   SRIP_ADDRESS: "",
  //   OLD_SRIP_ADDRESS: "",
  //   PRESALE_ADDRESS: "",
  //   ARIP_ADDRESS: "",
  //   MIGRATE_ADDRESS: "",
  //   DISTRIBUTOR_ADDRESS: "",
  //   BONDINGCALC_ADDRESS: "",
  //   CIRCULATING_SUPPLY_ADDRESS: "",
  //   TREASURY_ADDRESS: "",
  //   PICKLE_RIP_LUSD_ADDRESS: "",
  //   REDEEM_HELPER_ADDRESS: "",
  //   WSRIP_ADDRESS: "0x8e8ffc8d41Ee4A915A1FB3940b1beAB0c2Cd5bB0",
  //   GRIP_ADDRESS: "0x115E5979435c89eF38fB87C2D7Fc3BCA09053c54",
  //   MIGRATOR_ADDRESS: "0x9050D25977F8A19CDD5599A28bC5f55d39fb6105",
  // },
  // [NetworkId.AVALANCHE]: {
  //   DAI_ADDRESS: "",
  //   RIP_ADDRESS: "",
  //   // STAKING_ADDRESS: "", // The new staking contract
  //   STAKING_HELPER_ADDRESS: "", // Helper contract used for Staking only
  //   OLD_STAKING_ADDRESS: "",
  //   SRIP_ADDRESS: "",
  //   OLD_SRIP_ADDRESS: "",
  //   PRESALE_ADDRESS: "",
  //   ARIP_ADDRESS: "",
  //   MIGRATE_ADDRESS: "",
  //   DISTRIBUTOR_ADDRESS: "",
  //   BONDINGCALC_ADDRESS: "",
  //   CIRCULATING_SUPPLY_ADDRESS: "",
  //   TREASURY_ADDRESS: "",
  //   PICKLE_RIP_LUSD_ADDRESS: "",
  //   REDEEM_HELPER_ADDRESS: "",
  //   WSRIP_ADDRESS: "0x8cd309e14575203535ef120b5b0ab4dded0c2073",
  //   GRIP_ADDRESS: "0x321e7092a180bb43555132ec53aaa65a5bf84251",
  //   MIGRATOR_ADDRESS: "0xB10209BFbb37d38EC1B5F0c964e489564e223ea7",
  // }, // TODO: Avalanche Mainnet addresses
  // [NetworkId.POLYGON]: {
  //   GRIP_ADDRESS: "0xd8cA34fd379d9ca3C6Ee3b3905678320F5b45195",
  // },
  // [NetworkId.FANTOM]: {
  //   GRIP_ADDRESS: "0x91fa20244fb509e8289ca630e5db3e9166233fdc",
  // },
};

/**
 * Network details required to add a network to a user's wallet, as defined in EIP-3085 (https://eips.ethereum.org/EIPS/eip-3085)
 */

interface INativeCurrency {
  name: string;
  symbol: string;
  decimals?: number;
}

interface INetwork {
  chainName: string;
  chainId: number;
  nativeCurrency: INativeCurrency;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  image: SVGImageElement | string;
  imageAltText: string;
  uri: () => string;
}

// These networks will be available for users to select. Other networks may be functional
// (e.g. testnets, or mainnets being prepared for launch) but need to be selected directly via the wallet.
export const USER_SELECTABLE_NETWORKS = [
  NetworkId.MAINNET,
  NetworkId.BSC,
  NetworkId.BSC_TEST,
  // NetworkId.ARBITRUM,
  // NetworkId.AVALANCHE
];

// Set this to the chain number of the most recently added network in order to enable the 'Now supporting X network'
// message in the UI. Set to -1 if we don't want to display the message at the current time.
export const NEWEST_NETWORK_ID = NetworkId.AVALANCHE;

export const NETWORKS: { [key: number]: INetwork } = {
  // [NetworkId.MAINNET]: {
  //   chainName: "Ethereum",
  //   chainId: 1,
  //   nativeCurrency: {
  //     name: "Ethereum",
  //     symbol: "ETH",
  //     decimals: 18,
  //   },
  //   rpcUrls: [""],
  //   blockExplorerUrls: ["https://etherscan.io/#/"],
  //   image: ethereum,
  //   imageAltText: "Ethereum Logo",
  //   uri: () => NodeHelper.getMainnetURI(NetworkId.MAINNET),
  // },
  [NetworkId.TESTNET_RINKEBY]: {
    chainName: "Rinkeby Testnet",
    chainId: 4,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [""],
    blockExplorerUrls: ["https://rinkeby.etherscan.io/#/"],
    image: ethereum,
    imageAltText: "Ethereum Logo",
    uri: () => NodeHelper.getMainnetURI(NetworkId.TESTNET_RINKEBY),
  },
  [NetworkId.BSC]: {
    chainName: "Binance",
    chainId: 56,
    nativeCurrency: {
      name: "Binance",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://speedy-nodes-nyc.moralis.io/9f1fe98d210bc4fca911bee2/bsc/mainnet/archive"],
    blockExplorerUrls: ["https://bscscan.com/"],
    image: binance,
    imageAltText: "Binance Logo",
    uri: () => NodeHelper.getMainnetURI(NetworkId.BSC),
  },
  [NetworkId.MAINNET]: {
    chainName: "Binance Test",
    chainId: 97,
    nativeCurrency: {
      name: "Binance",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
    blockExplorerUrls: ["https://testnet.bscscan.com/"],
    image: binance,
    imageAltText: "Binance Logo",
    uri: () => NodeHelper.getMainnetURI(NetworkId.BSC_TEST),
  },
  [NetworkId.ARBITRUM]: {
    chainName: "Arbitrum",
    chainId: 42161,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://explorer.arbitrum.io/#/"],
    image: arbitrum,
    imageAltText: "Arbitrum Logo",
    uri: () => NodeHelper.getMainnetURI(NetworkId.ARBITRUM),
  },
  [NetworkId.ARBITRUM_TESTNET]: {
    chainName: "Arbitrum Testnet",
    chainId: 421611,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rinkeby.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://rinkeby-explorer.arbitrum.io/#/"],
    image: arbitrum,
    imageAltText: "Arbitrum Logo",
    uri: () => EnvHelper.alchemyArbitrumTestnetURI,
  },
  [NetworkId.AVALANCHE_TESTNET]: {
    chainName: "Avalanche Fuji Testnet",
    chainId: 43113,
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://testnet.snowtrace.io/#/"],
    image: avalanche,
    imageAltText: "Avalanche Logo",
    uri: () => EnvHelper.alchemyAvalancheTestnetURI,
  },
  [NetworkId.AVALANCHE]: {
    chainName: "Avalanche",
    chainId: 43114,
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
    image: avalanche,
    imageAltText: "Avalanche Logo",
    uri: () => NodeHelper.getMainnetURI(NetworkId.AVALANCHE),
  },
  [NetworkId.POLYGON]: {
    chainName: "Polygon",
    chainId: 137,
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com/"],
    image: polygon,
    imageAltText: "Polygon Logo",
    uri: () => NodeHelper.getMainnetURI(NetworkId.POLYGON),
  },
  [NetworkId.POLYGON_TESTNET]: {
    chainName: "Polygon Mumbai Testnet",
    chainId: 80001,
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    image: polygon,
    imageAltText: "Polygon Logo",
    uri: () => "", // NodeHelper.getMainnetURI(NetworkId.POLYGON_TESTNET),
  },
};

// VIEWS FOR NETWORK is used to denote which paths should be viewable on each network
// ... attempting to prevent contract calls that can't complete & prevent user's from getting
// ... stuck on the wrong view

interface IViewsForNetwork {
  dashboard: boolean;
  stake: boolean;
  wrap: boolean;
  zap: boolean;
  threeTogether: boolean;
  bonds: boolean;
  network: boolean;
  bondsV2: boolean;
}

export const VIEWS_FOR_NETWORK: { [key: number]: IViewsForNetwork } = {
  [NetworkId.MAINNET]: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: true,
    threeTogether: true,
    bonds: true,
    network: true,
    bondsV2: true,
  },
  [NetworkId.TESTNET_RINKEBY]: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: true,
    threeTogether: true,
    bonds: true,
    network: true,
    bondsV2: true,
  },
  [NetworkId.BSC]: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: true,
    threeTogether: true,
    bonds: true,
    network: true,
    bondsV2: true,
  },
  [NetworkId.BSC_TEST]: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: true,
    threeTogether: true,
    bonds: true,
    network: true,
    bondsV2: true,
  },
  // [NetworkId.ARBITRUM]: {
  //   dashboard: true,
  //   stake: false,
  //   wrap: true,
  //   zap: false,
  //   threeTogether: false,
  //   bonds: false,
  //   network: true,
  //   bondsV2: false,
  // },
  // [NetworkId.ARBITRUM_TESTNET]: {
  //   dashboard: true,
  //   stake: false,
  //   wrap: true,
  //   zap: false,
  //   threeTogether: false,
  //   bonds: false,
  //   network: true,
  //   bondsV2: false,
  // },
  // [NetworkId.AVALANCHE]: {
  //   dashboard: true,
  //   stake: false,
  //   wrap: true,
  //   zap: false,
  //   threeTogether: false,
  //   bonds: false,
  //   network: true,
  //   bondsV2: false,
  // },
  // [NetworkId.AVALANCHE_TESTNET]: {
  //   dashboard: true,
  //   stake: false,
  //   wrap: true,
  //   zap: false,
  //   threeTogether: false,
  //   bonds: false,
  //   network: true,
  //   bondsV2: false,
  // },
};
