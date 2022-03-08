import { createAsyncThunk } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import { IERC20, RIPProtocolStakingv2__factory } from "src/typechain";

import { abi as ierc20ABI } from "../abi/IERC20.json";
// import { abi as StakingHelperABI } from "../abi/StakingHelper.json";
import { addresses } from "../constants";
import { trackGAEvent, trackSegmentEvent } from "../helpers/analytics";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { IChangeApprovalWithVersionAsyncThunk, IJsonRPCError, IStakeAsyncThunk } from "./interfaces";
import { error, info } from "./MessagesSlice";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./PendingTxnsSlice";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string;
}

function alreadyApprovedToken(
  token: string,
  // stakeAllowance: BigNumber,
  // unstakeAllowance: BigNumber,
  stakeAllowanceV2: BigNumber,
  unstakeAllowanceV2: BigNumber,
  version2: boolean,
) {
  // set defaults
  const bigZero = BigNumber.from("0");
  let applicableAllowance = bigZero;
  // determine which allowance to check
  if (token === "rip" && version2) {
    applicableAllowance = stakeAllowanceV2;
  } else if (token === "srip" && version2) {
    applicableAllowance = unstakeAllowanceV2;
  } else if (token === "rip") {
    // applicableAllowance = stakeAllowance;
  } else if (token === "srip") {
    // applicableAllowance = unstakeAllowance;
  }

  // check if allowance exists
  if (applicableAllowance.gt(bigZero)) return true;

  return false;
}

export const changeApproval = createAsyncThunk(
  "stake/changeApproval",
  async ({ token, provider, address, networkID, version2 }: IChangeApprovalWithVersionAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    const signer = provider.getSigner();
    // const ripContract = new ethers.Contract(addresses[networkID].RIP_ADDRESS as string, ierc20ABI, signer) as IERC20;
    // const sripContract = new ethers.Contract(addresses[networkID].SRIP_ADDRESS as string, ierc20ABI, signer) as IERC20;
    const ripV2Contract = new ethers.Contract(addresses[networkID].RIP_V2 as string, ierc20ABI, signer) as IERC20;
    const sripV2Contract = new ethers.Contract(addresses[networkID].SRIP_V2 as string, ierc20ABI, signer) as IERC20;
    let approveTx;
    // let stakeAllowance = await ripContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    // let unstakeAllowance = await sripContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    let stakeAllowanceV2 = await ripV2Contract.allowance(address, addresses[networkID].STAKING_V2);
    let unstakeAllowanceV2 = await sripV2Contract.allowance(address, addresses[networkID].STAKING_V2);
    // return early if approval has already happened
    if (alreadyApprovedToken(token, stakeAllowanceV2, unstakeAllowanceV2, version2)) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          staking: {
            // ripStakeV1: +stakeAllowance,
            // ripUnstakeV1: +unstakeAllowance,
            ripStake: +stakeAllowanceV2,
            ripUnstake: +unstakeAllowanceV2,
          },
        }),
      );
    }

    try {
      if (version2) {
        if (token === "rip") {
          approveTx = await ripV2Contract.approve(
            addresses[networkID].STAKING_V2,
            ethers.utils.parseUnits("1000000000", "gwei").toString(),
          );
        } else if (token === "srip") {
          approveTx = await sripV2Contract.approve(
            addresses[networkID].STAKING_V2,
            ethers.utils.parseUnits("1000000000", "gwei").toString(),
          );
        }
      } else {
        if (token === "rip") {
          // approveTx = await ripContract.approve(
          //   addresses[networkID].STAKING_ADDRESS,
          //   ethers.utils.parseUnits("1000000000", "gwei").toString(),
          // );
        } else if (token === "srip") {
          // approveTx = await sripContract.approve(
          //   addresses[networkID].STAKING_ADDRESS,
          //   ethers.utils.parseUnits("1000000000", "gwei").toString(),
          // );
        }
      }

      const text = "Approve " + (token === "rip" ? "Staking" : "Unstaking");
      const pendingTxnType = token === "rip" ? "approve_staking" : "approve_unstaking";
      if (approveTx) {
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

        await approveTx.wait();
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    // go get fresh allowances
    // stakeAllowance = await ripContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    // unstakeAllowance = await sripContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    stakeAllowanceV2 = await ripV2Contract.allowance(address, addresses[networkID].STAKING_V2);
    unstakeAllowanceV2 = await sripV2Contract.allowance(address, addresses[networkID].STAKING_V2);

    return dispatch(
      fetchAccountSuccess({
        staking: {
          // ripStakeV1: +stakeAllowance,
          // ripUnstakeV1: +unstakeAllowance,
          ripStake: +stakeAllowanceV2,
          ripUnstake: +unstakeAllowanceV2,
        },
      }),
    );
  },
);

export const changeStake = createAsyncThunk(
  "stake/changeStake",
  async ({ action, value, provider, address, networkID, version2, rebase }: IStakeAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    const signer = provider.getSigner();

    // const staking = RIPProtocolStaking__factory.connect(addresses[networkID].STAKING_ADDRESS, signer);

    // const stakingHelper = new ethers.Contract(
    //   addresses[networkID].STAKING_HELPER_ADDRESS as string,
    //   StakingHelperABI,
    //   signer,
    // ) as StakingHelper;

    const stakingV2 = RIPProtocolStakingv2__factory.connect(addresses[networkID].STAKING_V2, signer);

    let stakeTx;
    const uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: "",
    };
    try {
      if (version2 || true) {
        const rebasing = true; // when true stake into sRIP
        if (action === "stake") {
          alert();
          uaData.type = "stake";
          // 3rd arg is rebase
          // 4th argument is claim default to true
          console.log("object234");
          console.log(stakingV2);
          stakeTx = rebase
            ? await stakingV2.stake(address, ethers.utils.parseUnits(value, "gwei"), true, true)
            : await stakingV2.stake(address, ethers.utils.parseUnits(value, "gwei"), false, true);
        } else {
          uaData.type = "unstake";
          // 3rd arg is trigger default to true for mainnet and false for rinkeby
          // 4th arg is rebasing
          stakeTx = rebase
            ? await stakingV2.unstake(address, ethers.utils.parseUnits(value, "gwei"), true, true)
            : await stakingV2.unstake(address, ethers.utils.parseUnits(value, "ether"), true, false);
        }
      } else {
        // if (action === "stake") {
        //   uaData.type = "stake";
        //   stakeTx = await stakingHelper.stake(ethers.utils.parseUnits(value, "gwei"));
        // } else {
        //   uaData.type = "unstake";
        //   // stakeTx = await staking.unstake(ethers.utils.parseUnits(value, "gwei"), true);
        // }
      }
      const pendingTxnType = action === "stake" ? "staking" : "unstaking";
      uaData.txHash = stakeTx.hash;
      dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
      await stakeTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (stakeTx) {
        trackSegmentEvent(uaData);
        trackGAEvent({
          category: "Staking",
          action: uaData.type ?? "unknown",
          label: uaData.txHash ?? "unknown",
          dimension1: uaData.txHash ?? "unknown",
          dimension2: uaData.address,
          metric1: parseFloat(uaData.value),
        });
        dispatch(clearPendingTxn(stakeTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
  },
);
