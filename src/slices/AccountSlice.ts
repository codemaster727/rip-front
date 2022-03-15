import { OHMTokenStackProps } from "@olympusdao/component-library";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { BigNumber, BigNumberish, ethers } from "ethers";
import { EnvHelper } from "src/helpers/Environment";
import { NodeHelper } from "src/helpers/NodeHelper";
import { RootState } from "src/store";
import { FiatDAOContract, FuseProxy, IERC20, IERC20__factory } from "src/typechain";
import { GRIP__factory } from "src/typechain/factories/GRIP__factory";

import { abi as fiatDAO } from "../abi/FiatDAOContract.json";
import { abi as fuseProxy } from "../abi/FuseProxy.json";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as MockSrip } from "../abi/MockSrip.json";
import { abi as RIPProtocolGiving } from "../abi/RIPProtocolGiving.json";
import { abi as RIPProtocolMockGiving } from "../abi/RIPProtocolMockGiving.json";
import { addresses, NetworkId } from "../constants";
import { handleContractError, setAll } from "../helpers";
import { getMockRedemptionBalancesAsync, getRedemptionBalancesAsync } from "../helpers/GiveRedemptionBalanceHelper";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";

interface IUserBalances {
  balances: {
    grip: string;
    gRipAsSripBal: string;
    gRipOnArbitrum: string;
    gRipOnArbAsSrip: string;
    gRipOnAvax: string;
    gRipOnAvaxAsSrip: string;
    gRipOnPolygon: string;
    gRipOnPolygonAsSrip: string;
    gRipOnFantom: string;
    gRipOnFantomAsSrip: string;
    gRipOnTokemak: string;
    gRipOnTokemakAsSrip: string;
    rip: string;
    ripV1: string;
    srip: string;
    sripV1: string;
    fsrip: string;
    fgrip: string;
    fgRIPAsfsRIP: string;
    wsrip: string;
    fiatDaowsrip: string;
    mockSrip: string;
    pool: string;
  };
}

/**
 * Stores the user donation information in a map.
 * - Key: recipient wallet address
 * - Value: amount deposited by the sender
 *
 * We store the amount as a string, since numbers in Javascript are inaccurate.
 * We later parse the string into BigNumber for performing arithmetic.
 */
interface IUserDonationInfo {
  [key: string]: string;
}

interface IUserRecipientInfo {
  totalDebt: string;
  carry: string;
  agnosticAmount: string;
  indexAtLastChange: string;
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk): Promise<IUserBalances> => {
    let gRipBalance = BigNumber.from("0");
    let gRipBalAsSripBal = BigNumber.from("0");
    let gRipOnArbitrum = BigNumber.from("0");
    let gRipOnArbAsSrip = BigNumber.from("0");
    let gRipOnAvax = BigNumber.from("0");
    let gRipOnAvaxAsSrip = BigNumber.from("0");
    let gRipOnPolygon = BigNumber.from("0");
    let gRipOnPolygonAsSrip = BigNumber.from("0");
    let gRipOnFantom = BigNumber.from("0");
    let gRipOnFantomAsSrip = BigNumber.from("0");
    let gRipOnTokemak = BigNumber.from("0");
    let gRipOnTokemakAsSrip = BigNumber.from("0");
    let ripBalance = BigNumber.from("0");
    let sripBalance = BigNumber.from("0");
    let mockSripBalance = BigNumber.from("0");
    let ripV2Balance = BigNumber.from("0");
    let sripV2Balance = BigNumber.from("0");
    let wsripBalance = BigNumber.from("0");
    let poolBalance = BigNumber.from("0");
    let fsripBalance = BigNumber.from(0);
    let fgripBalance = BigNumber.from(0);
    let fgRIPAsfsRIPBalance = BigNumber.from(0);
    let fiatDaowsripBalance = BigNumber.from("0");

    const gRipContract = GRIP__factory.connect(addresses[networkID].GRIP_ADDRESS, provider);
    try {
      gRipBalance = await gRipContract.balanceOf(address);
      gRipBalAsSripBal = await gRipContract.balanceFrom(gRipBalance.toString());
    } catch (e) {
      handleContractError(e);
    }
    try {
      const arbProvider = NodeHelper.getAnynetStaticProvider(NetworkId.ARBITRUM);
      const gRipArbContract = GRIP__factory.connect(addresses[NetworkId.ARBITRUM].GRIP_ADDRESS, arbProvider);
      gRipOnArbitrum = await gRipArbContract.balanceOf(address);
      gRipOnArbAsSrip = await gRipContract.balanceFrom(gRipOnArbitrum.toString());
    } catch (e) {
      handleContractError(e);
    }
    try {
      const avaxProvider = NodeHelper.getAnynetStaticProvider(NetworkId.AVALANCHE);
      const gRipAvaxContract = GRIP__factory.connect(addresses[NetworkId.AVALANCHE].GRIP_ADDRESS, avaxProvider);
      gRipOnAvax = await gRipAvaxContract.balanceOf(address);
      gRipOnAvaxAsSrip = await gRipContract.balanceFrom(gRipOnAvax.toString());
    } catch (e) {
      handleContractError(e);
    }
    try {
      const polygonProvider = NodeHelper.getAnynetStaticProvider(NetworkId.POLYGON);
      const gRipPolygonContract = GRIP__factory.connect(addresses[NetworkId.POLYGON].GRIP_ADDRESS, polygonProvider);
      gRipOnPolygon = await gRipPolygonContract.balanceOf(address);
      gRipOnPolygonAsSrip = await gRipContract.balanceFrom(gRipOnPolygon.toString());
    } catch (e) {
      handleContractError(e);
    }
    try {
      const fantomProvider = NodeHelper.getAnynetStaticProvider(NetworkId.FANTOM);
      const gRipFantomContract = GRIP__factory.connect(addresses[NetworkId.FANTOM].GRIP_ADDRESS, fantomProvider);
      gRipOnFantom = await gRipFantomContract.balanceOf(address);
      gRipOnFantomAsSrip = await gRipContract.balanceFrom(gRipOnFantom.toString());
    } catch (e) {
      handleContractError(e);
    }

    try {
      const tokemakProvider = NodeHelper.getAnynetStaticProvider(NetworkId.MAINNET);
      const gRipTokemakContract = GRIP__factory.connect(addresses[NetworkId.MAINNET].TOKEMAK_GRIP, tokemakProvider);
      gRipOnTokemak = await gRipTokemakContract.balanceOf(address);
      gRipOnTokemakAsSrip = await gRipContract.balanceFrom(gRipOnTokemak.toString());
    } catch (e) {
      handleContractError(e);
    }
    try {
      // const wsripContract = new ethers.Contract(addresses[networkID].WSRIP_ADDRESS as string, wsRIP, provider) as WsRIP;
      // wsripBalance = await wsripContract.balanceOf(address);
      wsripBalance = new BigNumber(0, "ETH");
    } catch (e) {
      handleContractError(e);
    }
    try {
      const ripContract = new ethers.Contract(
        addresses[networkID].RIP_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      ripBalance = await ripContract.balanceOf(address);
    } catch (e) {
      handleContractError(e);
    }
    try {
      const sripContract = new ethers.Contract(
        addresses[networkID].SRIP_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      sripBalance = await sripContract.balanceOf(address);
    } catch (e) {
      handleContractError(e);
    }
    try {
      const ripV2Contract = new ethers.Contract(addresses[networkID].RIP_V2 as string, ierc20Abi, provider) as IERC20;
      ripV2Balance = await ripV2Contract.balanceOf(address);
    } catch (e) {
      handleContractError(e);
    }
    try {
      const sripV2Contract = new ethers.Contract(addresses[networkID].SRIP_V2 as string, ierc20Abi, provider) as IERC20;
      sripV2Balance = await sripV2Contract.balanceOf(address);
    } catch (e) {
      handleContractError(e);
    }

    try {
      // const poolTokenContract = new ethers.Contract(
      //   addresses[networkID].PT_TOKEN_ADDRESS as string,
      //   ierc20Abi,
      //   provider,
      // ) as IERC20;
      // poolBalance = await poolTokenContract.balanceOf(address);
      poolBalance = new BigNumber("0", "ETH");
    } catch (e) {
      handleContractError(e);
    }
    try {
      for (const fuseAddressKey of ["FUSE_6_SRIP", "FUSE_18_SRIP", "FUSE_36_SRIP"]) {
        if (addresses[networkID][fuseAddressKey]) {
          const fsripContract = new ethers.Contract(
            addresses[networkID][fuseAddressKey] as string,
            fuseProxy,
            provider.getSigner(),
          ) as FuseProxy;
          const balanceOfUnderlying = await fsripContract.callStatic.balanceOfUnderlying(address);
          const underlying = await fsripContract.callStatic.underlying();
          if (underlying == addresses[networkID].GRIP_ADDRESS) {
            fgripBalance = balanceOfUnderlying.add(fgripBalance);
          } else fsripBalance = balanceOfUnderlying.add(fsripBalance);
        }
      }
      const gRipContract = GRIP__factory.connect(addresses[networkID].GRIP_ADDRESS, provider);
      if (fgripBalance.gt(0)) {
        fgRIPAsfsRIPBalance = await gRipContract.balanceFrom(fgripBalance.toString());
      }
    } catch (e) {
      handleContractError(e);
    }
    try {
      if (addresses[networkID].FIATDAO_WSRIP_ADDRESS) {
        const fiatDaoContract = new ethers.Contract(
          addresses[networkID].FIATDAO_WSRIP_ADDRESS as string,
          fiatDAO,
          provider,
        ) as FiatDAOContract;
        fiatDaowsripBalance = await fiatDaoContract.balanceOf(address, addresses[networkID].WSRIP_ADDRESS as string);
      }
    } catch (e) {
      handleContractError(e);
    }
    /*
      Needed a sRIP contract on testnet that could easily
      be manually rebased to test redeem features
    */
    if (addresses[networkID] && addresses[networkID].MOCK_SRIP) {
      const mockSripContract = new ethers.Contract(
        addresses[networkID].MOCK_SRIP as string,
        MockSrip,
        provider,
      ) as IERC20;
      mockSripBalance = await mockSripContract.balanceOf(address);
    } else {
      console.debug("Unable to find MOCK_SRIP contract on chain ID " + networkID);
    }

    return {
      balances: {
        grip: ethers.utils.formatEther(gRipBalance),
        gRipAsSripBal: ethers.utils.formatUnits(gRipBalAsSripBal, "gwei"),
        gRipOnArbitrum: ethers.utils.formatEther(gRipOnArbitrum),
        gRipOnArbAsSrip: ethers.utils.formatUnits(gRipOnArbAsSrip, "gwei"),
        gRipOnAvax: ethers.utils.formatEther(gRipOnAvax),
        gRipOnAvaxAsSrip: ethers.utils.formatUnits(gRipOnAvaxAsSrip, "gwei"),
        gRipOnPolygon: ethers.utils.formatEther(gRipOnPolygon),
        gRipOnPolygonAsSrip: ethers.utils.formatUnits(gRipOnPolygonAsSrip, "gwei"),
        gRipOnFantom: ethers.utils.formatEther(gRipOnFantom),
        gRipOnFantomAsSrip: ethers.utils.formatUnits(gRipOnFantomAsSrip, "gwei"),
        gRipOnTokemak: ethers.utils.formatEther(gRipOnTokemak),
        gRipOnTokemakAsSrip: ethers.utils.formatUnits(gRipOnTokemakAsSrip, "gwei"),
        ripV1: ethers.utils.formatUnits(ripBalance, "gwei"),
        sripV1: ethers.utils.formatUnits(sripBalance, "gwei"),
        fsrip: ethers.utils.formatUnits(fsripBalance, "gwei"),
        fgrip: ethers.utils.formatEther(fgripBalance),
        fgRIPAsfsRIP: ethers.utils.formatUnits(fgRIPAsfsRIPBalance, "gwei"),
        wsrip: ethers.utils.formatEther(wsripBalance),
        fiatDaowsrip: ethers.utils.formatEther(fiatDaowsripBalance),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
        rip: ethers.utils.formatUnits(ripV2Balance, "gwei"),
        srip: ethers.utils.formatUnits(sripV2Balance, "gwei"),
        mockSrip: ethers.utils.formatUnits(mockSripBalance, "gwei"),
      },
    };
  },
);

/**
 * Provides the details of deposits/donations provided by a specific wallet.
 */
export const getDonationBalances = createAsyncThunk(
  "account/getDonationBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    let giveAllowance = 0;
    const donationInfo: IUserDonationInfo = {};

    if (addresses[networkID] && addresses[networkID].GIVING_ADDRESS) {
      const sripContract = new ethers.Contract(addresses[networkID].SRIP_V2 as string, ierc20Abi, provider);
      giveAllowance = await sripContract.allowance(address, addresses[networkID].GIVING_ADDRESS);
      const givingContract = new ethers.Contract(
        addresses[networkID].GIVING_ADDRESS as string,
        RIPProtocolGiving,
        provider,
      );
      try {
        // NOTE: The BigNumber here is from ethers, and is a different implementation of BigNumber used in the rest of the frontend. For that reason, we convert to string in the interim.
        const allDeposits: [string[], BigNumber[]] = await givingContract.getAllDeposits(address);
        for (let i = 0; i < allDeposits[0].length; i++) {
          if (allDeposits[1][i].eq(0)) continue;

          // Store as a formatted string
          donationInfo[allDeposits[0][i]] = ethers.utils.formatUnits(allDeposits[1][i], "gwei");
        }
      } catch (e: unknown) {
        console.log(
          "If the following error contains 'user is not donating', then it is an expected error. No need to report it!",
        );
        console.log(e);
      }
    } else {
      console.log("Unable to find GIVING_ADDRESS contract on chain ID " + networkID);
    }

    return {
      giving: {
        sripGive: +giveAllowance,
        donationInfo: donationInfo,
        loading: false,
      },
    };
  },
);

/**
 * Provides the details of deposits/donations provided by a specific wallet.
 *
 * This differs from the standard `getDonationBalances` function because it uses a alternative
 * sRIP contract that allows for manual rebases, which is helpful during testing of the 'Give' functionality.
 */
export const getMockDonationBalances = createAsyncThunk(
  "account/getMockDonationBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    let giveAllowance = 0;
    const donationInfo: IUserDonationInfo = {};

    if (addresses[networkID] && addresses[networkID].MOCK_SRIP) {
      const mockSripContract = new ethers.Contract(addresses[networkID].MOCK_SRIP as string, MockSrip, provider);
      giveAllowance = await mockSripContract._allowedValue(address, addresses[networkID].MOCK_GIVING_ADDRESS);
      const givingContract = new ethers.Contract(
        addresses[networkID].MOCK_GIVING_ADDRESS as string,
        RIPProtocolMockGiving,
        provider,
      );

      try {
        // NOTE: The BigNumber here is from ethers, and is a different implementation of BigNumber used in the rest of the frontend. For that reason, we convert to string in the interim.
        const allDeposits: [string[], BigNumber[]] = await givingContract.getAllDeposits(address);
        for (let i = 0; i < allDeposits[0].length; i++) {
          if (allDeposits[1][i] !== BigNumber.from(0)) {
            // Store as a formatted string
            donationInfo[allDeposits[0][i]] = ethers.utils.formatUnits(allDeposits[1][i], "gwei");
          }
        }
      } catch (e: unknown) {
        console.log(
          "If the following error contains 'user is not donating', then it is an expected error. No need to report it!",
        );
        console.log(e);
      }
    } else {
      console.debug("Unable to find MOCK_SRIP contract on chain ID " + networkID);
    }

    return {
      mockGiving: {
        sripGive: +giveAllowance,
        donationInfo: donationInfo,
        loading: false,
      },
    };
  },
);

export const getRedemptionBalances = createAsyncThunk(
  "account/getRedemptionBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const redeeming = await getRedemptionBalancesAsync({ address, networkID, provider });
    return redeeming;
  },
);

export const getMockRedemptionBalances = createAsyncThunk(
  "account/getMockRedemptionBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const mockRedeeming = await getMockRedemptionBalancesAsync({ address, networkID, provider });
    return mockRedeeming;
  },
);

interface IUserAccountDetails {
  staking: {
    ripStake: number;
    ripUnstake: number;
  };
  wrapping: {
    sripWrap: number;
    wsripUnwrap: number;
    gRipUnwrap: number;
    wsRipMigrate: number;
  };
}

export const getMigrationAllowances = createAsyncThunk(
  "account/getMigrationAllowances",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let ripAllowance = BigNumber.from(0);
    let sRipAllowance = BigNumber.from(0);
    let wsRipAllowance = BigNumber.from(0);
    let gRipAllowance = BigNumber.from(0);

    if (addresses[networkID].RIP_ADDRESS) {
      try {
        const ripContract = IERC20__factory.connect(addresses[networkID].RIP_ADDRESS, provider);
        ripAllowance = await ripContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      } catch (e) {
        handleContractError(e);
      }
    }

    if (addresses[networkID].SRIP_ADDRESS) {
      try {
        const sRipContract = IERC20__factory.connect(addresses[networkID].SRIP_ADDRESS, provider);
        sRipAllowance = await sRipContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      } catch (e) {
        handleContractError(e);
      }
    }

    if (addresses[networkID].WSRIP_ADDRESS) {
      try {
        const wsRipContract = IERC20__factory.connect(addresses[networkID].WSRIP_ADDRESS, provider);
        wsRipAllowance = await wsRipContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      } catch (e) {
        handleContractError(e);
      }
    }

    if (addresses[networkID].GRIP_ADDRESS) {
      try {
        const gRipContract = IERC20__factory.connect(addresses[networkID].GRIP_ADDRESS, provider);
        gRipAllowance = await gRipContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      } catch (e) {
        handleContractError(e);
      }
    }

    return {
      migration: {
        rip: +ripAllowance,
        srip: +sRipAllowance,
        wsrip: +wsRipAllowance,
        grip: +gRipAllowance,
      },
      isMigrationComplete: false,
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    const stakeAllowance = BigNumber.from("0");
    let stakeAllowanceV2 = BigNumber.from("0");
    let unstakeAllowanceV2 = BigNumber.from("0");
    const unstakeAllowance = BigNumber.from("0");
    let wrapAllowance = BigNumber.from("0");
    let gRipUnwrapAllowance = BigNumber.from("0");
    let poolAllowance = BigNumber.from("0");
    const ripToGripAllowance = BigNumber.from("0");
    const wsRipMigrateAllowance = BigNumber.from("0");

    try {
      const gRipContract = GRIP__factory.connect(addresses[networkID].GRIP_ADDRESS, provider);
      gRipUnwrapAllowance = await gRipContract.allowance(address, addresses[networkID].STAKING_V2);
      const sripV2Contract = IERC20__factory.connect(addresses[networkID].SRIP_V2, provider);
      poolAllowance = await sripV2Contract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);
      wrapAllowance = await sripV2Contract.allowance(address, addresses[networkID].STAKING_V2);
      unstakeAllowanceV2 = await sripV2Contract.allowance(address, addresses[networkID].STAKING_V2);

      const ripV2Contract = IERC20__factory.connect(addresses[networkID].RIP_V2, provider);
      stakeAllowanceV2 = await ripV2Contract.allowance(address, addresses[networkID].STAKING_V2);
    } catch (e) {
      handleContractError(e);
    }
    await dispatch(getBalances({ address, networkID, provider }));
    await dispatch(getDonationBalances({ address, networkID, provider }));
    await dispatch(getRedemptionBalances({ address, networkID, provider }));
    if (networkID === NetworkId.TESTNET_RINKEBY) {
      await dispatch(getMockDonationBalances({ address, networkID, provider }));
      await dispatch(getMockRedemptionBalances({ address, networkID, provider }));
    } else {
      if (EnvHelper.env.NODE_ENV !== "production") console.log("Give - Contract mocks skipped except on Rinkeby");
    }
    console.log(EnvHelper.env.NODE_ENV);

    return {
      staking: {
        ripStakeV1: +stakeAllowance,
        ripUnstakeV1: +unstakeAllowance,
        ripStake: +stakeAllowanceV2,
        ripUnstake: +unstakeAllowanceV2,
        riptoGrip: +ripToGripAllowance,
      },
      wrapping: {
        sripWrap: Number(ethers.utils.formatUnits(wrapAllowance, "gwei")),
        gRipUnwrap: Number(ethers.utils.formatUnits(gRipUnwrapAllowance, "ether")),
        wsRipMigrate: Number(ethers.utils.formatUnits(wsRipMigrateAllowance, "ether")),
      },
    };
  },
);

export interface IUserBondDetails {
  // bond: string;
  readonly bond: string;
  readonly balance: string;
  readonly displayName: string;
  readonly allowance: number;
  readonly interestDue: number;
  readonly bondMaturationBlock: number;
  readonly pendingPayout: string; //Payout formatted in gwei.
  readonly bondIconSvg: OHMTokenStackProps["tokens"]; //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: [],
        isLP: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
      };
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);
    const bondDetails = await bondContract.bondInfo(address);
    const interestDue: BigNumberish = Number(bondDetails.payout.toString()) / Math.pow(10, 9);
    const bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    const pendingPayout = await bondContract.pendingPayoutFor(address);

    let balance = BigNumber.from(0);
    const allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID) || "");
    balance = await reserveContract.balanceOf(address);
    // formatEthers takes BigNumber => String
    const balanceVal = ethers.utils.formatEther(balance);
    // balanceVal should NOT be converted to a number. it loses decimal precision
    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance: Number(allowance.toString()),
      balance: balanceVal,
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
  },
);

export interface IAccountSlice extends IUserAccountDetails, IUserBalances {
  giving: { sripGive: number; donationInfo: IUserDonationInfo; loading: boolean };
  mockGiving: { sripGive: number; donationInfo: IUserDonationInfo; loading: boolean };
  redeeming: { sripRedeemable: string; recipientInfo: IUserRecipientInfo };
  mockRedeeming: { sripRedeemable: string; recipientInfo: IUserRecipientInfo };
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    grip: string;
    gRipAsSripBal: string;
    gRipOnArbitrum: string;
    gRipOnArbAsSrip: string;
    gRipOnAvax: string;
    gRipOnAvaxAsSrip: string;
    gRipOnPolygon: string;
    gRipOnPolygonAsSrip: string;
    gRipOnFantom: string;
    gRipOnFantomAsSrip: string;
    gRipOnTokemak: string;
    gRipOnTokemakAsSrip: string;
    ripV1: string;
    rip: string;
    srip: string;
    sripV1: string;
    dai: string;
    oldsrip: string;
    fsrip: string;
    fgrip: string;
    fgRIPAsfsRIP: string;
    wsrip: string;
    fiatDaowsrip: string;
    pool: string;
    mockSrip: string;
  };
  loading: boolean;
  staking: {
    ripStakeV1: number;
    ripUnstakeV1: number;
    ripStake: number;
    ripUnstake: number;
  };
  migration: {
    rip: number;
    srip: number;
    wsrip: number;
    grip: number;
  };
  pooling: {
    sripPool: number;
  };
  isMigrationComplete: boolean;
}

const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: {
    grip: "",
    gRipAsSripBal: "",
    gRipOnArbitrum: "",
    gRipOnArbAsSrip: "",
    gRipOnAvax: "",
    gRipOnAvaxAsSrip: "",
    gRipOnPolygon: "",
    gRipOnPolygonAsSrip: "",
    gRipOnFantom: "",
    gRipOnFantomAsSrip: "",
    gRipOnTokemak: "",
    gRipOnTokemakAsSrip: "",
    ripV1: "",
    rip: "",
    srip: "",
    sripV1: "",
    dai: "",
    oldsrip: "",
    fsrip: "",
    fgrip: "",
    fgRIPAsfsRIP: "",
    wsrip: "",
    fiatDaowsrip: "",
    pool: "",
    mockSrip: "",
  },
  giving: { sripGive: 0, donationInfo: {}, loading: true },
  mockGiving: { sripGive: 0, donationInfo: {}, loading: true },
  redeeming: {
    sripRedeemable: "",
    recipientInfo: {
      totalDebt: "",
      carry: "",
      agnosticAmount: "",
      indexAtLastChange: "",
    },
  },
  mockRedeeming: {
    sripRedeemable: "",
    recipientInfo: {
      totalDebt: "",
      carry: "",
      agnosticAmount: "",
      indexAtLastChange: "",
    },
  },
  staking: { ripStakeV1: 0, ripUnstakeV1: 0, ripStake: 0, ripUnstake: 0 },
  wrapping: { sripWrap: 0, wsripUnwrap: 0, gRipUnwrap: 0, wsRipMigrate: 0 },
  pooling: { sripPool: 0 },
  migration: { rip: 0, srip: 0, wsrip: 0, grip: 0 },
  isMigrationComplete: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getDonationBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getDonationBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getDonationBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getMockDonationBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getMockDonationBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getMockDonationBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getRedemptionBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getRedemptionBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getRedemptionBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getMockRedemptionBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getMockRedemptionBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getMockRedemptionBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getMigrationAllowances.fulfilled, (state, action) => {
        setAll(state, action.payload);
      })
      .addCase(getMigrationAllowances.rejected, (state, { error }) => {
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
