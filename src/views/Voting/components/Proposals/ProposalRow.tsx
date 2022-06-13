import { Box, Flex, IconButton, Text, useMatchBreakpoints } from "@pancakeswap/uikit";
import RightIcon from "src/assets/icons/right.svg";
import { NextLinkFromReactRouter } from "src/components/NextLink";
import { Proposal } from "src/slices/types";
import styled from "styled-components";

import { isCoreProposal } from "../../helpers";
import { ProposalStateTag, ProposalTypeTag } from "./tags";
import TimeFrame from "./TimeFrame";

interface ProposalRowProps {
  proposal: Proposal;
}

const StyledProposalRow = styled(NextLinkFromReactRouter)`
  align-items: center;
  display: flex;
  padding: 8px 12px;
  width: 100%;

  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.colors.dropdown};
  }

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 40px;
    padding: 16px 24px;
  }
`;

const ProposalRow: React.FC<ProposalRowProps> = ({ proposal }) => {
  const votingLink = `/voting/proposal/${proposal.id}`;
  const isMobile = useMatchBreakpoints();

  return (
    <StyledProposalRow to={votingLink}>
      <Box as="span" style={{ flex: 1 }}>
        <Text bold mb="8px">
          {proposal.title}
        </Text>
        <Flex alignItems="left" flexDirection={isMobile ? "column" : "row"}>
          <TimeFrame startDate={proposal.start} endDate={proposal.end} proposalState={proposal.state} />
          <Flex alignItems="left" ml="8px" mt={2}>
            <ProposalStateTag proposalState={proposal.state} ml="8px" />
            <ProposalTypeTag isCoreProposal={isCoreProposal(proposal)} ml="8px" />
          </Flex>
        </Flex>
      </Box>
      <IconButton variant="text">
        <img src={RightIcon} width={32} />
      </IconButton>
    </StyledProposalRow>
  );
};

export default ProposalRow;
