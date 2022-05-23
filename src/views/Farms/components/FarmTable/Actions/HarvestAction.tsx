import { Button, Heading, Skeleton, Text } from "@pancakeswap/uikit";
import BigNumber from "bignumber.js";
import Balance from "src/components/Balance";
import { ToastDescriptionWithTx } from "src/components/Toast";
import { useTranslation } from "src/contexts/Localization";
// import { useWeb3React } from '@web3-react/core'
import { useWeb3Context } from "src/hooks";
import { useAppDispatch } from "src/hooks";
import useCatchTxError from "src/hooks/useCatchTxError";
import useToast from "src/hooks/useToast";
import { fetchFarmUserDataAsync } from "src/slices/farms";
import { usePriceCakeBusd } from "src/slices/farms/hooks";
import { BIG_ZERO } from "src/utils/bigNumber";
import { getBalanceAmount } from "src/utils/formatBalance";

import useHarvestFarm from "../../../hooks/useHarvestFarm";
import { FarmWithStakedValue } from "../../types";
import { ActionContainer, ActionContent, ActionTitles } from "./styles";

interface HarvestActionProps extends FarmWithStakedValue {
  userDataReady: boolean;
}

const HarvestAction: React.FunctionComponent<HarvestActionProps> = ({ pid, userData, userDataReady }) => {
  const { toastSuccess } = useToast();
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError();
  const earningsBigNumber = new BigNumber(userData?.earnings as BigNumber);
  const cakePrice = usePriceCakeBusd();
  let earnings = BIG_ZERO;
  let earningsBusd = 0;
  let displayBalance = userDataReady ? earnings.toLocaleString() : <Skeleton width={60} />;

  // If user didn't connect wallet default balance will be 0
  if (!earningsBigNumber.isZero()) {
    earnings = getBalanceAmount(earningsBigNumber);
    earningsBusd = earnings.multipliedBy(cakePrice).toNumber();
    displayBalance = earnings.toFixed(3, BigNumber.ROUND_DOWN);
  }

  const { onReward } = useHarvestFarm(pid);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { address: account } = useWeb3Context();

  return (
    <ActionContainer>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          CAKE
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t("Earned")}
        </Text>
      </ActionTitles>
      <ActionContent>
        <div>
          <Heading>{displayBalance}</Heading>
          {earningsBusd > 0 && (
            <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
          )}
        </div>
        <Button
          disabled={earnings.eq(0) || pendingTx || !userDataReady}
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
              dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }));
            }
          }}
          ml="4px"
        >
          {pendingTx ? t("Harvesting") : t("Harvest")}
        </Button>
      </ActionContent>
    </ActionContainer>
  );
};

export default HarvestAction;
