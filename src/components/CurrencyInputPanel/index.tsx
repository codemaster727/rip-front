import { Currency, Pair } from "@pancakeswap/sdk";
import { Box, Button, Flex, Text, useModal } from "@pancakeswap/uikit";
// import useActiveWeb3React from 'src/hooks/useActiveWeb3React'
import { useWeb3Context } from "src/hooks";
import styled from "styled-components";

import { useTranslation } from "../../contexts/Localization";
import { useCurrencyBalance } from "../../slices/wallet/hooks";
// import { isAddress } from "../../utils";
// import { CopyButton } from "../CopyButton";
import { CurrencyLogo, DoubleCurrencyLogo } from "../Logo";
import CurrencySearchModal from "../SearchModal/CurrencySearchModal";
import { Input as NumericalInput } from "./NumericalInput";

// const InputRow = styled.div<{ selected: boolean }>`
//   display: flex;
//   flex-flow: row nowrap;
//   align-items: center;
//   justify-content: flex-end;
//   padding: ${({ selected }) => (selected ? "0.75rem 0.5rem 0.75rem 1rem" : "0.75rem 0.75rem 0.75rem 1rem")};
// `;
const CurrencySelectButton = styled(Button).attrs({ variant: "text", scale: "sm" })`
  padding: 0;
  width: fit-content;
`;
const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0.75rem 0.3rem;
`;
const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 40px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  z-index: 1;
`;
const Container = styled.div<{ background: string }>`
  border-radius: 50px;
  background: ${({ theme, background = "background" }) => theme.colors[background]};
  color: white;
  box-shadow: ${({ theme }) => theme.shadows.inset};
`;
interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
  label?: string;
  onCurrencySelect: (currency: Currency) => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  hideBalance?: boolean;
  pair?: Pair | null;
  otherCurrency?: Currency | null;
  id: string;
  showCommonBases?: boolean;
  background?: string;
}
export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  // showMaxButton,
  // label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  otherCurrency,
  id,
  showCommonBases,
  background = "background",
}: CurrencyInputPanelProps) {
  const { account } = useWeb3Context();
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined);
  const {
    t,
    // currentLanguage: { locale },
  } = useTranslation();

  // const token = pair ? pair.liquidityToken : currency instanceof Token ? currency : null;
  // const tokenAddress = token ? isAddress(token.address) : null;

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
    />,
  );
  return (
    <Box position="relative" id={id} width="100%">
      <Flex mb="6px" alignItems="center" justifyContent="center">
        {/* <Flex>
          {token && tokenAddress ? (
            <Flex style={{ gap: "4px" }} alignItems="center">
              <CopyButton
                width="16px"
                buttonColor="textSubtle"
                text={tokenAddress}
                tooltipMessage={t("Token address copied")}
                tooltipTop={-20}
                tooltipRight={40}
                tooltipFontSize={12}
              />
              {library?.provider?.isMetaMask && (
                <MetamaskIcon
                  style={{ cursor: 'pointer' }}
                  width="16px"
                  onClick={() =>
                    registerToken(
                      tokenAddress,
                      token.symbol,
                      token.decimals,
                      token instanceof WrappedTokenInfo ? token.logoURI : undefined,
                    )
                  }
                />
              )}
            </Flex>
          ) : null}
        </Flex> */}
        {account && (
          <Text onClick={onMax} color="blueish_gray" fontSize="14px" style={{ display: "inline", cursor: "pointer" }}>
            {!hideBalance && !!currency
              ? t("Balance: %balance%", { balance: selectedCurrencyBalance?.toSignificant(6) ?? t("Loading") })
              : " -"}
          </Text>
        )}
      </Flex>
      <InputPanel>
        <Container background={background}>
          <LabelRow>
            <CurrencySelectButton
              className=""
              selected={!!currency}
              onClick={() => {
                if (!disableCurrencySelect) {
                  onPresentCurrencyModal();
                }
              }}
              style={{ width: "fit-content" }}
            >
              <Flex width="fit-content" alignItems="center" justifyContent="space-between">
                {pair ? (
                  <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin />
                ) : currency ? (
                  <CurrencyLogo currency={currency} size="48" style={{ marginRight: "8px", width: "48px" }} />
                ) : (
                  <Text color={background === "background" ? "white" : "black"} paddingLeft={3} bold>
                    Select
                  </Text>
                )}
                {/* {pair ? (
                  <Text id="pair" bold>
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </Text>
                ) : (
                  <Text id="pair" bold>
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length,
                        )}`
                      : currency?.symbol) || t("Select a currency")}
                  </Text>
                )}
                {!disableCurrencySelect && <ChevronDownIcon />} */}
              </Flex>
            </CurrencySelectButton>
            <NumericalInput
              className="token-amount-input"
              color={background === "background" ? "white" : "black"}
              style={{
                width: "calc(100% - 2.5rem)",
                marginLeft: "auto",
                fontSize: "1.5rem",
                fontWeight: "bolder",
              }}
              value={value}
              onUserInput={val => {
                onUserInput(val);
              }}
            />
          </LabelRow>
          {/* <InputRow selected={disableCurrencySelect}>
            {account && currency && showMaxButton && label !== "To" && (
              <Button onClick={onMax} scale="xs" variant="secondary">
                {t("Max").toLocaleUpperCase(locale)}
              </Button>
            )}
          </InputRow> */}
        </Container>
      </InputPanel>
    </Box>
  );
}
