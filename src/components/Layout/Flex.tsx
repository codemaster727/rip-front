import { Flex, FlexProps } from "@pancakeswap/uikit";
import styled from "styled-components";

const FlexLayout = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-height: 570px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: block !important;
    width: 10px !important;
    border: 1px solid black;
    border-radius: 10px;
    height: 60%;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(0, 0, 0);
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
  & > * {
    min-width: 280px;
    max-width: 31.5%;
    width: 100%;
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
