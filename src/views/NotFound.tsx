import { Button, Heading, LogoIcon, Text } from "@pancakeswap/uikit";
import { Link } from "react-router-dom";
import Page from "src/components/Layout/Page";
import { useTranslation } from "src/contexts/Localization";
import styled from "styled-components";

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: center;
`;

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <Page>
      <StyledNotFound>
        <LogoIcon width="64px" mb="8px" />
        <Heading scale="xxl">404</Heading>
        <Text mb="16px">{t("Oops, page not found.")}</Text>
        <Link to="/">
          <Button as="a" scale="sm">
            {t("Back Home")}
          </Button>
        </Link>
      </StyledNotFound>
    </Page>
  );
};

export default NotFound;
