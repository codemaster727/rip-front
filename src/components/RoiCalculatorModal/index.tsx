import {
  BalanceInput,
  // Button,
  ButtonMenu,
  ButtonMenuItem,
  Checkbox,
  Flex,
  HelpIcon,
  Text,
  useTooltip,
} from "@pancakeswap/uikit";
import BigNumber from "bignumber.js";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "src/contexts/Localization";
import { useWeb3Context } from "src/hooks";
import { getBalanceNumber } from "src/utils/formatBalance";
import styled from "styled-components";

import { StyledButtonMenu } from "../SearchModal/Manage";
import StyledButton from "../StyledButton";
import StyledModal from "../StyledModal";
import AnimatedArrow from "./AnimatedArrow";
import RoiCalculatorFooter from "./RoiCalculatorFooter";
import RoiCard from "./RoiCard";
import useRoiCalculatorReducer, {
  CalculatorMode,
  DefaultCompoundStrategy,
  EditingCurrency,
} from "./useRoiCalculatorReducer";
export interface RoiCalculatorModalProps {
  onDismiss?: () => void;
  onBack?: () => void;
  earningTokenPrice: number;
  apr?: number;
  apy?: number;
  displayApr?: string;
  linkLabel: string;
  linkHref: string;
  stakingTokenBalance: BigNumber;
  stakingTokenSymbol: string;
  stakingTokenPrice: number;
  earningTokenSymbol?: string;
  multiplier?: string;
  autoCompoundFrequency?: number;
  performanceFee?: number;
  isFarm?: boolean;
  initialState?: any;
  initialValue?: string;
  strategy?: any;
  header?: React.ReactNode;
}

// const StyledModal = styled(Modal)`
//   width: 380px;
//   & > :nth-child(2) {
//     padding: 0;
//   }
// `;

const ScrollableContainer = styled.div`
  padding: 24px;
  max-height: 500px;
  overflow-y: auto;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: none;
  }
`;

const FullWidthButtonMenu = styled(ButtonMenu)<{ disabled?: boolean }>`
  width: 100%;

  & > button {
    width: 100%;
  }

  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const StyledBalanceInput = styled(BalanceInput)`
  background: none;
  background-color: transparent !important;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  // & > div {
  //   background-color: transparent !important;
  // }
`;

const RoiCalculatorModal: React.FC<RoiCalculatorModalProps> = ({
  onDismiss,
  onBack,
  earningTokenPrice,
  apr,
  apy,
  displayApr,
  linkLabel,
  linkHref,
  stakingTokenBalance,
  stakingTokenSymbol,
  stakingTokenPrice,
  multiplier,
  initialValue,
  earningTokenSymbol = "CAKE",
  autoCompoundFrequency = 0,
  performanceFee = 0,
  isFarm = false,
  initialState,
  strategy,
  header,
  children,
}) => {
  const { t } = useTranslation();
  const { address: account } = useWeb3Context();
  const balanceInputRef = useRef<HTMLInputElement | null>(null);

  const {
    state,
    setPrincipalFromUSDValue,
    setPrincipalFromTokenValue,
    setStakingDuration,
    toggleCompounding,
    toggleEditingCurrency,
    setCompoundingFrequency,
    setCalculatorMode,
    setTargetRoi,
    dispatch,
  } = useRoiCalculatorReducer({ stakingTokenPrice, earningTokenPrice, autoCompoundFrequency }, initialState);

  const { compounding, activeCompoundingIndex, stakingDuration, editingCurrency } = state.controls;
  const { principalAsUSD, principalAsToken } = state.data;

  // Auto-focus input on opening modal
  useEffect(() => {
    if (balanceInputRef.current) {
      balanceInputRef.current.focus();
    }
  }, []);

  // If user comes to calculator from staking modal - initialize with whatever they put in there
  useEffect(() => {
    if (initialValue) {
      setPrincipalFromTokenValue(initialValue);
    }
  }, [initialValue, setPrincipalFromTokenValue]);

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    isFarm
      ? t("“My Balance” here includes both LP Tokens in your wallet, and LP Tokens already staked in this farm.")
      : t(
          "“My Balance” here includes both %assetSymbol% in your wallet, and %assetSymbol% already staked in this pool.",
          { assetSymbol: stakingTokenSymbol },
        ),
    { placement: "top-end", tooltipOffset: [20, 10] },
  );

  const onBalanceFocus = () => {
    setCalculatorMode(CalculatorMode.ROI_BASED_ON_PRINCIPAL);
  };

  const editingUnit = editingCurrency === EditingCurrency.TOKEN ? stakingTokenSymbol : "USD";
  const editingValue = editingCurrency === EditingCurrency.TOKEN ? principalAsToken : principalAsUSD;
  const conversionUnit = editingCurrency === EditingCurrency.TOKEN ? "USD" : stakingTokenSymbol;
  const conversionValue = editingCurrency === EditingCurrency.TOKEN ? principalAsUSD : principalAsToken;
  const onUserInput = editingCurrency === EditingCurrency.TOKEN ? setPrincipalFromTokenValue : setPrincipalFromUSDValue;

  const DURATION = useMemo(() => [t("1D"), t("7D"), t("30D"), t("1Y"), t("5Y")], [t]);

  return (
    <StyledModal title={t("ROI Calculator")} onDismiss={onBack || onDismiss} onBack={onBack ?? undefined}>
      {strategy ? (
        strategy(state, dispatch)
      ) : (
        <DefaultCompoundStrategy
          apr={apy ?? apr}
          dispatch={dispatch}
          state={state}
          earningTokenPrice={earningTokenPrice}
          performanceFee={performanceFee}
          stakingTokenPrice={stakingTokenPrice}
        />
      )}
      {header}
      <Flex flexDirection="column" mb="8px">
        <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
          {t("%asset% staked", { asset: stakingTokenSymbol })}
        </Text>
        <StyledBalanceInput
          className="balance-input"
          currencyValue={`${conversionValue} ${conversionUnit}`}
          innerRef={balanceInputRef}
          placeholder="0.00"
          value={editingValue}
          unit={editingUnit}
          onUserInput={onUserInput}
          switchEditingUnits={toggleEditingCurrency}
          onFocus={onBalanceFocus}
        />
        <Flex justifyContent="space-between" mt="8px">
          <StyledButton
            scale="xs"
            p="4px 16px"
            width="68px"
            variant="tertiary"
            onClick={() => setPrincipalFromUSDValue("100")}
          >
            $100
          </StyledButton>
          <StyledButton
            scale="xs"
            p="4px 16px"
            width="68px"
            variant="tertiary"
            onClick={() => setPrincipalFromUSDValue("1000")}
          >
            $1000
          </StyledButton>
          <StyledButton
            disabled={
              !Number.isFinite(stakingTokenPrice) ||
              !stakingTokenBalance.isFinite() ||
              stakingTokenBalance.lte(0) ||
              !account
            }
            scale="xs"
            p="4px 16px"
            width="128px"
            variant="tertiary"
            onClick={() =>
              setPrincipalFromUSDValue(getBalanceNumber(stakingTokenBalance.times(stakingTokenPrice)).toString())
            }
          >
            {t("My Balance").toLocaleUpperCase()}
          </StyledButton>
          <span ref={targetRef}>
            <HelpIcon width="16px" height="16px" color="textSubtle" />
          </span>
          {tooltipVisible && tooltip}
        </Flex>
        {children || (
          <>
            <Text mt="24px" color="secondary" bold fontSize="12px" textTransform="uppercase">
              {t("Staked for")}
            </Text>
            <StyledButtonMenu activeIndex={stakingDuration} onItemClick={setStakingDuration} scale="sm">
              {DURATION.map((duration: any, index: number) => (
                <ButtonMenuItem
                  key={duration}
                  variant="tertiary"
                  style={{ color: stakingDuration === index ? "black" : "#00FCB0" }}
                >
                  {duration}
                </ButtonMenuItem>
              ))}
            </StyledButtonMenu>
          </>
        )}
        {autoCompoundFrequency === 0 && (
          <>
            <Text mt="24px" color="secondary" bold fontSize="12px" textTransform="uppercase">
              {t("Compounding every")}
            </Text>
            <Flex alignItems="center">
              <Flex flex="1">
                <Checkbox scale="sm" checked={compounding} onChange={toggleCompounding} />
              </Flex>
              <Flex flex="6">
                <StyledButtonMenu
                  disabled={!compounding}
                  activeIndex={activeCompoundingIndex}
                  onItemClick={setCompoundingFrequency}
                  scale="sm"
                >
                  <ButtonMenuItem style={{ color: activeCompoundingIndex === 0 ? "black" : "#00FCB0" }}>
                    {t("1D")}
                  </ButtonMenuItem>
                  <ButtonMenuItem style={{ color: activeCompoundingIndex === 1 ? "black" : "#00FCB0" }}>
                    {t("7D")}
                  </ButtonMenuItem>
                  <ButtonMenuItem style={{ color: activeCompoundingIndex === 2 ? "black" : "#00FCB0" }}>
                    {t("14D")}
                  </ButtonMenuItem>
                  <ButtonMenuItem style={{ color: activeCompoundingIndex === 3 ? "black" : "#00FCB0" }}>
                    {t("30D")}
                  </ButtonMenuItem>
                </StyledButtonMenu>
              </Flex>
            </Flex>
          </>
        )}
      </Flex>
      <AnimatedArrow calculatorState={state} />
      <Flex>
        <RoiCard
          earningTokenSymbol={earningTokenSymbol}
          calculatorState={state}
          setTargetRoi={setTargetRoi}
          setCalculatorMode={setCalculatorMode}
        />
      </Flex>
      <RoiCalculatorFooter
        isFarm={isFarm}
        apr={apr}
        apy={apy}
        displayApr={displayApr as string}
        autoCompoundFrequency={autoCompoundFrequency}
        multiplier={multiplier as string}
        linkLabel={linkLabel}
        linkHref={linkHref}
        performanceFee={performanceFee}
      />
    </StyledModal>
  );
};

export default RoiCalculatorModal;
