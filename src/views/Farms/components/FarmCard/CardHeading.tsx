import { Token } from "@pancakeswap/sdk";
import { Flex, Heading, Tag } from "@pancakeswap/uikit";
// import { CoreTag, FarmAuctionTag } from "src/components/Tags";
// import { TokenPairImage } from "src/components/TokenImage";
import { CurrencyLogo } from "src/components/Logo";
import styled from "styled-components";

export interface ExpandableSectionProps {
  lpLabel?: string;
  multiplier?: string;
  isCommunityFarm?: boolean;
  token: Token;
  quoteToken: Token;
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`;

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`;

const CardHeading: React.FC<ExpandableSectionProps> = ({ lpLabel, multiplier, isCommunityFarm, token, quoteToken }) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      {/* <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={64} height={64} /> */}
      <CurrencyLogo currency={token} size="36" style={{ marginRight: "8px", width: "36px" }} />
      <Flex flexDirection="row" alignItems="center" justifyContent="center">
        <Heading mb="4px" className="farm-card-title">
          {lpLabel?.split(" ")[0]}
        </Heading>
        {/* <Flex justifyContent="center">
          {isCommunityFarm ? <FarmAuctionTag /> : <CoreTag />}
          {multiplier ? (
            <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
          ) : (
            <Skeleton ml="4px" width={42} height={28} />
          )}
        </Flex> */}
      </Flex>
      <CurrencyLogo currency={quoteToken} size="36" style={{ marginLeft: "8px", width: "36px" }} />
    </Wrapper>
  );
};

export default CardHeading;
