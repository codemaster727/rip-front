import { Flex, InjectedModalProps } from "@pancakeswap/uikit";
import StyledModal from "src/components/StyledModal";
import { FetchStatus } from "src/constants/types";
import { Proposal, Vote as VoteProp } from "src/slices/types";
import Votes from "src/views/Voting/Proposal/Votes";
import styled from "styled-components";

import FlexLayout from "./Layout/Flex";
import RoundedBox from "./RoundedBox";

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  max-height: 400px;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: none;
  }
`;

interface ExtendedInjectedModalProps extends InjectedModalProps {
  proposal: Proposal;
  votes: VoteProp[];
  votesLoadingStatus: FetchStatus;
}

const ViewVotesModal: React.FC<ExtendedInjectedModalProps> = ({ onDismiss, proposal, votes, votesLoadingStatus }) => {
  return (
    <StyledModal width={0} onDismiss={onDismiss} padding="0" closebtn={false}>
      <RoundedBox>
        <FlexLayout light="dark" cols={false} style={{ backgroundColor: "transparent" }}>
          <Votes
            votes={votes as VoteProp[]}
            totalVotes={votes?.length ?? proposal.votes}
            votesLoadingStatus={votesLoadingStatus}
          />
        </FlexLayout>
      </RoundedBox>
    </StyledModal>
  );
};

export default ViewVotesModal;
