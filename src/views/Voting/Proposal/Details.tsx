import { Box, Flex, Link, Text } from "@pancakeswap/uikit";
// import { format } from "date-fns";
import { useTranslation } from "src/contexts/Localization";
import { Proposal } from "src/slices/types";
import { getBscScanLink } from "src/utils";
import truncateHash from "src/utils/truncateHash";
import styled from "styled-components";

// import { ProposalStateTag } from "../components/Proposals/tags";
import { IPFS_GATEWAY } from "../config";

interface DetailsProps {
  proposal: Proposal;
}

const DetailBox = styled(Box)`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
`;

const Details: React.FC<DetailsProps> = ({ proposal }) => {
  const { t } = useTranslation();
  const startDate = new Date(proposal.start * 1000);
  const endDate = new Date(proposal.end * 1000);

  return (
    <div style={{ margin: "2rem", marginTop: "0" }}>
      {/* <Heading as="h3" scale="md">
        {t("details")}
      </Heading> */}
      <Text color="blueish_gray" bold={true}>
        {t("identifier")}
      </Text>
      <Flex alignItems="center" mb="8px">
        <Link href={`${IPFS_GATEWAY}/${proposal.id}`} color="blueish_gray" bold={false} external={true}>
          {proposal.id.slice(0, 8)}
        </Link>
      </Flex>
      <Text color="blueish_gray" bold={true}>
        {t("creator")}
      </Text>
      <Flex alignItems="center" mb="8px">
        <Link href={getBscScanLink(proposal.author, "address")} color="blueish_gray" bold={false} external={true}>
          {truncateHash(proposal.author)}
        </Link>
      </Flex>
      <Text color="blueish_gray" bold={true}>
        {t("snapshot")}
      </Text>
      <Flex alignItems="center" mb="16px">
        <Link href={getBscScanLink(proposal.snapshot, "block")} color="blueish_gray" bold={false} external={true}>
          {proposal.snapshot}
        </Link>
      </Flex>
      {/* <DetailBox p="16px">
        <ProposalStateTag proposalState={proposal.state} mb="8px" />
        <Flex alignItems="center">
          <Text color="textSubtle" fontSize="14px">
            {t("Start Date")}
          </Text>
          <Text>{format(startDate, "yyyy-MM-dd HH:mm")}</Text>
        </Flex>
        <Flex alignItems="center">
          <Text color="textSubtle" fontSize="14px">
            {t("End Date")}
          </Text>
          <Text>{format(endDate, "yyyy-MM-dd HH:mm")}</Text>
        </Flex>
      </DetailBox> */}
    </div>
  );
};

export default Details;
