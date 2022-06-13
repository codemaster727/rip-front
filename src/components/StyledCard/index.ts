import { Card } from "@pancakeswap/uikit";
import styled from "styled-components";

const StyledCard = styled(Card)`
  align-self: baseline;
  max-width: 100%;
  margin: 0 0 24px 0;
  background-color: ${({ theme }) => theme.colors.primary};
  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 250px;
    margin: 0 12px 46px;
  }
`;

export default StyledCard;
