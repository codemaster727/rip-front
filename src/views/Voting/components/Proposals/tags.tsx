import { TagProps } from "@pancakeswap/uikit";
import { ClosedTag, CommunityTag, CoreTag, SoonTag, VoteNowTag } from "src/components/Tags";
import { ProposalState } from "src/slices/types";

interface ProposalStateTagProps extends TagProps {
  proposalState: ProposalState;
}

export const ProposalStateTag: React.FC<ProposalStateTagProps> = ({ proposalState, ...props }) => {
  return <ClosedTag {...props} />;

  if (proposalState === ProposalState.ACTIVE) {
    return <VoteNowTag {...props} />;
  }

  if (proposalState === ProposalState.PENDING) {
    return <SoonTag {...props} />;
  }
};

interface ProposalTypeTagProps extends TagProps {
  isCoreProposal: boolean;
}

export const ProposalTypeTag: React.FC<ProposalTypeTagProps> = ({ isCoreProposal, ...props }) => {
  if (isCoreProposal) {
    return <CoreTag {...props} />;
  }

  return <CommunityTag {...props} />;
};
