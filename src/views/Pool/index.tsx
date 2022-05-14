import { Paper } from "@olympusdao/component-library";
import { Pair } from "@pancakeswap/sdk";
import { AddIcon, Button, CardBody, CardFooter, Flex, Text } from "@pancakeswap/uikit";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useWeb3Context } from "src/hooks";
import styled from "styled-components";

// import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { AppBody, AppHeader } from "../../components/App";
import Dots from "../../components/Loader/Dots";
import FullPositionCard from "../../components/PositionCard";
import { useTranslation } from "../../contexts/Localization";
import { PairState, usePairs } from "../../hooks/usePairs";
import { toV2LiquidityToken, useTrackedTokenPairs } from "../../slices/user/hooks";
import { useTokenBalancesWithLoadingIndicator } from "../../slices/wallet/hooks";

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.background};
`;

export default function Pool() {
  const { address: account } = useWeb3Context();
  const { t } = useTranslation();

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs();
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  );
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  );
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  );

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan("0"),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  );

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens));
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    (v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING));
  const allV2PairsWithLiquidity = v2Pairs
    ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
    .map(([, pair]) => pair);

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t("Connect to a wallet to view your liquidity.")}
        </Text>
      );
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t("Loading")}</Dots>
        </Text>
      );
    }
    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={(v2Pair as Pair).liquidityToken.address}
          pair={v2Pair as Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? "16px" : 0}
        />
      ));
    }
    return (
      <Text color="textSubtle" textAlign="center">
        {t("No liquidity found.")}
      </Text>
    );
  };

  return (
    <div className="content-container">
      <Paper className="blur7">
        <Flex flexDirection={"row"} width="100%" justifyContent="center" position="relative" pt="2rem">
          <AppBody>
            <AppHeader title={t("Your Liquidity")} subtitle={t("Remove liquidity to receive tokens back")} />
            <Body>
              {renderBody()}
              {account && !v2IsLoading && (
                <Flex flexDirection="column" alignItems="center" mt="24px">
                  <Text color="textSubtle" mb="8px">
                    {t("Don't see a pool you joined?")}
                  </Text>
                  <Link to="/find">
                    <Button id="import-pool-link" variant="secondary" scale="sm" as="a">
                      {t("Find other LP tokens")}
                    </Button>
                  </Link>
                </Flex>
              )}
            </Body>
            <CardFooter style={{ textAlign: "center", border: "none" }}>
              <Link to="/add">
                <Button id="join-pool-button" width="100%" startIcon={<AddIcon color="white" />}>
                  {t("Add Liquidity")}
                </Button>
              </Link>
            </CardFooter>
          </AppBody>
        </Flex>
      </Paper>
    </div>
  );
}
