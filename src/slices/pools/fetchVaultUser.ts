import BigNumber from "bignumber.js";
import cakeVaultAbi from "src/config/abi/cakeVaultV2.json";
import { SerializedLockedVaultUser } from "src/slices/types";
import { getCakeVaultAddress } from "src/utils/addressHelpers";
import { multicallv2 } from "src/utils/multicall";

const cakeVaultAddress = getCakeVaultAddress();

const fetchVaultUser = async (account: string): Promise<SerializedLockedVaultUser> => {
  try {
    const calls = ["userInfo", "calculatePerformanceFee", "calculateOverdueFee"].map(method => ({
      address: cakeVaultAddress,
      name: method,
      params: [account],
    }));

    const [userContractResponse, [currentPerformanceFee], [currentOverdueFee]] = await multicallv2(cakeVaultAbi, calls);
    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse.shares.toString()).toJSON(),
      lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
      lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
      cakeAtLastUserAction: new BigNumber(userContractResponse.cakeAtLastUserAction.toString()).toJSON(),
      userBoostedShare: new BigNumber(userContractResponse.userBoostedShare.toString()).toJSON(),
      locked: userContractResponse.locked,
      lockEndTime: userContractResponse.lockEndTime.toString(),
      lockStartTime: userContractResponse.lockStartTime.toString(),
      lockedAmount: new BigNumber(userContractResponse.lockedAmount.toString()).toJSON(),
      currentPerformanceFee: new BigNumber(currentPerformanceFee.toString()).toJSON(),
      currentOverdueFee: new BigNumber(currentOverdueFee.toString()).toJSON(),
    };
  } catch (error) {
    return {
      isLoading: true,
      userShares: "",
      lastDepositedTime: "",
      lastUserActionTime: "",
      cakeAtLastUserAction: "",
      userBoostedShare: "",
      lockEndTime: "",
      lockStartTime: "",
      locked: false,
      lockedAmount: "",
      currentPerformanceFee: "",
      currentOverdueFee: "",
    };
  }
};

export default fetchVaultUser;
