import { Flex, Heading } from "@pancakeswap/uikit";
import BigNumber from "bignumber.js";
import Balance from "src/components/Balance";
import StyledButton from "src/components/StyledButton";
import { ToastDescriptionWithTx } from "src/components/Toast";
import { useTranslation } from "src/contexts/Localization";
import { useWeb3Context } from "src/hooks";
import { useAppDispatch } from "src/hooks";
import useCatchTxError from "src/hooks/useCatchTxError";
import useToast from "src/hooks/useToast";
import { fetchFarmUserDataAsync } from "src/slices/farms";
import { usePriceCakeBusd } from "src/slices/farms/hooks";
import { BIG_ZERO } from "src/utils/bigNumber";
import { getBalanceAmount } from "src/utils/formatBalance";

import useHarvestFarm from "../../hooks/useHarvestFarm";

interface FarmCardActionsProps {
  earnings?: BigNumber;
  pid?: number;
}

const HarvestAction: React.FC<FarmCardActionsProps> = ({ earnings, pid }) => {
  const { address: account } = useWeb3Context();
  const { toastSuccess } = useToast();
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError();
  const { t } = useTranslation();
  const { onReward } = useHarvestFarm(pid as number);
  const cakePrice = usePriceCakeBusd();
  const dispatch = useAppDispatch();
  const rawEarningsBalance = account ? getBalanceAmount(earnings as BigNumber) : BIG_ZERO;
  const displayBalance = rawEarningsBalance.toFixed(3, BigNumber.ROUND_DOWN);
  const earningsBusd = rawEarningsBalance ? rawEarningsBalance.multipliedBy(cakePrice).toNumber() : 0;

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center">
      <Flex flexDirection="column" alignItems="flex-start">
        <Heading color={rawEarningsBalance.eq(0) ? "secondary" : "secondary"}>{displayBalance}</Heading>
        {earningsBusd > 0 && (
          <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
        )}
      </Flex>
      <StyledButton
        disabled={rawEarningsBalance.eq(0) || pendingTx}
        onClick={async () => {
          const receipt = await fetchWithCatchTxError(() => {
            return onReward();
          });
          if (receipt?.status) {
            toastSuccess(
              `${t("Harvested")}!`,
              <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                {t("Your %symbol% earnings have been sent to your wallet!", { symbol: "CAKE" })}
              </ToastDescriptionWithTx>,
            );
            dispatch(fetchFarmUserDataAsync({ account, pids: [pid as number] }));
          }
        }}
      >
        {pendingTx ? t("Harvesting") : t("Harvest")}
      </StyledButton>
    </Flex>
  );
};

export default HarvestAction;
