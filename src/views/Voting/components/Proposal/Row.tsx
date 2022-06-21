import { Box, Grid } from "@pancakeswap/uikit";
import styled from "styled-components";

export const AddressColumn = styled(Box).attrs({ alignItems: "center" })`
  grid-area: address;
`;

export const ChoiceColumn = styled(Box)`
  grid-area: choice;
  width: fit-content;
`;

export const VotingPowerColumn = styled(Box)`
  justify-self: end;
  grid-area: vote;
`;

const Row = styled(Grid)`
  // border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  grid-gap: 0.5rem;
  grid-template-areas:
    "choice choice"
    "address address address"
    "vote";
  grid-template-columns: 1fr 1fr 100px;
  padding: 8px 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 2rem;
    grid-template-areas: "choice address vote";
    padding: 16px 24px;
  }
`;

export default Row;
