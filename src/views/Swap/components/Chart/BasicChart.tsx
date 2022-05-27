import { Currency } from "@pancakeswap/sdk";
import { Box, ButtonMenu, ButtonMenuItem, Flex, Text } from "@pancakeswap/uikit";
import { Dispatch, memo, SetStateAction, useState } from "react";
import styled from "styled-components";

import PairPriceDisplay from "../../../../components/PairPriceDisplay";
import { useTranslation } from "../../../../contexts/Localization";
import { useFetchPairPrices } from "../../../../slices/swap/hooks";
// import dynamic from 'next/dynamic'
import { PairDataTimeWindowEnum } from "../../../../slices/swap/types";
import NoChartAvailable from "./NoChartAvailable";
// const SwapLineChart = dynamic(() => import('./SwapLineChart'), {
//   ssr: false,
// })
import SwapLineChart from "./SwapLineChart";
import { getTimeWindowChange } from "./utils";

const StyledButtonMenu = styled(ButtonMenu)`
  background-color: transparent;
  border-color: black;
  border-width: 2px;
  border-radius: 40px;
`;

const StyledButtonMenuItem = styled(ButtonMenuItem)<{ active: boolean }>`
  background-color: ${({ active }) => (active ? "rgba(0, 0, 0, 0.5)" : "transparent")};
  color: ${({ active, theme }) => (active ? theme.colors.primary : "black")};
`;

const BasicChart = ({
  token0Address,
  token1Address,
  isChartExpanded,
  isMobile,
  currentSwapPrice,
  setHoverValue,
  timeWindow,
}: {
  token0Address: string;
  token1Address: string;
  isChartExpanded: boolean;
  isMobile: boolean;
  currentSwapPrice: any;
  setHoverValue: any;
  timeWindow: PairDataTimeWindowEnum;
}) => {
  const { pairPrices = [], pairId } = useFetchPairPrices({
    token0Address,
    token1Address,
    timeWindow,
    currentSwapPrice,
  });
  const [hoverDate, setHoverDate] = useState<string | undefined>();
  const { changeValue } = getTimeWindowChange(pairPrices);
  const isChangePositive = changeValue >= 0;
  const chartHeight = isChartExpanded ? "calc(100% - 120px)" : "378px";
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation();
  const currentDate = new Date().toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Sometimes we might receive array full of zeros for obscure tokens while trying to derive data
  // In that case chart is not useful to users
  const isBadData =
    pairPrices &&
    pairPrices.length > 0 &&
    pairPrices.every(
      price => !price.value || price.value === 0 || price.value === Infinity || Number.isNaN(price.value),
    );

  if (isBadData) {
    return (
      <NoChartAvailable
        token0Address={token0Address}
        token1Address={token1Address}
        pairAddress={pairId}
        isMobile={isMobile}
      />
    );
  }

  return (
    <>
      <Text small color="blueish_gray" mt="2rem" ml="3rem">
        {hoverDate || currentDate}
      </Text>
      <Box height={isMobile ? "100%" : chartHeight} p={isMobile ? "0px" : "16px"} width="100%">
        <SwapLineChart
          data={pairPrices}
          setHoverValue={setHoverValue}
          setHoverDate={setHoverDate}
          isChangePositive={isChangePositive}
          timeWindow={timeWindow}
        />
      </Box>
    </>
  );
};

export default memo(BasicChart, (prev, next) => {
  return (
    prev.token0Address === next.token0Address &&
    prev.token1Address === next.token1Address &&
    prev.isChartExpanded === next.isChartExpanded &&
    prev.isMobile === next.isMobile &&
    prev.isChartExpanded === next.isChartExpanded &&
    ((prev.currentSwapPrice !== null &&
      next.currentSwapPrice !== null &&
      prev.currentSwapPrice[prev.token0Address] === next.currentSwapPrice[next.token0Address] &&
      prev.currentSwapPrice[prev.token1Address] === next.currentSwapPrice[next.token1Address]) ||
      (prev.currentSwapPrice === null && next.currentSwapPrice === null)) &&
    prev.timeWindow === next.timeWindow
  );
});

export const SwapInfo = ({
  token0Address,
  token1Address,
  inputCurrency,
  outputCurrency,
  currentSwapPrice,
  hoverValue,
  timeWindow,
  setTimeWindow,
}: {
  token0Address: string;
  token1Address: string;
  inputCurrency: Currency;
  outputCurrency: Currency;
  currentSwapPrice: any;
  hoverValue: any;
  timeWindow: PairDataTimeWindowEnum;
  setTimeWindow: Dispatch<SetStateAction<PairDataTimeWindowEnum>>;
}) => {
  const { pairPrices = [], pairId } = useFetchPairPrices({
    token0Address,
    token1Address,
    timeWindow,
    currentSwapPrice,
  });
  const valueToDisplay = hoverValue || pairPrices[pairPrices.length - 1]?.value;
  const { changePercentage, changeValue } = getTimeWindowChange(pairPrices);
  const isChangePositive = changeValue >= 0;
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation();

  return (
    <Flex
      flexDirection={["column", null, null, null, null, null, "row"]}
      alignItems={["flex-start", null, null, null, null, null, "center"]}
      justifyContent="space-between"
      px="24px"
      alignContent="center"
    >
      <Flex flexDirection="row">
        <PairPriceDisplay
          value={pairPrices?.length > 0 ? valueToDisplay : undefined}
          inputSymbol={inputCurrency?.symbol}
          outputSymbol={outputCurrency?.symbol}
        >
          <Text
            color={isChangePositive ? "success" : "failure"}
            fontSize="1rem"
            ml="2rem"
            px=".7rem"
            py=".3rem"
            style={{
              background:
                "linear-gradient(259.15deg, rgba(41, 255, 198, 0.2) 40.61%, rgba(255, 255, 255, 0) 166.25%), rgba(0, 0, 0, 0.7)",
              borderRadius: "2rem",
            }}
            bold
          >
            {/* {`${isChangePositive ? "+" : ""}${changeValue.toFixed(3)} `} */}
            {`${changePercentage}%`}
          </Text>
          <Box ml="2rem">
            <StyledButtonMenu activeIndex={timeWindow} onItemClick={setTimeWindow} scale="sm">
              <StyledButtonMenuItem active={timeWindow === PairDataTimeWindowEnum.DAY}>{t("24H")}</StyledButtonMenuItem>
              <StyledButtonMenuItem active={timeWindow === PairDataTimeWindowEnum.WEEK}>{t("1W")}</StyledButtonMenuItem>
              <StyledButtonMenuItem active={timeWindow === PairDataTimeWindowEnum.MONTH}>
                {t("1M")}
              </StyledButtonMenuItem>
              <StyledButtonMenuItem active={timeWindow === PairDataTimeWindowEnum.YEAR}>{t("1Y")}</StyledButtonMenuItem>
            </StyledButtonMenu>
          </Box>
        </PairPriceDisplay>
      </Flex>
    </Flex>
  );
};
