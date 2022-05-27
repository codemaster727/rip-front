import { Box } from "@pancakeswap/uikit";
import styled from "styled-components";

export const StyledPriceChart = styled(Box)<{
  $isDark: boolean;
  $isExpanded: boolean;
  $isFullWidthContainer?: boolean;
}>`
  border: none;
  border-radius: 32px;
  width: 100%;
  padding-top: 36px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 8px;
    height: ${({ $isExpanded }) => ($isExpanded ? "calc(100vh - 100px)" : "516px")};
  }
`;

StyledPriceChart.defaultProps = {
  height: "70%",
};
