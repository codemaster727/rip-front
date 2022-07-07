import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { IERC20, RIPProtocolStakingv2__factory } from "src/typechain";

import ierc20ABI from "../abi/IERC20.json";
import { addresses } from "../constants";
import { trackGAEvent, trackSegmentEvent } from "../helpers/analytics";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { error, info } from "./MessagesSlice";
import { clearPendingTxn, fetchPendingTxns, getWrappingTypeText } from "./PendingTxnsSlice";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string;
}

export const changeApproval = createAsyncThunk(
  "wrap/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const sripContract = new ethers.Contract(addresses[networkID].SRIP_V2 as string, ierc20ABI.abi, signer) as IERC20;
    const gripContract = new ethers.Contract(
      addresses[networkID].GRIP_ADDRESS as string,
      ierc20ABI.abi,
      signer,
    ) as IERC20;
    let approveTx;
    let wrapAllowance = await sripContract.allowance(address, addresses[networkID].STAKING_V2);
    let unwrapAllowance = await gripContract.allowance(address, addresses[networkID].STAKING_V2);

    try {
      if (token === "srip") {
        // won't run if wrapAllowance > 0
        if (Number(wrapAllowance) <= 0) {
          approveTx = await sripContract.approve(
            addresses[networkID].STAKING_V2,
            ethers.utils.parseUnits("1000000000", "gwei"),
          );
        }
      } else if (token === "grip") {
        if (Number(unwrapAllowance) <= 0) {
          approveTx = await gripContract.approve(
            addresses[networkID].STAKING_V2,
            ethers.utils.parseUnits("1000000000000000000", "ether"),
          );
        }
      }

      const text = "Approve " + (token === "srip" ? "Wrapping" : "Unwrapping");
      const pendingTxnType = token === "srip" ? "approve_wrapping" : "approve_unwrapping";
      if (approveTx) {
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
        await approveTx.wait();
        dispatch(info("Successfully Approved!"));
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
    wrapAllowance = await sripContract.allowance(address, addresses[networkID].STAKING_V2);
    unwrapAllowance = await gripContract.allowance(address, addresses[networkID].STAKING_V2);

    return dispatch(
      fetchAccountSuccess({
        wrapping: {
          sripWrap: Number(ethers.utils.formatUnits(wrapAllowance, "gwei")),
          gRipUnwrap: Number(ethers.utils.formatUnits(unwrapAllowance, "ether")),
        },
      }),
    );
  },
);

export const changeWrapV2 = createAsyncThunk(
  "wrap/changeWrapV2",
  async ({ action, value, provider, address, networkID }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();

    const stakingContract = RIPProtocolStakingv2__factory.connect(addresses[networkID].STAKING_V2, signer);

    let wrapTx;
    const uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: "",
    };

    try {
      if (action === "wrap") {
        const formattedValue = ethers.utils.parseUnits(value, "gwei");
        uaData.type = "wrap";
        wrapTx = await stakingContract.wrap(address, formattedValue);
        dispatch(fetchPendingTxns({ txnHash: wrapTx.hash, text: getWrappingTypeText(action), type: "wrapping" }));
      } else if (action === "unwrap") {
        const formattedValue = ethers.utils.parseUnits(value, "ether");
        uaData.type = "unwrap";
        wrapTx = await stakingContract.unwrap(address, formattedValue);
        dispatch(fetchPendingTxns({ txnHash: wrapTx.hash, text: getWrappingTypeText(action), type: "wrapping" }));
      }
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to wrap more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (wrapTx) {
        uaData.txHash = wrapTx.hash;
        await wrapTx.wait();
        trackSegmentEvent(uaData);
        trackGAEvent({
          category: "Wrap",
          action: uaData.type,
          metric1: parseFloat(uaData.value),
        });
        dispatch(getBalances({ address, networkID, provider }));
        dispatch(clearPendingTxn(wrapTx.hash));
      }
    }
  },
);
