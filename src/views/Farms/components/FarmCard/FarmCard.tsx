import { Flex, Skeleton, Text } from "@pancakeswap/uikit";
import BigNumber from "bignumber.js";
import { useState } from "react";
import StyledCard from "src/components/StyledCard";
// import ExpandableSectionButton from "src/components/ExpandableSectionButton";
import { BASE_ADD_LIQUIDITY_URL } from "src/constants";
import { useTranslation } from "src/contexts/Localization";
// import { getBscScanLink } from "src/utils";
import { getAddress } from "src/utils/addressHelpers";
import getLiquidityUrlPathParts from "src/utils/getLiquidityUrlPathParts";
import styled from "styled-components";

import { FarmWithStakedValue } from "../types";
import ApyButton from "./ApyButton";
import CardActionsContainer from "./CardActionsContainer";
import CardHeading from "./CardHeading";
// import DetailsSection from "./DetailsSection";

const FarmCardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ExpandingWrapper = styled.div`
  padding: 24px;
  border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
  overflow: hidden;
`;

interface FarmCardProps {
  farm: FarmWithStakedValue;
  displayApr: string;
  removed: boolean;
  cakePrice?: BigNumber;
  account?: string;
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, displayApr, removed, cakePrice, account }) => {
  const { t } = useTranslation();

  const [showExpandableSection, setShowExpandableSection] = useState(false);

  const totalValueFormatted =
    farm.liquidity && farm.liquidity.gt(0)
      ? `$${farm.liquidity.toNumber().toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : "";

  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace("PANCAKE", "");
  const earnLabel = farm.dual ? farm.dual.earnLabel : t("cake + fees");

  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: farm.quoteToken.address,
    tokenAddress: farm.token.address,
  });
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`;
  const lpAddress = getAddress(farm.lpAddresses);
  const isPromotedFarm = farm.token.symbol === "CAKE";

  return (
    <StyledCard isActive={isPromotedFarm} className="styled-card">
      <FarmCardInnerContainer>
        <CardHeading
          lpLabel={lpLabel}
          multiplier={farm.multiplier}
          isCommunityFarm={farm.isCommunity}
          token={farm.token}
          quoteToken={farm.quoteToken}
        />
        {!removed && (
          <Flex justifyContent="space-between" alignItems="center">
            <Text>{t("apr")}:</Text>
            <Text bold style={{ display: "flex", alignItems: "center" }}>
              {/* {farm.apr ? ( */}
              <ApyButton
                variant="text-and-button"
                pid={farm.pid}
                lpSymbol={farm.lpSymbol}
                multiplier={farm.multiplier as string}
                lpLabel={lpLabel}
                addLiquidityUrl={addLiquidityUrl}
                cakePrice={cakePrice}
                apr={farm.apr}
                displayApr={displayApr}
              />
              {/* ) : (
                <Skeleton height={24} width={80} />
              )} */}
            </Text>
          </Flex>
        )}
        <Flex justifyContent="space-between">
          <Text>{t("earn")}:</Text>
          <Text bold>{earnLabel}</Text>
        </Flex>
        <CardActionsContainer
          farm={farm}
          lpLabel={lpLabel}
          account={account}
          addLiquidityUrl={addLiquidityUrl}
          displayApr={displayApr}
        />
        {/* <hr color="#B3FFAB" /> */}
        <Flex justifyContent="space-between" paddingTop={3} marginTop={2} borderTop="2px solid #B3FFAB">
          <Text>{t("Total Liquidity")}:</Text>
          {totalValueFormatted ? <Text>{totalValueFormatted}</Text> : <Skeleton width={75} height={25} />}
        </Flex>
      </FarmCardInnerContainer>

      {/* <ExpandingWrapper>
        <ExpandableSectionButton
          onClick={() => setShowExpandableSection(!showExpandableSection)}
          expanded={showExpandableSection}
        />
        {showExpandableSection && ( */}
      {/* )}
    </ExpandingWrapper> */}
    </StyledCard>
  );
};

export default FarmCard;
