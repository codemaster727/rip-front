import { Trade, TradeType } from "@pancakeswap/sdk";
import { ArrowDownIcon, Button, ErrorIcon, Text } from "@pancakeswap/uikit";
import { useMemo } from "react";

import { AutoColumn } from "../../../components/Layout/Column";
import { RowBetween, RowFixed } from "../../../components/Layout/Row";
import { CurrencyLogo } from "../../../components/Logo";
import { useTranslation } from "../../../contexts/Localization";
import { Field } from "../../../slices/swap/actions";
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from "../../../utils/prices";
import truncateHash from "../../../utils/truncateHash";
import { SwapShowAcceptChanges, TruncatedText } from "./styleds";

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}: {
  trade: Trade;
  allowedSlippage: number;
  recipient: string | null;
  showAcceptChanges: boolean;
  onAcceptChanges: () => void;
}) {
  const { t } = useTranslation();
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [trade, allowedSlippage],
  );
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade]);
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);

  const amount =
    trade.tradeType === TradeType.EXACT_INPUT
      ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6) ?? ""
      : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6) ?? "";
  const symbol =
    trade.tradeType === TradeType.EXACT_INPUT
      ? (trade.outputAmount.currency.symbol as string)
      : (trade.inputAmount.currency.symbol as string);

  const tradeInfoText =
    trade.tradeType === TradeType.EXACT_INPUT
      ? t("Output is estimated. You will receive at least %amount% %symbol% or the transaction will revert.", {
          amount,
          symbol,
        })
      : t("Input is estimated. You will sell at most %amount% %symbol% or the transaction will revert.", {
          amount,
          symbol,
        });

  const [estimatedText, transactionRevertText] = tradeInfoText.split(`${amount} ${symbol}`);

  const truncatedRecipient = recipient ? truncateHash(recipient) : "";

  const recipientInfoText = t("Output will be sent to %recipient%", {
    recipient: truncatedRecipient,
  });

  const [recipientSentToText, postSentToText] = recipientInfoText.split(truncatedRecipient);

  return (
    <AutoColumn gap="md">
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={trade.inputAmount.currency} size="24px" style={{ marginRight: "12px" }} />
          <TruncatedText
            fontSize="24px"
            color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? "primary" : "white"}
          >
            {trade.inputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="24px" ml="10px" color="white">
            {trade.inputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDownIcon width="16px" ml="4px" color="white" />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={trade.outputAmount.currency} size="24px" style={{ marginRight: "12px" }} />
          <TruncatedText
            fontSize="24px"
            color={
              priceImpactSeverity > 2
                ? "failure"
                : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                ? "primary"
                : "white"
            }
          >
            {trade.outputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="24px" ml="10px" color="white">
            {trade.outputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap="0px">
          <RowBetween>
            <RowFixed>
              <ErrorIcon mr="8px" />
              <Text bold color="white">
                {t("Price Updated")}
              </Text>
            </RowFixed>
            <Button onClick={onAcceptChanges}>{t("Accept")}</Button>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: "24px 0 0 0px" }}>
        <Text small color="white" textAlign="left" style={{ width: "100%" }}>
          {estimatedText}
          <b>
            {amount} {symbol}
          </b>
          {transactionRevertText}
        </Text>
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: "12px 0 0 0px" }}>
          <Text color="white">
            {recipientSentToText}
            <b title={recipient}>{truncatedRecipient}</b>
            {postSentToText}
          </Text>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  );
}
