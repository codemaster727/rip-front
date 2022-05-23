import BigNumber from "bignumber.js";
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from "src/constants";
import getGasPrice from "src/utils/getGasPrice";

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
};

export const stakeFarm = async (masterChefContract: any, pid: any, amount: any) => {
  const gasPrice = getGasPrice();
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();

  return masterChefContract.deposit(pid, value, { ...options, gasPrice });
};

export const unstakeFarm = async (masterChefContract: any, pid: any, amount: any) => {
  const gasPrice = getGasPrice();
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();

  return masterChefContract.withdraw(pid, value, { ...options, gasPrice });
};

export const harvestFarm = async (masterChefContract: any, pid: any) => {
  const gasPrice = getGasPrice();

  return masterChefContract.deposit(pid, "0", { ...options, gasPrice });
};
