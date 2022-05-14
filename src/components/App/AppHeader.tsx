import { Flex, Heading, IconButton, NotificationDot, Text } from "@pancakeswap/uikit";
import { Link } from "react-router-dom";
import BackIcon from "src/assets/icons/back.svg";
import styled from "styled-components";

import { useExpertModeManager } from "../../slices/user/hooks";
import GlobalSettings from "../Menu/GlobalSettings";
import QuestionHelper from "../QuestionHelper";
import Transactions from "./Transactions";

interface Props {
  title: string;
  subtitle: string;
  helper?: string;
  backTo?: string;
  noConfig?: boolean;
}

const AppHeaderContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  width: 100%;
  // border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background: transparent;
  color: white;
`;

const AppHeader: React.FC<Props> = ({ title, subtitle, helper, backTo, noConfig = false }) => {
  const [expertMode] = useExpertModeManager();

  return (
    <AppHeaderContainer>
      <Flex alignItems="center" mr={noConfig ? 0 : "16px"}>
        {backTo && (
          <Link to={backTo}>
            <IconButton as="a">
              {/* <ArrowBackIcon width="32px" /> */}
              <img src={BackIcon} width={32} />
            </IconButton>
          </Link>
        )}
        <Flex flexDirection="column" marginLeft={backTo ? 3 : 0}>
          <Heading as="h2" mb="8px" color="white">
            {title}
          </Heading>
          <Flex alignItems="center">
            {helper && <QuestionHelper text={helper} mr="4px" placement="top-start" />}
            <Text color="white" fontSize="14px">
              {subtitle}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      {!noConfig && (
        <Flex flexDirection="column" alignItems="center">
          <NotificationDot show={expertMode}>
            <GlobalSettings icon="green" />
          </NotificationDot>
          <Transactions />
        </Flex>
      )}
    </AppHeaderContainer>
  );
};

export default AppHeader;
