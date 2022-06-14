import {
  Box,
  // CardHeader,
  // CheckmarkCircleIcon,
  Flex,
  Heading,
  Progress,
  Skeleton,
  // Tag,
  Text,
} from "@pancakeswap/uikit";
import { Handler } from "puppeteer";
import StyledButton from "src/components/StyledButton";
import { FetchStatus } from "src/constants/types";
import { useTranslation } from "src/contexts/Localization";
import { useWeb3Context } from "src/hooks";
import { Vote } from "src/slices/types";
import { formatNumber } from "src/utils/formatBalance";

import TextEllipsis from "../components/TextEllipsis";
import { calculateVoteResults, getTotalFromVotes } from "../helpers";

interface ResultsProps {
  choices: string[];
  votes: Vote[];
  votesLoadingStatus: FetchStatus;
  onPresentViewVotesModal: Handler;
}

const Results: React.FC<ResultsProps> = ({ choices, votes, votesLoadingStatus, onPresentViewVotesModal }) => {
  const { t } = useTranslation();
  const results = calculateVoteResults(votes);
  const { account } = useWeb3Context();
  const totalVotes = getTotalFromVotes(votes);

  return (
    <div style={{ marginBottom: "1rem" }}>
      <Heading as="h3" scale="md" color="black">
        {t("current votes")}
      </Heading>
      {votesLoadingStatus === FetchStatus.Fetched &&
        choices.map((choice, index) => {
          const choiceVotes = results[choice] || [];
          const totalChoiceVote = getTotalFromVotes(choiceVotes);
          const progress = totalVotes === 0 ? 0 : (totalChoiceVote / totalVotes) * 100;
          const hasVoted = choiceVotes.some(vote => {
            return account && vote.voter.toLowerCase() === account.toLowerCase();
          });

          return (
            <Box key={choice} mt={index > 0 ? "24px" : "0px"}>
              {/* <Flex alignItems="center" mb="8px">
                <TextEllipsis color="black" mb="4px" title={choice}>
                  {choice}
                </TextEllipsis>
                {hasVoted && (
                  <Tag variant="success" outline ml="8px">
                    <CheckmarkCircleIcon mr="4px" /> {t("Voted")}
                  </Tag>
                )}
              </Flex> */}
              <Box mb="4px" className="progress_div">
                <Progress primaryStep={progress} scale="sm" />
              </Box>
              <Flex alignItems="center" justifyContent="space-between">
                <Text color="blueish_gray">{t("%total% Votes", { total: formatNumber(totalChoiceVote, 0, 2) })}</Text>
                <Text color="blueish_gray">
                  {progress.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                </Text>
              </Flex>
            </Box>
          );
        })}

      <StyledButton onClick={onPresentViewVotesModal} light="light" marginTop="1rem" marginRight="auto">
        {t("view votes")}
      </StyledButton>

      {votesLoadingStatus === FetchStatus.Fetching &&
        choices.map((choice, index) => {
          return (
            <Box key={choice} mt={index > 0 ? "24px" : "0px"}>
              <Flex alignItems="center" mb="8px">
                <TextEllipsis color="black" mb="4px" title={choice}>
                  {choice}
                </TextEllipsis>
              </Flex>
              <Box mb="4px">
                <Skeleton height="36px" mb="4px" />
              </Box>
            </Box>
          );
        })}
    </div>
  );
};

export default Results;
