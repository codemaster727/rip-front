import { Paper } from "@olympusdao/component-library";
import { Flex } from "@pancakeswap/uikit";
import { Link } from "react-router-dom";
import { PageMeta } from "src/components/Layout/Page";
import StyledButton from "src/components/StyledButton";
import styled from "styled-components";

import { Proposals } from "./components/Proposals";

const Content = styled.div`
  flex: 1;
  height: 100%;
`;

const Voting = () => {
  return (
    <>
      <div className="content-container">
        <Paper className="blur7" style={{ maxWidth: "100%" }}>
          <Flex flexDirection={"column"} width="100%" justifyContent="center" position="relative" pt="2rem">
            <PageMeta />
            <Flex flexDirection="column" minHeight="calc(70vh)">
              <Content>
                <Proposals />
              </Content>
              <Link to="/voting/proposal_create" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <StyledButton light="light">make a proposal</StyledButton>
              </Link>
            </Flex>
          </Flex>
        </Paper>
      </div>
    </>
  );
};

export default Voting;
