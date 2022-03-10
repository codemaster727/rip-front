import { BigNumber } from "@ethersproject/bignumber";
import { useQuery } from "react-query";
import { RIP_DAI_RESERVE_CONTRACT_DECIMALS, STAKING_CONTRACT_DECIMALS } from "src/constants/decimals";
import { parseBigNumber, queryAssertion } from "src/helpers";

import { useRipDaiReserveContract } from "./useContract";
import { useCurrentIndex } from "./useCurrentIndex";

export const ripPriceQueryKey = () => ["useRipPrice"];

/**
 * Returns the market price of RIP.
 */
export const useRipPrice = () => {
  const reserveContract = useRipDaiReserveContract();

  return useQuery<number, Error>(ripPriceQueryKey(), async () => {
    const [rip, dai] = await reserveContract.getReserves();
    if (rip.gt(dai)) {
      return parseBigNumber(rip.div(dai), RIP_DAI_RESERVE_CONTRACT_DECIMALS);
    } else {
      return parseBigNumber(dai.div(rip), RIP_DAI_RESERVE_CONTRACT_DECIMALS);
    }
  });
};

export const gripPriceQueryKey = (marketPrice?: number, currentIndex?: BigNumber) => [
  "useGRIPPrice",
  marketPrice,
  currentIndex,
];

/**
 * Returns the calculated price of gRIP.
 */
export const useGripPrice = () => {
  const { data: ripPrice } = useRipPrice();
  const { data: currentIndex } = useCurrentIndex();

  return useQuery<number, Error>(
    gripPriceQueryKey(ripPrice, currentIndex),
    async () => {
      queryAssertion(ripPrice && currentIndex, gripPriceQueryKey(ripPrice, currentIndex));

      return parseBigNumber(currentIndex, STAKING_CONTRACT_DECIMALS) * ripPrice;
    },
    { enabled: !!ripPrice && !!currentIndex },
  );
};
