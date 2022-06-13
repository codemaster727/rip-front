import { ButtonMenuItem, CommunityIcon, useMatchBreakpoints } from "@pancakeswap/uikit";
import { useState } from "react";
import { StyledButtonMenuBlack } from "src/components/SearchModal/Manage";
import { useTranslation } from "src/contexts/Localization";
import { ProposalType } from "src/slices/types";
import styled from "styled-components";

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

const VotingTabButtons: React.FC<any> = ({ proposalType, onTypeChange }) => {
  const [activeIndex, setIndex] = useState(0);
  const { t } = useTranslation();
  const { isMobile, isTablet } = useMatchBreakpoints();

  const handleClick = (index: number) => {
    setIndex(index);
    onTypeChange(getTypeFromIndex(index));
  };

  return (
    <Wrapper
      style={{
        padding: "0px",
        width: isMobile || isTablet ? "100%" : "65%",
        fontFamily: "Lato",
        margin: "auto",
      }}
    >
      <StyledButtonMenuBlack
        activeIndex={activeIndex}
        scale={isMobile || isTablet ? "sm" : "md"}
        variant="subtle"
        onItemClick={handleClick}
      >
        <ButtonMenuItem
          style={{
            backgroundColor: activeIndex === 0 ? "#00FCB0" : "transparent",
            color: activeIndex === 0 ? "black" : "#09FDB5",
            borderRadius: "40px",
            marginTop: "-1px",
            marginLeft: "-1px",
          }}
        >
          {t("core")}
        </ButtonMenuItem>
        <ButtonMenuItem
          style={{
            backgroundColor: activeIndex === 1 ? "#00FCB0" : "transparent",
            color: activeIndex === 1 ? "black" : "#09FDB5",
            borderRadius: "40px",
            marginTop: "-1px",
            marginLeft: "-1px",
          }}
        >
          {t("community")}
          <CommunityIcon color="currentColor" ml="0.3rem" />
        </ButtonMenuItem>
        <ButtonMenuItem
          style={{
            backgroundColor: activeIndex === 2 ? "#00FCB0" : "transparent",
            color: activeIndex === 2 ? "black" : "#09FDB5",
            borderRadius: "40px",
            marginTop: "-1px",
            marginRight: "-1px",
          }}
        >
          {t("all")}
        </ButtonMenuItem>
      </StyledButtonMenuBlack>
    </Wrapper>
  );
};

export default VotingTabButtons;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 0px;
  }
`;
