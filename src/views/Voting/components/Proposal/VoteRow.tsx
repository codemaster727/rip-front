import { CheckmarkCircleIcon, Flex, Link, Tag, Text } from "@pancakeswap/uikit";
import { useTranslation } from "src/contexts/Localization";
import { Vote } from "src/slices/types";
import { getBscScanLink } from "src/utils";
import truncateHash from "src/utils/truncateHash";

import { IPFS_GATEWAY } from "../../config";
// import TextEllipsis from "../TextEllipsis";
import Row, { AddressColumn, ChoiceColumn, VotingPowerColumn } from "./Row";

interface VoteRowProps {
  vote: Vote;
  isVoter: boolean;
}

const VoteRow: React.FC<VoteRowProps> = ({ vote, isVoter }) => {
  const { t } = useTranslation();
  const hasVotingPower = !!vote.metadata?.votingPower;

  const votingPower = hasVotingPower
    ? parseFloat(vote.metadata?.votingPower as string).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      })
    : "--";

  return (
    <Row>
      <ChoiceColumn>
        <Text color="white">{vote.proposal.choices[vote.choice - 1]}</Text>
      </ChoiceColumn>
      <AddressColumn>
        <Flex alignItems="center">
          <Link href={getBscScanLink(vote.voter, "address")} external={true}>
            {truncateHash(vote.voter)}
          </Link>
          {isVoter && (
            <Tag variant="success" outline ml="8px">
              <CheckmarkCircleIcon mr="4px" /> {t("Voted")}
            </Tag>
          )}
        </Flex>
      </AddressColumn>
      <VotingPowerColumn>
        <Flex alignItems="center" justifyContent="end">
          <Text title={vote.metadata?.votingPower as string}>{votingPower}</Text>
          {hasVotingPower && <Link href={`${IPFS_GATEWAY}/${vote.id}`} external={true} />}
        </Flex>
      </VotingPowerColumn>
    </Row>
  );
};

export default VoteRow;
