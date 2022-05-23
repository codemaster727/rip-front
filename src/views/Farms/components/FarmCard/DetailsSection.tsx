import { Flex, LinkExternal, Skeleton, Text } from "@pancakeswap/uikit";
import { useTranslation } from "src/contexts/Localization";
import styled from "styled-components";

export interface ExpandableSectionProps {
  bscScanAddress?: string;
  infoAddress?: string;
  removed?: boolean;
  totalValueFormatted?: string;
  lpLabel?: string;
  addLiquidityUrl?: string;
}

const Wrapper = styled.div`
  margin-top: 24px;
`;

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`;

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  bscScanAddress,
  infoAddress,
  removed,
  totalValueFormatted,
  lpLabel,
  addLiquidityUrl,
}) => {
  const { t } = useTranslation();

  return (
    <Flex justifyContent="space-between">
      <Text>{t("Total Liquidity")}:</Text>
      {totalValueFormatted ? <Text>{totalValueFormatted}</Text> : <Skeleton width={75} height={25} />}
    </Flex>
  );
};

export default DetailsSection;
