import { CommunityIcon, Flex, Tab, TabMenu as UIKitTabMenu, VerifiedIcon } from "@pancakeswap/uikit";
import { useTranslation } from "src/contexts/Localization";
import { ProposalType } from "src/slices/types";
import styled from "styled-components";

interface TabMenuProps {
  proposalType: ProposalType;
  onTypeChange: (proposalType: ProposalType) => void;
}

const StyledTabMenu = styled.div`
  background-color: ${({ theme }) => theme.colors.input};
  padding-top: 16px;
`;

const getIndexFromType = (proposalType: ProposalType) => {
  switch (proposalType) {
    case ProposalType.COMMUNITY:
      return 1;
    case ProposalType.ALL:
      return 2;
    case ProposalType.CORE:
    default:
      return 0;
  }
};

const getTypeFromIndex = (index: number) => {
  switch (index) {
    case 1:
      return ProposalType.COMMUNITY;
    case 2:
      return ProposalType.ALL;
    default:
      return ProposalType.CORE;
  }
};

const TabMenu: React.FC<TabMenuProps> = ({ proposalType, onTypeChange }) => {
  const { t } = useTranslation();
  const handleItemClick = (index: number) => {
    onTypeChange(getTypeFromIndex(index));
  };

  return (
    <StyledTabMenu>
      <UIKitTabMenu activeIndex={getIndexFromType(proposalType)} onItemClick={handleItemClick}>
        <Tab>
          <Flex alignItems="center">
            <VerifiedIcon color="currentColor" mr="4px" />
            {t("Core")}
          </Flex>
        </Tab>
        <Tab>
          {" "}
          <Flex alignItems="center">
            <CommunityIcon color="currentColor" mr="4px" />
            {t("Community")}
          </Flex>
        </Tab>
        <Tab>All</Tab>
      </UIKitTabMenu>
    </StyledTabMenu>
  );
};

export default TabMenu;
