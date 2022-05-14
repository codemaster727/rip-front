import { Paper } from "@olympusdao/component-library";
import { Currency, ETHER, JSBI, TokenAmount } from "@pancakeswap/sdk";
import { AddIcon, Button, ChevronDownIcon, Flex, Text, useModal } from "@pancakeswap/uikit";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LightCard } from "src/components/Card";
import { NextLinkFromReactRouter } from "src/components/NextLink";
import { useTranslation } from "src/contexts/Localization";
// import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useWeb3Context } from "src/hooks";
import styled from "styled-components";

import { AppBody, AppHeader } from "../../components/App";
import { AutoColumn, ColumnCenter } from "../../components/Layout/Column";
import Row from "../../components/Layout/Row";
import Dots from "../../components/Loader/Dots";
import { CurrencyLogo } from "../../components/Logo";
import { MinimalPositionCard } from "../../components/PositionCard";
import CurrencySearchModal from "../../components/SearchModal/CurrencySearchModal";
import { PairState, usePair } from "../../hooks/usePairs";
import { usePairAdder } from "../../slices/user/hooks";
import { useTokenBalance } from "../../slices/wallet/hooks";
import { currencyId } from "../../utils/currencyId";

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: none;
  border-radius: 16px;
`;

export default function PoolFinder() {
  const { address: account } = useWeb3Context();
  const { t } = useTranslation();

  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1);
  const [currency0, setCurrency0] = useState<Currency | null>(ETHER);
  const [currency1, setCurrency1] = useState<Currency | null>(null);

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined);
  const addPair = usePairAdder();
  useEffect(() => {
    if (pair) {
      addPair(pair);
    }
  }, [pair, addPair]);

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0)),
    );

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken);
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)));

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency);
      } else {
        setCurrency1(currency);
      }
    },
    [activeField],
  );

  const prerequisiteMessage = (
    <LightCard padding="45px 10px">
      <Text textAlign="center">
        {!account ? t("Connect to a wallet to find pools") : t("Select a token to find your liquidity.")}
      </Text>
    </LightCard>
  );

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={handleCurrencySelect}
      showCommonBases
      selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
    />,
    true,
    true,
    "selectCurrencyModal",
  );

  return (
    <div className="content-container">
      <Paper className="blur7">
        <Flex
          flexDirection={"column"}
          width="100%"
          alignItems="center"
          justifyContent="center"
          position="relative"
          pt="2rem"
        >
          <AppBody>
            <AppHeader title={t("Import Pool")} subtitle={t("Import an existing pool")} backTo="/liquidity" />
            <AutoColumn style={{ padding: "1rem" }} gap="md">
              <StyledButton
                endIcon={<ChevronDownIcon color="black" />}
                onClick={() => {
                  onPresentCurrencyModal();
                  setActiveField(Fields.TOKEN0);
                }}
              >
                {currency0 ? (
                  <Row>
                    <CurrencyLogo currency={currency0} />
                    <Text ml="8px" color="black">
                      {currency0.symbol}
                    </Text>
                  </Row>
                ) : (
                  <Text ml="8px" color="black">
                    {t("Select a Token")}
                  </Text>
                )}
              </StyledButton>

              <ColumnCenter>
                <AddIcon />
              </ColumnCenter>

              <StyledButton
                endIcon={<ChevronDownIcon color="black" />}
                onClick={() => {
                  onPresentCurrencyModal();
                  setActiveField(Fields.TOKEN1);
                }}
              >
                {currency1 ? (
                  <Row>
                    <CurrencyLogo currency={currency1} />
                    <Text ml="8px" color="black">
                      {currency1.symbol}
                    </Text>
                  </Row>
                ) : (
                  <Text as={Row} color="black">
                    {t("Select a Token")}
                  </Text>
                )}
              </StyledButton>

              {currency0 && currency1 ? (
                pairState === PairState.EXISTS ? (
                  hasPosition && pair ? (
                    <>
                      <MinimalPositionCard pair={pair} />
                      <Button as={NextLinkFromReactRouter} to="/pool" variant="secondary" width="100%">
                        {t("Manage this pool")}
                      </Button>
                    </>
                  ) : (
                    <LightCard padding="45px 10px">
                      <AutoColumn gap="sm" justify="center">
                        <Text textAlign="center">{t("You don’t have liquidity in this pool yet.")}</Text>
                        <Link to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}>
                          <Button variant="secondary" style={{ textDecoration: "none" }}>
                            {t("Add Liquidity")}
                          </Button>
                        </Link>
                      </AutoColumn>
                    </LightCard>
                  )
                ) : validPairNoLiquidity ? (
                  <LightCard padding="45px 10px">
                    <AutoColumn gap="sm" justify="center">
                      <Text textAlign="center">{t("No pool found.")}</Text>
                      <Button
                        as={NextLinkFromReactRouter}
                        to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                        variant="secondary"
                      >
                        {t("Create pool")}
                      </Button>
                    </AutoColumn>
                  </LightCard>
                ) : pairState === PairState.INVALID ? (
                  <LightCard padding="45px 10px">
                    <AutoColumn gap="sm" justify="center">
                      <Text textAlign="center" fontWeight={500}>
                        {t("Invalid pair.")}
                      </Text>
                    </AutoColumn>
                  </LightCard>
                ) : pairState === PairState.LOADING ? (
                  <LightCard padding="45px 10px">
                    <AutoColumn gap="sm" justify="center">
                      <Text textAlign="center">
                        {t("Loading")}
                        <Dots />
                      </Text>
                    </AutoColumn>
                  </LightCard>
                ) : null
              ) : (
                prerequisiteMessage
              )}
            </AutoColumn>

            {/* <CurrencySearchModal
              isOpen={showSearch}
              onCurrencySelect={handleCurrencySelect}
              onDismiss={handleSearchDismiss}
              showCommonBases
              selectedCurrency={(activeField === Fields.TOKEN0 ? currency1 : currency0) ?? undefined}
            /> */}
          </AppBody>
        </Flex>
      </Paper>
    </div>
  );
}
