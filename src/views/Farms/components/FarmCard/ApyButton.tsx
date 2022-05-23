import { CalculateIcon, Flex, IconButton, useModal } from "@pancakeswap/uikit";
import BigNumber from "bignumber.js";
import RoiCalculatorModal from "src/components/RoiCalculatorModal";
import { useTranslation } from "src/contexts/Localization";
import { useFarmUser, useLpTokenPrice } from "src/slices/farms/hooks";
import styled from "styled-components";

const ApyLabelContainer = styled(Flex)`
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
`;

export interface ApyButtonProps {
  variant: "text" | "text-and-button";
  pid: number;
  lpSymbol: string;
  lpLabel?: string;
  multiplier: string;
  cakePrice?: BigNumber;
  apr?: number;
  displayApr?: string;
  addLiquidityUrl?: string;
}

const ApyButton: React.FC<ApyButtonProps> = ({
  variant,
  pid,
  lpLabel,
  lpSymbol,
  cakePrice,
  apr,
  multiplier,
  displayApr,
  addLiquidityUrl,
}) => {
  const { t } = useTranslation();
  const lpPrice = useLpTokenPrice(lpSymbol);
  const { tokenBalance, stakedBalance } = useFarmUser(pid);
  const [onPresentApyModal] = useModal(
    <RoiCalculatorModal
      linkLabel={t("Get %symbol%", { symbol: lpLabel as string })}
      stakingTokenBalance={stakedBalance.plus(tokenBalance)}
      stakingTokenSymbol={lpSymbol}
      stakingTokenPrice={lpPrice.toNumber()}
      earningTokenPrice={cakePrice?.toNumber() as number}
      apr={apr}
      multiplier={multiplier}
      displayApr={displayApr}
      linkHref={addLiquidityUrl as string}
      isFarm
    />,
  );

  const handleClickButton = (event: any): void => {
    event.stopPropagation();
    onPresentApyModal();
  };

  return (
    <ApyLabelContainer alignItems="center" onClick={handleClickButton}>
      {displayApr}%
      {variant === "text-and-button" && (
        <IconButton variant="text" scale="sm" ml="4px">
          <CalculateIcon width="18px" />
        </IconButton>
      )}
    </ApyLabelContainer>
  );
};

export default ApyButton;
