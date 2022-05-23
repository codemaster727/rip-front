import { AddIcon, Button, Flex, IconButton, MinusIcon, useModal } from "@pancakeswap/uikit";
import BigNumber from "bignumber.js";
import { useLocation } from "react-router-dom";
import { ToastDescriptionWithTx } from "src/components/Toast";
import { useTranslation } from "src/contexts/Localization";
import { useWeb3Context } from "src/hooks";
import { useAppDispatch } from "src/hooks";
import useCatchTxError from "src/hooks/useCatchTxError";
import useToast from "src/hooks/useToast";
import { fetchFarmUserDataAsync } from "src/slices/farms";
import { useFarmUser, useLpTokenPrice, usePriceCakeBusd } from "src/slices/farms/hooks";
import styled from "styled-components";

import useStakeFarms from "../../hooks/useStakeFarms";
import useUnstakeFarms from "../../hooks/useUnstakeFarms";
import DepositModal from "../DepositModal";
import StakedLP from "../StakedLP";
import { FarmWithStakedValue } from "../types";
import WithdrawModal from "../WithdrawModal";

interface FarmCardActionsProps extends FarmWithStakedValue {
  lpLabel?: string;
  addLiquidityUrl?: string;
  displayApr?: string;
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`;

const StakeAction: React.FC<FarmCardActionsProps> = ({
  quoteToken,
  token,
  lpSymbol,
  pid,
  multiplier,
  apr,
  displayApr,
  addLiquidityUrl,
  lpLabel,
  lpTotalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
}) => {
  const { t } = useTranslation();
  const { onStake } = useStakeFarms(pid);
  const { onUnstake } = useUnstakeFarms(pid);
  const { tokenBalance, stakedBalance } = useFarmUser(pid);
  const cakePrice = usePriceCakeBusd();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { address: account } = useWeb3Context();
  const lpPrice = useLpTokenPrice(lpSymbol);
  const { toastSuccess } = useToast();
  const { fetchWithCatchTxError } = useCatchTxError();

  const handleStake = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => {
      return onStake(amount);
    });
    if (receipt?.status) {
      toastSuccess(
        `${t("Staked")}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t("Your funds have been staked in the farm")}
        </ToastDescriptionWithTx>,
      );
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }));
    }
  };

  const handleUnstake = async (amount: string) => {
    const receipt = await fetchWithCatchTxError(() => {
      return onUnstake(amount);
    });
    if (receipt?.status) {
      toastSuccess(
        `${t("Unstaked")}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t("Your earnings have also been harvested to your wallet")}
        </ToastDescriptionWithTx>,
      );
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }));
    }
  };

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      stakedBalance={stakedBalance}
      onConfirm={handleStake}
      tokenName={lpSymbol}
      multiplier={multiplier}
      lpPrice={lpPrice}
      lpLabel={lpLabel}
      apr={apr}
      displayApr={displayApr}
      addLiquidityUrl={addLiquidityUrl}
      cakePrice={cakePrice}
    />,
  );
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName={lpSymbol} />,
  );

  const renderStakingButtons = () => {
    return stakedBalance.eq(0) ? (
      <Button onClick={onPresentDeposit} disabled={["history", "archived"].some(item => location.includes(item))}>
        {t("Stake LP")}
      </Button>
    ) : (
      <IconButtonWrapper>
        <IconButton variant="tertiary" onClick={onPresentWithdraw} mr="6px">
          <MinusIcon color="primary" width="14px" />
        </IconButton>
        <IconButton
          variant="tertiary"
          onClick={onPresentDeposit}
          disabled={["history", "archived"].some(item => location.includes(item))}
        >
          <AddIcon color="primary" width="14px" />
        </IconButton>
      </IconButtonWrapper>
    );
  };

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <StakedLP
        stakedBalance={stakedBalance}
        lpSymbol={lpSymbol}
        quoteTokenSymbol={quoteToken.symbol as string}
        tokenSymbol={token.symbol as string}
        lpTotalSupply={lpTotalSupply as BigNumber}
        tokenAmountTotal={tokenAmountTotal as BigNumber}
        quoteTokenAmountTotal={quoteTokenAmountTotal as BigNumber}
      />
      {renderStakingButtons()}
    </Flex>
  );
};

export default StakeAction;
