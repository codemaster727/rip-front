import { Flex, Heading } from "@pancakeswap/uikit";
import { useState } from "react";
import FlexLayout from "src/components/Layout/Flex";
import RoundedBox from "src/components/RoundedBox";
import { FetchStatus } from "src/constants/types";
import { useTranslation } from "src/contexts/Localization";
import { useSessionStorage } from "src/hooks/useSessionStorage";
import { Proposal, ProposalState, ProposalType } from "src/slices/types";
import { getProposals } from "src/slices/voting/helpers";
import VotingTabButtons from "src/views/Farms/components/VotingTabButtons";
import useSWR from "swr";

import { filterProposalsByState, filterProposalsByType } from "../../helpers";
import Filters from "./Filters";
import ProposalRow from "./ProposalRow";
import ProposalsLoading from "./ProposalsLoading";

interface State {
  proposalType: ProposalType;
  filterState: ProposalState;
}

const Proposals = () => {
  const { t } = useTranslation();
  const [state, setState] = useSessionStorage<State>("proposals-filter", {
    proposalType: ProposalType.CORE,
    filterState: ProposalState.ACTIVE,
  });
  const [activeIndex, setIndex] = useState(0);

  const { proposalType, filterState } = state;

  const { status, data } = useSWR(["proposals", filterState], async () => getProposals(1000, 0, filterState));

  const handleProposalTypeChange = (newProposalType: ProposalType) => {
    setState((prevState: any) => ({
      ...prevState,
      proposalType: newProposalType,
    }));
  };

  const handleFilterChange = (newFilterState: ProposalState) => {
    setState((prevState: any) => ({
      ...prevState,
      filterState: newFilterState,
    }));
  };

  const filteredProposals = filterProposalsByState(
    filterProposalsByType(data as Proposal[], proposalType),
    filterState,
  );

  return (
    <div>
      <Heading as="h4" scale="lg" mb="32px" id="voting-proposals" textAlign="center" mt="0" color="black">
        {t("Voting")}
      </Heading>
      <VotingTabButtons proposalType={proposalType} onTypeChange={handleProposalTypeChange} />
      <Filters
        filterState={filterState}
        onFilterChange={handleFilterChange}
        isLoading={status !== FetchStatus.Fetched}
      />
      <br />
      <br />
      <RoundedBox>
        <FlexLayout light="dark" cols={false} style={{ backgroundColor: "transparent", maxHeight: "420px" }}>
          {status !== FetchStatus.Fetched && <ProposalsLoading />}
          {status === FetchStatus.Fetched &&
            filteredProposals.length > 0 &&
            filteredProposals.map(proposal => {
              return <ProposalRow key={proposal.id} proposal={proposal} />;
            })}
          {status === FetchStatus.Fetched && filteredProposals.length === 0 && (
            <Flex alignItems="center" justifyContent="center" p="32px">
              <Heading as="h5">{t("No proposals found")}</Heading>
            </Flex>
          )}
        </FlexLayout>
      </RoundedBox>
    </div>
  );
};

export default Proposals;
