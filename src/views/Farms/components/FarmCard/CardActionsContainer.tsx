import { Flex, Text } from "@pancakeswap/uikit";
import { useCallback } from "react";
import ConnectButton from "src/components/ConnectButton/ConnectButton";
import StyledButton from "src/components/StyledButton";
import { ToastDescriptionWithTx } from "src/components/Toast";
import { useTranslation } from "src/contexts/Localization";
import { useAppDispatch } from "src/hooks";
import useCatchTxError from "src/hooks/useCatchTxError";
import { useERC20 } from "src/hooks/useContract";
import useToast from "src/hooks/useToast";
import { fetchFarmUserDataAsync } from "src/slices/farms";
import { getAddress } from "src/utils/addressHelpers";
import styled from "styled-components";

import useApproveFarm from "../../hooks/useApproveFarm";
import { FarmWithStakedValue } from "../types";
import HarvestAction from "./HarvestAction";
import StakeAction from "./StakeAction";
const Action = styled.div`
  padding-top: 16px;
`;

interface FarmCardActionsProps {
  farm: FarmWithStakedValue;
  account?: string;
  addLiquidityUrl?: string;
  lpLabel?: string;
  displayApr?: string;
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, account, addLiquidityUrl, lpLabel, displayApr }) => {
  const { t } = useTranslation();
  const { toastSuccess } = useToast();
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError();
  const { pid, lpAddresses } = farm;
  const { allowance, earnings } = farm.userData || {};
  const lpAddress = getAddress(lpAddresses);
  const isApproved = account && allowance && allowance.isGreaterThan(0);
  const dispatch = useAppDispatch();

  const lpContract = useERC20(lpAddress);

  const { onApprove } = useApproveFarm(lpContract);

  const handleApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onApprove();
    });
    if (receipt?.status) {
      toastSuccess(t("Contract Enabled"), <ToastDescriptionWithTx txHash={receipt.transactionHash} />);
      //@ts-ignore
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }));
    }
  }, [onApprove, dispatch, account, pid, t, toastSuccess, fetchWithCatchTxError]);

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction {...farm} lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} displayApr={displayApr} />
    ) : (
      <StyledButton mt="8px" width="100%" disabled={pendingTx} onClick={handleApprove}>
        {t("Enable Contract")}
      </StyledButton>
    );
  };

  return (
    <Action>
      <hr color="#B3FFAB" />
      <Flex>
        <Text bold textTransform="lowercase" color="secondary" fontSize="12px" pr="4px">
          cake
        </Text>
        <Text bold textTransform="lowercase" color="textSubtle" fontSize="12px">
          {t("earned")}
        </Text>
      </Flex>
      <HarvestAction earnings={earnings} pid={pid} />
      <hr color="#B3FFAB" />
      <Flex>
        <Text bold textTransform="lowercase" color="secondary" fontSize="12px" pr="4px">
          {farm.lpSymbol}
        </Text>
        <Text bold textTransform="lowercase" color="textSubtle" fontSize="12px">
          {t("staked")}
        </Text>
      </Flex>
      {!account ? <ConnectButton /> : renderApprovalOrStakeButton()}
    </Action>
  );
};

export default CardActions;
