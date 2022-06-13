import { Box, Button, Flex, Heading, ProposalIcon } from "@pancakeswap/uikit";
import { Link } from "react-router-dom";
import Container from "src/components/Layout/Container";
import { useTranslation } from "src/contexts/Localization";
import styled from "styled-components";

import DesktopImage from "./DesktopImage";

const StyledHero = styled(Box)`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
  padding-bottom: 32px;
  padding-top: 32px;
`;

const Hero = () => {
  const { t } = useTranslation();

  return (
    <StyledHero>
      <Container>
        <Flex alignItems="center" justifyContent="space-between">
          <Box pr="32px">
            <Heading as="h1" scale="xxl" color="secondary" mb="16px">
              {t("Voting")}
            </Heading>
            <Heading as="h3" scale="lg" mb="16px">
              {t("Have your say in the future of the PancakeSwap Ecosystem")}
            </Heading>
            <Link to="/voting/proposal/create">
              <Button startIcon={<ProposalIcon color="currentColor" width="24px" />}>{t("Make a Proposal")}</Button>
            </Link>
          </Box>
          <DesktopImage src="/images/voting/voting-presents.png" width={361} height={214} />
        </Flex>
      </Container>
    </StyledHero>
  );
};

export default Hero;
