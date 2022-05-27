import { AddIcon, Button, IconButton, MinusIcon, Skeleton, Text, useModal } from "@pancakeswap/uikit";
import BigNumber from "bignumber.js";
import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import ConnectButton from "src/components/ConnectButton/ConnectButton";
import { ToastDescriptionWithTx } from "src/components/Toast";
import { BASE_ADD_LIQUIDITY_URL } from "src/constants";
import { useTranslation } from "src/contexts/Localization";
// import { useWeb3React } from '@web3-react/core'
import { useWeb3Context } from "src/hooks";
import { useAppDispatch } from "src/hooks";
import useCatchTxError from "src/hooks/useCatchTxError";
import { useERC20 } from "src/hooks/useContract";
import useToast from "src/hooks/useToast";
import { fetchFarmUserDataAsync } from "src/slices/farms";
import { useFarmUser, useLpTokenPrice, usePriceCakeBusd } from "src/slices/farms/hooks";
import { getAddress } from "src/utils/addressHelpers";
import getLiquidityUrlPathParts from "src/utils/getLiquidityUrlPathParts";
import styled from "styled-components";

import useApproveFarm from "../../../hooks/useApproveFarm";
import useStakeFarms from "../../../hooks/useStakeFarms";
import useUnstakeFarms from "../../../hooks/useUnstakeFarms";
import DepositModal from "../../DepositModal";
import StakedLP from "../../StakedLP";
import { FarmWithStakedValue } from "../../types";
import WithdrawModal from "../../WithdrawModal";
import { ActionContainer, ActionContent, ActionTitles } from "./styles";

const IconButtonWrapper = styled.div`
  display: flex;
`;

interface StackedActionProps extends FarmWithStakedValue {
  userDataReady: boolean;
  lpLabel?: string;
  displayApr?: string;
}

const Staked: React.FunctionComponent<StackedActionProps> = ({
  pid,
  apr,
  multiplier,
  lpSymbol,
  lpLabel,
  lpAddresses,
  quoteToken,
  token,
  userDataReady,
  displayApr,
  lpTotalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
}) => {
  const { t } = useTranslation();
  const { toastSuccess } = useToast();
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError();
  const { address: account } = useWeb3Context();
  const { allowance, tokenBalance, stakedBalance } = useFarmUser(pid);
  const { onStake } = useStakeFarms(pid);
  const { onUnstake } = useUnstakeFarms(pid);
  const location = useLocation();
  const lpPrice = useLpTokenPrice(lpSymbol);
  const cakePrice = usePriceCakeBusd();

  const isApproved = account && allowance && allowance.isGreaterThan(0);

  const lpAddress = getAddress(lpAddresses);
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
  });
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`;

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
      lpPrice={lpPrice}
      lpLabel={lpLabel}
      apr={apr}
      displayApr={displayApr}
      stakedBalance={stakedBalance}
      onConfirm={handleStake}
      tokenName={lpSymbol}
      multiplier={multiplier}
      addLiquidityUrl={addLiquidityUrl}
      cakePrice={cakePrice}
    />,
  );
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={handleUnstake} tokenName={lpSymbol} />,
  );
  const lpContract = useERC20(lpAddress);
  const dispatch = useAppDispatch();
  const { onApprove } = useApproveFarm(lpContract);

  const handleApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onApprove();
    });
    if (receipt?.status) {
      toastSuccess(t("Contract Enabled"), <ToastDescriptionWithTx txHash={receipt.transactionHash} />);
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }));
    }
  }, [onApprove, dispatch, account, pid, t, toastSuccess, fetchWithCatchTxError]);

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t("Start Farming")}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ConnectButton />
        </ActionContent>
      </ActionContainer>
    );
  }

  if (isApproved) {
    if (stakedBalance.gt(0)) {
      return (
        <ActionContainer>
          <ActionTitles>
            <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
              {lpSymbol}
            </Text>
            <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
              {t("Staked")}
            </Text>
          </ActionTitles>
          <ActionContent>
            <StakedLP
              stakedBalance={stakedBalance}
              lpSymbol={lpSymbol}
              quoteTokenSymbol={quoteToken.symbol as string}
              tokenSymbol={token.symbol as string}
              lpTotalSupply={lpTotalSupply as BigNumber}
              tokenAmountTotal={tokenAmountTotal as BigNumber}
              quoteTokenAmountTotal={quoteTokenAmountTotal as BigNumber}
            />
            <IconButtonWrapper>
              <IconButton variant="secondary" onClick={onPresentWithdraw} mr="6px">
                <MinusIcon color="primary" width="14px" />
              </IconButton>
              <IconButton
                variant="secondary"
                onClick={onPresentDeposit}
                disabled={["history", "archived"].some(item => location.includes(item))}
              >
                <AddIcon color="primary" width="14px" />
              </IconButton>
            </IconButtonWrapper>
          </ActionContent>
        </ActionContainer>
      );
    }

    return (
      <ActionContainer>
        <ActionTitles>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px" pr="4px">
            {t("Stake")}
          </Text>
          <Text bold textTransform="uppercase" color="secondary" fontSize="12px">
            {lpSymbol}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button
            width="100%"
            onClick={onPresentDeposit}
            variant="secondary"
            disabled={["history", "archived"].some(item => location.includes(item))}
          >
            {t("Stake LP")}
          </Button>
        </ActionContent>
      </ActionContainer>
    );
  }

  if (!userDataReady) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t("Start Farming")}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Skeleton width={180} marginBottom={28} marginTop={14} />
        </ActionContent>
      </ActionContainer>
    );
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t("Enable Farm")}
        </Text>
      </ActionTitles>
      <ActionContent>
        <Button width="100%" disabled={pendingTx} onClick={handleApprove} variant="secondary">
          {t("Enable")}
        </Button>
      </ActionContent>
    </ActionContainer>
  );
};

export default Staked;
