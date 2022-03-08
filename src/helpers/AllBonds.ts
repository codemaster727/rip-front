import { BigNumberish } from "ethers";
import { abi as CvxBondContract } from "src/abi/bonds/CvxContract.json";
import { abi as DaiBondContract } from "src/abi/bonds/DaiContract.json";
import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";
import { abi as FraxBondContract } from "src/abi/bonds/FraxContract.json";
import { abi as LusdBondContract } from "src/abi/bonds/LusdContract.json";
import { abi as BondRipDaiContract } from "src/abi/bonds/RipDaiContract.json";
import { abi as BondRipEthContract } from "src/abi/bonds/RipEthContract.json";
import { abi as FraxRipBondContract } from "src/abi/bonds/RipFraxContract.json";
import { abi as BondRipLusdContract } from "src/abi/bonds/RipLusdContract.json";
import { abi as ierc20Abi } from "src/abi/IERC20.json";
import { abi as ReserveRipDaiContract } from "src/abi/reserves/RipDai.json";
import { abi as ReserveRipEthContract } from "src/abi/reserves/RipEth.json";
import { abi as ReserveRipFraxContract } from "src/abi/reserves/RipFrax.json";
import { abi as ReserveRipLusdContract } from "src/abi/reserves/RipLusd.json";
import { addresses, NetworkId } from "src/constants";
import { getTokenPrice } from "src/helpers";
import { getBondCalculator } from "src/helpers/BondCalculator";
import { BondType, CustomBond, LPBond, StableBond } from "src/lib/Bond";

// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond
export const dai = new StableBond({
  name: "dai",
  displayName: "DAI",
  bondToken: "DAI",
  payoutToken: "RIP",
  v2Bond: false,
  bondIconSvg: ["DAI"],
  bondContractABI: DaiBondContract,
  isBondable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  LOLmessage: "Sold Out",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET_RINKEBY]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: "0x575409F8d77c12B05feD8B455815f0e54797381c",
      reserveAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    [NetworkId.TESTNET_RINKEBY]: {
      bondAddress: "0xDea5668E815dAF058e3ecB30F645b04ad26374Cf",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
    },
    [NetworkId.Localhost]: {
      bondAddress: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
      reserveAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    },
    [NetworkId.BSC]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkId.BSC_TEST]: {
      bondAddress: "0xEC9e2EEE75b060856B9518f46283068f3B0FC434",
      reserveAddress: "0x369c2333139dbB15c612F46ef8513F0768F31864",
    },
  },
});

export const fraxOld = new StableBond({
  name: "frax-old",
  displayName: "FRAX OLD",
  bondToken: "FRAX",
  payoutToken: "RIP",
  v2Bond: false,
  bondIconSvg: ["FRAX"],
  bondContractABI: FraxBondContract,
  isBondable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  LOLmessage: "Gone Fishin'",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET_RINKEBY]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: "0x8510c8c2B6891E04864fa196693D44E6B6ec2514",
      reserveAddress: "0x853d955acef822db058eb8505911ed77f175b99e",
    },
    [NetworkId.TESTNET_RINKEBY]: {
      bondAddress: "0xF651283543fB9D61A91f318b78385d187D300738",
      reserveAddress: "0x2F7249cb599139e560f0c81c269Ab9b04799E453",
    },
    [NetworkId.BSC]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkId.BSC_TEST]: {
      bondAddress: "0xEC9e2EEE75b060856B9518f46283068f3B0FC434",
      reserveAddress: "0x369c2333139dbB15c612F46ef8513F0768F31864",
    },
  },
});

export const frax = new StableBond({
  name: "frax",
  displayName: "FRAX",
  bondToken: "FRAX",
  payoutToken: "RIP",
  v2Bond: true,
  bondIconSvg: ["FRAX"],
  bondContractABI: FraxBondContract,
  isBondable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  LOLmessage: "",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: "0xc60a6656e08b62DD2644DC703d7855301363Cc38",
      reserveAddress: "0x853d955acef822db058eb8505911ed77f175b99e",
    },
    [NetworkId.TESTNET_RINKEBY]: {
      bondAddress: "0xF651283543fB9D61A91f318b78385d187D300738",
      reserveAddress: "0x2F7249cb599139e560f0c81c269Ab9b04799E453",
    },
    [NetworkId.Localhost]: {
      bondAddress: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
      reserveAddress: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    },
    [NetworkId.BSC]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkId.BSC_TEST]: {
      bondAddress: "0xEC9e2EEE75b060856B9518f46283068f3B0FC434",
      reserveAddress: "0x369c2333139dbB15c612F46ef8513F0768F31864",
    },
  },
});

export const lusd = new StableBond({
  name: "lusd",
  displayName: "LUSD",
  bondToken: "LUSD",
  payoutToken: "RIP",
  v2Bond: false,
  bondIconSvg: ["LUSD"],
  bondContractABI: LusdBondContract,
  isBondable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  LOLmessage: "",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET_RINKEBY]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: "0x10C0f93f64e3C8D0a1b0f4B87d6155fd9e89D08D",
      reserveAddress: "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
    },
    [NetworkId.TESTNET_RINKEBY]: {
      bondAddress: "0x3aD02C4E4D1234590E87A1f9a73B8E0fd8CF8CCa",
      reserveAddress: "0x45754dF05AA6305114004358eCf8D04FF3B84e26",
    },
    // FIXME
    [NetworkId.Localhost]: {
      bondAddress: "0x3aD02C4E4D1234590E87A1f9a73B8E0fd8CF8CCa",
      reserveAddress: "0x45754dF05AA6305114004358eCf8D04FF3B84e26",
    },
    [NetworkId.BSC]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkId.BSC_TEST]: {
      bondAddress: "0xEC9e2EEE75b060856B9518f46283068f3B0FC434",
      reserveAddress: "0x369c2333139dbB15c612F46ef8513F0768F31864",
    },
  },
});

export const eth = new CustomBond({
  name: "eth",
  displayName: "wETH",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "wETH",
  payoutToken: "RIP",
  v2Bond: false,
  bondIconSvg: ["wETH"],
  bondContractABI: EthBondContract,
  reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  isBondable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  LOLmessage: "Taking a Spa Day",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET_RINKEBY]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: "0xE6295201CD1ff13CeD5f063a5421c39A1D236F1c",
      reserveAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    [NetworkId.TESTNET_RINKEBY]: {
      bondAddress: "0xca7b90f8158A4FAA606952c023596EE6d322bcf0",
      reserveAddress: "0xc778417e063141139fce010982780140aa0cd5ab",
    },
    // FIXME
    [NetworkId.Localhost]: {
      bondAddress: "0xca7b90f8158A4FAA606952c023596EE6d322bcf0",
      reserveAddress: "0xc778417e063141139fce010982780140aa0cd5ab",
    },
    [NetworkId.BSC]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkId.BSC_TEST]: {
      bondAddress: "0xEC9e2EEE75b060856B9518f46283068f3B0FC434",
      reserveAddress: "0x369c2333139dbB15c612F46ef8513F0768F31864",
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, NetworkId, provider) {
    const ethBondContract = this.getContractForBond(NetworkId, provider);
    if (!ethBondContract) return 0;
    let ethPrice: BigNumberish = await ethBondContract.assetPrice();
    ethPrice = Number(ethPrice.toString()) / Math.pow(10, 8);
    const token = this.getContractForReserve(NetworkId, provider);
    let ethAmount: BigNumberish = await token.balanceOf(addresses[NetworkId].TREASURY_ADDRESS);
    ethAmount = Number(ethAmount.toString()) / Math.pow(10, 18);
    return ethAmount * ethPrice;
  },
});

export const cvx = new CustomBond({
  name: "cvx",
  displayName: "CVX",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "CVX",
  payoutToken: "RIP",
  v2Bond: false,
  bondIconSvg: ["CVX"],
  bondContractABI: CvxBondContract,
  reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  isBondable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  LOLmessage: "",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET_RINKEBY]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: "0x767e3459A35419122e5F6274fB1223d75881E0a9",
      reserveAddress: "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B",
    },
    [NetworkId.TESTNET_RINKEBY]: {
      bondAddress: "0xd43940687f6e76056789d00c43A40939b7a559b5",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C", // using DAI per `principal` address
      // reserveAddress: "0x6761Cb314E39082e08e1e697eEa23B6D1A77A34b", // guessed
    },
    [NetworkId.BSC]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkId.BSC_TEST]: {
      bondAddress: "0xEC9e2EEE75b060856B9518f46283068f3B0FC434",
      reserveAddress: "0x369c2333139dbB15c612F46ef8513F0768F31864",
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, NetworkId, provider) {
    const cvxPrice: number = await getTokenPrice("convex-finance");
    const token = this.getContractForReserve(NetworkId, provider);
    let cvxAmount: BigNumberish = await token.balanceOf(addresses[NetworkId].TREASURY_ADDRESS);
    cvxAmount = Number(cvxAmount.toString()) / Math.pow(10, 18);
    return cvxAmount * cvxPrice;
  },
});

// the old convex bonds. Just need to be claimable for the users who previously purchased
export const cvx_expired = new CustomBond({
  name: "cvx-v1",
  displayName: "CVX OLD",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "CVX",
  payoutToken: "RIP",
  v2Bond: false,
  bondIconSvg: ["CVX"],
  bondContractABI: CvxBondContract,
  reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  isBondable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  LOLmessage: "",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET_RINKEBY]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: "0x6754c69fe02178f54ADa19Ebf1C5569826021920",
      reserveAddress: "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B",
    },
    [NetworkId.TESTNET_RINKEBY]: {
      bondAddress: "0xd43940687f6e76056789d00c43A40939b7a559b5",
      reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C", // using DAI per `principal` address
      // reserveAddress: "0x6761Cb314E39082e08e1e697eEa23B6D1A77A34b", // guessed
    },
    // FIXME
    [NetworkId.Localhost]: {
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
    [NetworkId.BSC]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkId.BSC_TEST]: {
      bondAddress: "0xEC9e2EEE75b060856B9518f46283068f3B0FC434",
      reserveAddress: "0x369c2333139dbB15c612F46ef8513F0768F31864",
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, NetworkId, provider) {
    const cvxPrice: number = await getTokenPrice("convex-finance");
    const token = this.getContractForReserve(NetworkId, provider);
    let cvxAmount: BigNumberish = await token.balanceOf(addresses[NetworkId].TREASURY_ADDRESS);
    cvxAmount = Number(cvxAmount.toString()) / Math.pow(10, 18);
    return cvxAmount * cvxPrice;
  },
});

export const rip_dai = new LPBond({
  name: "rip_dai_lp",
  displayName: "RIP-DAI LP",
  bondToken: "DAI",
  payoutToken: "RIP",
  v2Bond: true,
  bondIconSvg: ["OHM", "DAI"],
  bondContractABI: BondRipDaiContract,
  reserveContract: ReserveRipDaiContract,
  isBondable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  LOLmessage: "",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET_RINKEBY]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  networkAddrs: {
    // [NetworkId.MAINNET]: {
    //   // TODO: add correct bond address when it's created
    //   bondAddress: "0x956c43998316b6a2F21f89a1539f73fB5B78c151",
    //   reserveAddress: "0x055475920a8c93CfFb64d039A8205F7AcC7722d3",
    // },
    [NetworkId.TESTNET_RINKEBY]: {
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
    [NetworkId.MAINNET]: {
      // TODO: add correct bond address when it's created
      bondAddress: "0xEC9e2EEE75b060856B9518f46283068f3B0FC434",
      reserveAddress: "0x369c2333139dbB15c612F46ef8513F0768F31864",
    },
    [NetworkId.BSC]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkId.BSC_TEST]: {
      bondAddress: "0xEC9e2EEE75b060856B9518f46283068f3B0FC434",
      reserveAddress: "0xfbC540ebB2AD331486d35E28331aA95A5c9ff0C3",
    },
  },
  lpUrl:
    "https://app.sushi.com/add/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5/0x6b175474e89094c44da98b954eedeac495271d0f",
});

export const rip_daiOld = new LPBond({
  name: "rip_dai_lp_old",
  displayName: "RIP-DAI LP OLD",
  bondToken: "DAI",
  payoutToken: "RIP",
  v2Bond: false,
  bondIconSvg: ["OHM", "DAI"],
  bondContractABI: BondRipDaiContract,
  reserveContract: ReserveRipDaiContract,
  isBondable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  LOLmessage: "",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET_RINKEBY]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: "0x956c43998316b6a2F21f89a1539f73fB5B78c151",
      reserveAddress: "0x34d7d7Aaf50AD4944B70B320aCB24C95fa2def7c",
    },
    [NetworkId.TESTNET_RINKEBY]: {
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
    // FIXME
    [NetworkId.Localhost]: {
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
    [NetworkId.BSC]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkId.BSC_TEST]: {
      bondAddress: "0xEC9e2EEE75b060856B9518f46283068f3B0FC434",
      reserveAddress: "0x369c2333139dbB15c612F46ef8513F0768F31864",
    },
  },
  lpUrl:
    "https://app.sushi.com/add/0x383518188c0c6d7730d91b2c03a03c837814a899/0x6b175474e89094c44da98b954eedeac495271d0f",
});

export const rip_frax = new LPBond({
  name: "rip_frax_lp",
  displayName: "RIP-FRAX LP",
  bondToken: "FRAX",
  payoutToken: "RIP",
  v2Bond: true,
  bondIconSvg: ["OHM", "FRAX"],
  bondContractABI: FraxRipBondContract,
  reserveContract: ReserveRipFraxContract,
  isBondable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  LOLmessage: "Out of Office",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: "0x99E9b0a9dC965361C2CBc07525EA591761aEaA53",
      reserveAddress: "0xB612c37688861f1f90761DC7F382C2aF3a50Cc39",
    },
    [NetworkId.TESTNET_RINKEBY]: {
      bondAddress: "0x7BB53Ef5088AEF2Bb073D9C01DCa3a1D484FD1d2",
      reserveAddress: "0x11BE404d7853BDE29A3e73237c952EcDCbBA031E",
    },
    [NetworkId.BSC]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkId.BSC_TEST]: {
      bondAddress: "0xEC9e2EEE75b060856B9518f46283068f3B0FC434",
      reserveAddress: "0x369c2333139dbB15c612F46ef8513F0768F31864",
    },
  },
  lpUrl:
    "https://app.uniswap.org/#/add/v2/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5/0x853d955acef822db058eb8505911ed77f175b99e",
});

export const rip_fraxOld = new LPBond({
  name: "rip_frax_lp_old",
  displayName: "RIP-FRAX LP OLD",
  bondToken: "FRAX",
  payoutToken: "RIP",
  v2Bond: false,
  bondIconSvg: ["OHM", "FRAX"],
  bondContractABI: FraxRipBondContract,
  reserveContract: ReserveRipFraxContract,
  isBondable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  LOLmessage: "Out of Office",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET_RINKEBY]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: "0xc20CffF07076858a7e642E396180EC390E5A02f7",
      reserveAddress: "0x2dce0dda1c2f98e0f171de8333c3c6fe1bbf4877",
    },
    [NetworkId.TESTNET_RINKEBY]: {
      bondAddress: "0x7BB53Ef5088AEF2Bb073D9C01DCa3a1D484FD1d2",
      reserveAddress: "0x11BE404d7853BDE29A3e73237c952EcDCbBA031E",
    },
    // FIXME
    [NetworkId.Localhost]: {
      bondAddress: "0x7BB53Ef5088AEF2Bb073D9C01DCa3a1D484FD1d2",
      reserveAddress: "0x11BE404d7853BDE29A3e73237c952EcDCbBA031E",
    },
    [NetworkId.BSC]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkId.BSC_TEST]: {
      bondAddress: "0xEC9e2EEE75b060856B9518f46283068f3B0FC434",
      reserveAddress: "0x369c2333139dbB15c612F46ef8513F0768F31864",
    },
  },
  lpUrl:
    "https://app.uniswap.org/#/add/v2/0x853d955acef822db058eb8505911ed77f175b99e/0x383518188c0c6d7730d91b2c03a03c837814a899",
});

export const rip_lusd = new LPBond({
  name: "rip_lusd_lp",
  displayName: "RIP-LUSD LP",
  bondToken: "LUSD",
  payoutToken: "RIP",
  v2Bond: false,
  bondIconSvg: ["OHM", "LUSD"],
  bondContractABI: BondRipLusdContract,
  reserveContract: ReserveRipLusdContract,
  isBondable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  LOLmessage: "",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET_RINKEBY]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: "0xFB1776299E7804DD8016303Df9c07a65c80F67b6",
      reserveAddress: "0xfDf12D1F85b5082877A6E070524f50F6c84FAa6b",
    },
    [NetworkId.TESTNET_RINKEBY]: {
      // NOTE (appleseed-lusd): using rip-dai rinkeby contracts
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
    // FIXME
    [NetworkId.Localhost]: {
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
    [NetworkId.BSC]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkId.BSC_TEST]: {
      bondAddress: "0xEC9e2EEE75b060856B9518f46283068f3B0FC434",
      reserveAddress: "0x369c2333139dbB15c612F46ef8513F0768F31864",
    },
  },
  lpUrl:
    "https://app.sushi.com/add/0x383518188C0C6d7730D91b2c03a03C837814a899/0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
});

export const rip_weth = new CustomBond({
  name: "rip_weth_lp",
  displayName: "RIP-WETH SLP",
  bondToken: "WETH",
  payoutToken: "RIP",
  v2Bond: true,
  bondIconSvg: ["OHM", "wETH"],
  bondContractABI: BondRipEthContract,
  reserveContract: ReserveRipEthContract,
  isBondable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  LOLmessage: "Maternity Leave",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET_RINKEBY]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      // TODO (appleseed): need new bond address
      bondAddress: "0xB6C9dc843dEc44Aa305217c2BbC58B44438B6E16",
      reserveAddress: "0x69b81152c5A8d35A67B32A4D3772795d96CaE4da",
    },
    [NetworkId.TESTNET_RINKEBY]: {
      // NOTE (unbanksy): using rip-dai rinkeby contracts
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
    [NetworkId.BSC]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkId.BSC_TEST]: {
      bondAddress: "0xEC9e2EEE75b060856B9518f46283068f3B0FC434",
      reserveAddress: "0x369c2333139dbB15c612F46ef8513F0768F31864",
    },
  },
  bondType: BondType.LP,
  lpUrl:
    "https://app.sushi.com/add/0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  customTreasuryBalanceFunc: async function (this: CustomBond, networkId, provider) {
    if (networkId === NetworkId.MAINNET) {
      const ethBondContract = this.getContractForBond(networkId, provider);
      if (!ethBondContract) return 0;
      let ethPrice: BigNumberish = await ethBondContract.assetPrice();
      ethPrice = Number(ethPrice.toString()) / Math.pow(10, 8);
      const token = this.getContractForReserve(networkId, provider);
      const tokenAddress = this.getAddressForReserve(networkId);
      const bondCalculator = getBondCalculator(networkId, provider, true);
      const tokenAmount = await token.balanceOf(addresses[networkId].TREASURY_V2);
      const valuation = await bondCalculator.valuation(tokenAddress || "", tokenAmount);
      const markdown = await bondCalculator.markdown(tokenAddress || "");
      const tokenUSD =
        (Number(valuation.toString()) / Math.pow(10, 9)) * (Number(markdown.toString()) / Math.pow(10, 18));
      return tokenUSD * Number(ethPrice.toString());
    } else {
      // NOTE (appleseed): using RIP-DAI on rinkeby
      const token = this.getContractForReserve(networkId, provider);
      const tokenAddress = this.getAddressForReserve(networkId);
      const bondCalculator = getBondCalculator(networkId, provider, false);
      const tokenAmount = await token.balanceOf(addresses[networkId].TREASURY_ADDRESS);
      const valuation = await bondCalculator.valuation(tokenAddress || "", tokenAmount);
      const markdown = await bondCalculator.markdown(tokenAddress || "");
      const tokenUSD =
        (Number(valuation.toString()) / Math.pow(10, 9)) * (Number(markdown.toString()) / Math.pow(10, 18));
      return tokenUSD;
    }
  },
});

export const rip_wethOld = new CustomBond({
  name: "rip_weth_lp_old",
  displayName: "RIP-WETH SLP OLD",
  bondToken: "WETH",
  payoutToken: "RIP",
  v2Bond: false,
  bondIconSvg: ["OHM", "wETH"],
  bondContractABI: BondRipEthContract,
  reserveContract: ReserveRipEthContract,
  isBondable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  isLOLable: {
    [NetworkId.MAINNET]: false,
    [NetworkId.TESTNET_RINKEBY]: false,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  LOLmessage: "Maternity Leave",
  isClaimable: {
    [NetworkId.MAINNET]: true,
    [NetworkId.TESTNET_RINKEBY]: true,
    [NetworkId.ARBITRUM]: false,
    [NetworkId.ARBITRUM_TESTNET]: false,
    [NetworkId.AVALANCHE]: false,
    [NetworkId.AVALANCHE_TESTNET]: false,
  },
  networkAddrs: {
    [NetworkId.MAINNET]: {
      bondAddress: "0xB6C9dc843dEc44Aa305217c2BbC58B44438B6E16",
      reserveAddress: "0xfffae4a0f4ac251f4705717cd24cadccc9f33e06",
    },
    [NetworkId.TESTNET_RINKEBY]: {
      // NOTE (unbanksy): using rip-dai rinkeby contracts
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
    [NetworkId.Localhost]: {
      // FIXME
      bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
      reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
    },
    [NetworkId.BSC]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkId.BSC_TEST]: {
      bondAddress: "0xEC9e2EEE75b060856B9518f46283068f3B0FC434",
      reserveAddress: "0x369c2333139dbB15c612F46ef8513F0768F31864",
    },
  },
  bondType: BondType.LP,
  lpUrl:
    "https://app.sushi.com/add/0x383518188c0c6d7730d91b2c03a03c837814a899/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  customTreasuryBalanceFunc: async function (this: CustomBond, networkId, provider) {
    if (networkId === NetworkId.MAINNET) {
      const ethBondContract = this.getContractForBond(networkId, provider);
      if (!ethBondContract) return 0;
      let ethPrice: BigNumberish = await ethBondContract.assetPrice();
      ethPrice = Number(ethPrice.toString()) / Math.pow(10, 8);
      const token = this.getContractForReserve(networkId, provider);
      const tokenAddress = this.getAddressForReserve(networkId);
      const bondCalculator = getBondCalculator(networkId, provider, false);
      const tokenAmount = await token.balanceOf(addresses[networkId].TREASURY_ADDRESS);
      const valuation = await bondCalculator.valuation(tokenAddress || "", tokenAmount);
      const markdown = await bondCalculator.markdown(tokenAddress || "");
      const tokenUSD =
        (Number(valuation.toString()) / Math.pow(10, 9)) * (Number(markdown.toString()) / Math.pow(10, 18));
      return tokenUSD * Number(ethPrice.toString());
    } else {
      // NOTE (appleseed): using RIP-DAI on rinkeby
      const token = this.getContractForReserve(networkId, provider);
      const tokenAddress = this.getAddressForReserve(networkId);
      const bondCalculator = getBondCalculator(networkId, provider, false);
      const tokenAmount = await token.balanceOf(addresses[networkId].TREASURY_ADDRESS);
      const valuation = await bondCalculator.valuation(tokenAddress || "", tokenAmount);
      const markdown = await bondCalculator.markdown(tokenAddress || "");
      const tokenUSD =
        (Number(valuation.toString()) / Math.pow(10, 9)) * (Number(markdown.toString()) / Math.pow(10, 18));
      return tokenUSD;
    }
  },
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [
  dai,
  // frax,
  // eth,
  // cvx,
  // rip_dai,
  // rip_daiOld,
  // rip_frax,
  // rip_fraxOld,
  // lusd,
  // rip_lusd,
  // rip_weth,
  // rip_wethOld,
];
// TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
export const allExpiredBonds = [cvx_expired, fraxOld];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
