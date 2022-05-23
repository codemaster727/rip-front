import { ButtonMenuItem, NotificationDot } from "@pancakeswap/uikit";
import { Link, useLocation } from "react-router-dom";
import { StyledButtonMenuBlack } from "src/components/SearchModal/Manage";
// import { NextLinkFromReactRouter } from "src/components/NextLink";
import { useTranslation } from "src/contexts/Localization";
import styled from "styled-components";

interface FarmTabButtonsProps {
  hasStakeInFinishedFarms: boolean;
}

const FarmTabButtons: React.FC<FarmTabButtonsProps> = ({ hasStakeInFinishedFarms }) => {
  const location = useLocation();
  const { t } = useTranslation();

  let activeIndex;
  switch (location.pathname) {
    case "/farms":
      activeIndex = 0;
      break;
    case "/farms/history":
      activeIndex = 1;
      break;
    case "/farms/archived":
      activeIndex = 2;
      break;
    default:
      activeIndex = 0;
      break;
  }

  return (
    <Wrapper style={{ padding: "0px" }}>
      <StyledButtonMenuBlack activeIndex={activeIndex} scale="md" variant="subtle">
        <ButtonMenuItem
          style={{
            backgroundColor: activeIndex === 0 ? "#00FCB0" : "transparent",
            color: activeIndex === 0 ? "black" : "#09FDB5",
            borderRadius: "40px",
          }}
          as={Link}
          width="100px"
          to="/farms"
        >
          {t("Live")}
        </ButtonMenuItem>
        <NotificationDot show={hasStakeInFinishedFarms}>
          <ButtonMenuItem
            style={{
              backgroundColor: activeIndex === 1 ? "#00FCB0" : "transparent",
              color: activeIndex === 1 ? "black" : "#09FDB5",
              borderRadius: "40px",
            }}
            as={Link}
            to="/farms/history"
            id="finished-farms-button"
          >
            {t("Finished")}
          </ButtonMenuItem>
        </NotificationDot>
      </StyledButtonMenuBlack>
    </Wrapper>
  );
};

export default FarmTabButtons;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 0px;
  }
`;
