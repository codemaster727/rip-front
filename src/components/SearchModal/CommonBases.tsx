import { ChainId, Currency, currencyEquals, ETHER, Token } from "@pancakeswap/sdk";
import { Text } from "@pancakeswap/uikit";
import styled from "styled-components";

import { SUGGESTED_BASES } from "../../constants";
import { useTranslation } from "../../contexts/Localization";
import { AutoColumn } from "../Layout/Column";
import { AutoRow } from "../Layout/Row";
import { CurrencyLogo } from "../Logo";
import QuestionHelper from "../QuestionHelper";

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid ${({ theme, disable }) => (disable ? "transparent" : theme.colors.dropdown)};
  border-radius: 10px;
  display: flex;
  padding: 6px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && "pointer"};
    background-color: ${({ theme, disable }) => !disable && theme.colors.background};
  }

  background-color: ${({ theme, disable }) => disable && theme.colors.dropdown};
  opacity: ${({ disable }) => disable && "0.4"};
`;

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
}: {
  chainId?: ChainId;
  selectedCurrency?: Currency | null;
  onSelect: (currency: Currency) => void;
}) {
  const { t } = useTranslation();
  return (
    <AutoColumn gap="md">
      <AutoRow>
        <Text fontSize="14px" color="white">
          {t("Common bases")}
        </Text>
        <QuestionHelper text={t("These tokens are commonly paired with other tokens.")} ml="4px" />
      </AutoRow>
      <AutoRow gap="auto">
        <BaseWrapper
          onClick={() => {
            if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
              onSelect(ETHER);
            }
          }}
          disable={selectedCurrency === ETHER}
        >
          <CurrencyLogo currency={ETHER} style={{ marginLeft: 2, marginRight: 2 }} />
          <Text fontSize="12" color="white">
            BNB
          </Text>
        </BaseWrapper>
        {(chainId ? SUGGESTED_BASES[chainId] : []).map((token: Token) => {
          const selected = selectedCurrency instanceof Token && selectedCurrency.address === token.address;
          return (
            <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected} key={token.address}>
              <CurrencyLogo currency={token} style={{ marginRight: 2, borderRadius: "50%" }} />
              <Text fontSize="12" color="white">
                {token.symbol}
              </Text>
            </BaseWrapper>
          );
        })}
      </AutoRow>
    </AutoColumn>
  );
}
