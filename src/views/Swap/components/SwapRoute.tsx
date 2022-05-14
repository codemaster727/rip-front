import { Trade } from "@pancakeswap/sdk";
import { ChevronRightIcon, Flex, Text } from "@pancakeswap/uikit";
import { Fragment, memo } from "react";

import { unwrappedToken } from "../../../utils/wrappedCurrency";

export default memo(function SwapRoute({ trade }: { trade: Trade }) {
  return (
    <Flex flexWrap="wrap" width="100%" justifyContent="flex-end" alignItems="center">
      {trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1;
        const currency = unwrappedToken(token);
        return (
          // eslint-disable-next-line
          <Fragment key={i}>
            <Flex alignItems="end">
              <Text fontSize="14px" ml="0.125rem" mr="0.125rem">
                {currency.symbol}
              </Text>
            </Flex>
            {!isLastItem && <ChevronRightIcon width="12px" />}
          </Fragment>
        );
      })}
    </Flex>
  );
});
