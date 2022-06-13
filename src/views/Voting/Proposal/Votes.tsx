import {
  // AutoRenewIcon,
  // Button,
  // CardHeader,
  // ChevronDownIcon,
  // ChevronUpIcon,
  Flex,
  Heading,
} from "@pancakeswap/uikit";
import orderBy from "lodash/orderBy";
import { useState } from "react";
import { FetchStatus } from "src/constants/types";
import { useTranslation } from "src/contexts/Localization";
import { useWeb3Context } from "src/hooks";
import { Vote } from "src/slices/types";

import VoteRow from "../components/Proposal/VoteRow";
import VotesLoading from "../components/Proposal/VotesLoading";

const VOTES_PER_VIEW = 20;

interface VotesProps {
  votes: Vote[];
  totalVotes?: number;
  votesLoadingStatus: FetchStatus;
}

const parseVotePower = (incomingVote: Vote) => {
  let votingPower = parseFloat(incomingVote?.metadata?.votingPower as string);
  if (!votingPower) votingPower = 0;
  return votingPower;
};

const Votes: React.FC<VotesProps> = ({ votes, votesLoadingStatus, totalVotes }) => {
  const [showAll, setShowAll] = useState(true);
  const { t } = useTranslation();
  const { account } = useWeb3Context();
  const orderedVotes = orderBy(votes, [parseVotePower, "created"], ["desc", "desc"]);
  const displayVotes = showAll ? orderedVotes : orderedVotes.slice(0, VOTES_PER_VIEW);
  const isFetched = votesLoadingStatus === FetchStatus.Fetched;

  const handleClick = () => {
    setShowAll(!showAll);
  };

  return (
    <div>
      {/* <Flex alignItems="center" justifyContent="space-between">
        <Heading as="h3" scale="md">
          {t("Votes (%count%)", { count: totalVotes ? totalVotes.toLocaleString() : "-" })}
        </Heading>
        {!isFetched && <AutoRenewIcon spin width="22px" />}
      </Flex> */}
      {!isFetched && <VotesLoading />}

      {isFetched && displayVotes.length > 0 && (
        <>
          {displayVotes.map(vote => {
            const isVoter = account && vote.voter.toLowerCase() === account.toLowerCase();
            return <VoteRow key={vote.id} vote={vote} isVoter={isVoter as boolean} />;
          })}
          {/* <Flex alignItems="center" justifyContent="center" py="8px" px="24px">
            <Button
              width="100%"
              onClick={handleClick}
              variant="text"
              endIcon={
                showAll ? (
                  <ChevronUpIcon color="primary" width="21px" />
                ) : (
                  <ChevronDownIcon color="primary" width="21px" />
                )
              }
              disabled={!isFetched}
            >
              {showAll ? t("Hide") : t("See All")}
            </Button>
          </Flex> */}
        </>
      )}

      {isFetched && displayVotes.length === 0 && (
        <Flex alignItems="center" justifyContent="center" py="32px">
          <Heading as="h5">{t("No votes found")}</Heading>
        </Flex>
      )}
    </div>
  );
};

export default Votes;
