import { Paper } from "@olympusdao/component-library";
import { Box, Button, Flex, Heading, useMatchBreakpoints, useModal } from "@pancakeswap/uikit";
import { Link, useLocation, useParams } from "react-router-dom";
import BackBlackIcon from "src/assets/icons/back-black.svg";
import Container from "src/components/Layout/Container";
import { PageMeta } from "src/components/Layout/Page";
import PageLoader from "src/components/Loader/PageLoader";
import ReactMarkdown from "src/components/ReactMarkdown";
import ViewVotesModal from "src/components/ViewVotesModal";
import { FetchStatus } from "src/constants/types";
import { useTranslation } from "src/contexts/Localization";
import { useWeb3Context } from "src/hooks";
import { Proposal, ProposalState, Vote as VoteProp } from "src/slices/types";
import { getAllVotes, getProposal } from "src/slices/voting/helpers";
import NotFound from "src/views/NotFound";
import useSWRImmutable from "swr/immutable";

// import Layout from "../components/Layout";
import { ProposalStateTag, ProposalTypeTag } from "../components/Proposals/tags";
import { isCoreProposal } from "../helpers";
import Details from "./Details";
import Results from "./Results";
import Vote from "./Vote";

const Overview = () => {
  const { query, isFallback } = useLocation();
  const params: any = useParams();
  const id = params.id as string;
  const { t } = useTranslation();
  const { account } = useWeb3Context();

  const { isMobile } = useMatchBreakpoints();

  const {
    //@ts-ignore
    status: proposalLoadingStatus,
    data: proposal,
    error,
  } = useSWRImmutable(id ? ["proposal", id] : null, () => getProposal(id));

  const {
    status: votesLoadingStatus,
    data: votes,
    mutate: refetch,
  } = useSWRImmutable(proposal ? ["proposal", proposal, "votes"] : null, async () => getAllVotes(proposal as Proposal));
  const hasAccountVoted =
    account && votes && votes.some((vote: any) => vote.voter.toLowerCase() === account.toLowerCase());

  const isPageLoading = votesLoadingStatus === FetchStatus.Fetching || proposalLoadingStatus === FetchStatus.Fetching;

  const [onPresentViewVotesModal] = useModal(
    <ViewVotesModal
      proposal={proposal as Proposal}
      votes={votes as VoteProp[]}
      votesLoadingStatus={votesLoadingStatus}
    />,
  );

  if (!proposal && error) {
    return <NotFound />;
  }

  if (isFallback || !proposal) {
    return <PageLoader />;
  }

  return (
    <div className="content-container">
      <Paper className="blur7" style={{ maxWidth: "100%" }}>
        <Flex flexDirection={"column"} width="100%" justifyContent="center" position="relative" pt="1rem">
          <Container py="0px">
            <PageMeta />
            <Box mb="32px">
              <Flex alignItems="center" mb="8px" justifyContent="center">
                <Link to="/voting">
                  <Button as="a" variant="text" px="0">
                    <img src={BackBlackIcon} width={36} />
                  </Button>
                </Link>
                <Heading
                  as="h2"
                  scale="md"
                  id="voting-proposals"
                  textAlign="center"
                  mt="0"
                  color="black"
                  maxWidth="80%"
                  marginBottom={0}
                  marginLeft="8px"
                >
                  {proposal.title}
                </Heading>
              </Flex>
            </Box>
            <Box>
              <Flex flexDirection={isMobile ? "column" : "row"} alignItems="center" style={{ gap: "2rem" }}>
                <Box width={isMobile ? "100%" : "50%"} mb="1rem">
                  <Box color="black">
                    <ReactMarkdown>{proposal.body}</ReactMarkdown>
                  </Box>
                  <ProposalStateTag proposalState={proposal.state} />
                  <ProposalTypeTag isCoreProposal={isCoreProposal(proposal)} marginLeft={2} />
                </Box>
                {!isPageLoading && !hasAccountVoted && proposal.state === ProposalState.ACTIVE && (
                  <Vote proposal={proposal} onSuccess={refetch} mb="1rem" />
                )}
                <Results
                  choices={proposal.choices}
                  votes={votes as VoteProp[]}
                  votesLoadingStatus={votesLoadingStatus}
                  onPresentViewVotesModal={onPresentViewVotesModal}
                />
                <Details proposal={proposal} />
              </Flex>
            </Box>
          </Container>
        </Flex>
      </Paper>
    </div>
  );
};

export default Overview;
