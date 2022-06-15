import { Flex, FlexProps } from "@pancakeswap/uikit";
import styled from "styled-components";

const FlexLayout: any = styled.div<{ cols?: boolean; light?: string }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  // min-height: 250px;
  max-height: 580px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: block !important;
    width: 10px !important;
    border: 1px solid ${({ light = "light", theme }) => (light === "dark" ? theme.colors.primary : "rgba(0, 0, 0)")};
    border-radius: 10px;
    height: 60%;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: ${({ light = "light", theme }) => (light === "dark" ? theme.colors.primary : "rgba(0, 0, 0)")};
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
  & > * {
    min-width: 280px;
    width: 100%;
    max-width: ${({ cols = true }) => (cols ? "31.5%" : "100%")}
    margin: 0 8px;
    margin-bottom: 32px;
  }
`;

export interface FlexGapProps extends FlexProps {
  gap?: string;
  rowGap?: string;
  columnGap?: string;
}

export const FlexGap = styled(Flex)<FlexGapProps>`
  gap: ${({ gap }) => gap};
  row-gap: ${({ rowGap }) => rowGap};
  column-gap: ${({ columnGap }) => columnGap};
`;

export default FlexLayout;
