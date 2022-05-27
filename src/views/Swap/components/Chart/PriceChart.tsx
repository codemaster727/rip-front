import { Currency } from "@pancakeswap/sdk";
import { Flex } from "@pancakeswap/uikit";
import { useState } from "react";
import { CurrencyLogo, DoubleCurrencyLogo } from "src/components/Logo";
import { ChartViewMode } from "src/slices/user/actions";
import { useExchangeChartViewManager } from "src/slices/user/hooks";

import { PairDataTimeWindowEnum } from "../../../../slices/swap/types";
import BasicChart, { SwapInfo } from "./BasicChart";
import { StyledPriceChart } from "./styles";

const PriceChart = ({
  inputCurrency,
  outputCurrency,
  isDark,
  isChartExpanded,
  isMobile,
  isFullWidthContainer,
  token0Address,
  token1Address,
  currentSwapPrice,
}: {
  inputCurrency: Currency;
  outputCurrency: Currency;
  onSwitchTokens: any;
  isDark: boolean;
  isChartExpanded: boolean;
  setIsChartExpanded: any;
  isMobile: boolean;
  isFullWidthContainer: boolean;
  token0Address: any;
  token1Address: any;
  currentSwapPrice: any;
}) => {
  const [hoverValue, setHoverValue] = useState<number | undefined>();
  const [chartView, setChartView] = useExchangeChartViewManager();
  const [timeWindow, setTimeWindow] = useState<PairDataTimeWindowEnum>(PairDataTimeWindowEnum.DAY);

  return (
    <StyledPriceChart
      height={chartView === ChartViewMode.TRADING_VIEW ? "100%" : "70%"}
      overflow={chartView === ChartViewMode.TRADING_VIEW ? "hidden" : "unset"}
      $isDark={isDark}
      $isExpanded={isChartExpanded}
      $isFullWidthContainer={isFullWidthContainer}
    >
      <Flex justifyContent="space-between" px="24px">
        <Flex alignItems="center">
          {outputCurrency ? (
            <DoubleCurrencyLogo currency0={inputCurrency} currency1={outputCurrency} size={24} margin />
          ) : (
            inputCurrency && <CurrencyLogo currency={inputCurrency} size="24px" style={{ marginRight: "8px" }} />
          )}
          <SwapInfo
            token0Address={token0Address}
            token1Address={token1Address}
            inputCurrency={inputCurrency}
            outputCurrency={outputCurrency}
            currentSwapPrice={currentSwapPrice}
            hoverValue={hoverValue}
            timeWindow={timeWindow as PairDataTimeWindowEnum}
            setTimeWindow={setTimeWindow}
          />
        </Flex>
      </Flex>
      {chartView === ChartViewMode.BASIC && (
        <BasicChart
          token0Address={token0Address}
          token1Address={token1Address}
          isChartExpanded={isChartExpanded}
          isMobile={isMobile}
          currentSwapPrice={currentSwapPrice}
          setHoverValue={setHoverValue}
          timeWindow={timeWindow as PairDataTimeWindowEnum}
        />
      )}
    </StyledPriceChart>
  );
};

export default PriceChart;
