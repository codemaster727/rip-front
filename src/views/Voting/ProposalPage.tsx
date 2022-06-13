// eslint-disable-next-line camelcase
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ProposalState } from "src/slices/types";
import { getProposal } from "src/slices/voting/helpers";
import Overview from "src/views/Voting/Proposal/Overview";
import { SWRConfig, unstable_serialize } from "swr";

const ProposalPage: React.FC = () => {
  const [fallback, setFallback] = useState({});
  const { history } = useHistory();
  const params: any = useParams();
  const { id } = params || {};

  const getVoting = async (id: string) => {
    if (typeof id !== "string") {
      history.push("404");
      return null;
    }

    try {
      const fetchedProposal: any = await getProposal(id);
      if (!fetchedProposal) {
        history.push("404");
        return null;
      }
      setFallback({ [unstable_serialize(["proposal", id])]: fetchedProposal });
      const revalidate = fetchedProposal.state === ProposalState.CLOSED ? 60 * 60 * 12 : 3;
      setTimeout(() => {
        getVoting(id);
      }, revalidate);
    } catch (error) {
      setFallback({});
      setTimeout(() => {
        getVoting(id);
      }, 60);
    }
  };

  useEffect(() => {
    getVoting(id);
  }, []);

  return (
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <Overview />
    </SWRConfig>
  );
};

export default ProposalPage;
