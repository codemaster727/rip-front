import { BigNumber } from "@ethersproject/bignumber";
import { TransactionResponse, Web3Provider } from "@ethersproject/providers";
import { Paper } from "@olympusdao/component-library";
import { Currency, currencyEquals, ETHER, Fraction, Percent, Token, TokenAmount, WETH } from "@pancakeswap/sdk";
import { AddIcon, CardBody, Flex, Message, Text, useModal } from "@pancakeswap/uikit";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import { useRouter } from 'next/router'
import { useHistory, useLocation, useParams } from "react-router-dom";
// import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useWeb3Context } from "src/hooks";

import { AppBody, AppHeader } from "../../components/App";
// import { LightCard } from "../../components/Card";
import ConnectButton from "../../components/ConnectButton/ConnectButton";
import CurrencyInputPanel from "../../components/CurrencyInputPanel";
import { AutoColumn, ColumnCenter } from "../../components/Layout/Column";
import { RowBetween } from "../../components/Layout/Row";
import Dots from "../../components/Loader/Dots";
import { MinimalPositionCard } from "../../components/PositionCard";
import StyledButton from "../../components/StyledButton";
import UnsupportedCurrencyFooter from "../../components/UnsupportedCurrencyFooter";
import { ROUTER_ADDRESS } from "../../constants";
import { CHAIN_ID } from "../../constants/networks";
import { useTranslation } from "../../contexts/Localization";
import { useCurrency } from "../../hooks/Tokens";
import { useIsTransactionUnsupported } from "../../hooks/Trades";
import { ApprovalState, useApproveCallback } from "../../hooks/useApproveCallback";
import { PairState } from "../../hooks/usePairs";
import useTransactionDeadline from "../../hooks/useTransactionDeadline";
import { AppDispatch } from "../../Root";
import { Field, resetMintState } from "../../slices/mint/actions";
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from "../../slices/mint/hooks";
import { useTransactionAdder } from "../../slices/transactions/hooks";
import { useGasPrice, useIsExpertMode, useUserSlippageTolerance } from "../../slices/user/hooks";
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from "../../utils";
import { currencyId } from "../../utils/currencyId";
import { maxAmountSpend } from "../../utils/maxAmountSpend";
import { logError } from "../../utils/sentry";
import { wrappedCurrency } from "../../utils/wrappedCurrency";
import ConfirmAddLiquidityModal from "../Swap/components/ConfirmAddLiquidityModal";
// import PoolPriceBar from "./PoolPriceBar";

export default function AddLiquidity() {
  const router = useLocation();
  const history: any = useHistory();
  const params: any = useParams();
  const { currencyIdA, currencyIdB } = params || {};

  const { account, networkId: chainId, provider: library } = useWeb3Context();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const gasPrice = useGasPrice();

  const currencyA = useCurrency(currencyIdA);
  const currencyB = useCurrency(currencyIdB);

  useEffect(() => {
    if (!currencyIdA && !currencyIdB) {
      dispatch(resetMintState());
    }
  }, [dispatch, currencyIdA, currencyIdB]);

  const oneCurrencyIsWBNB = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, WETH[chainId as keyof typeof WETH])) ||
        (currencyB && currencyEquals(currencyB, WETH[chainId as keyof typeof WETH]))),
  );

  const expertMode = useIsExpertMode();

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState();
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined);

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity);

  const isValid = !error;

  // modal and loading
  const [{ attemptingTxn, liquidityErrorMessage, txHash }, setLiquidityState] = useState<{
    attemptingTxn: boolean;
    liquidityErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    attemptingTxn: false,
    liquidityErrorMessage: undefined,
    txHash: undefined,
  });

  // txn values
  const deadline = useTransactionDeadline(); // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance(); // custom from users

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      };
    },
    {},
  );

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? "0"),
      };
    },
    {},
  );

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    ROUTER_ADDRESS[parseInt(CHAIN_ID as string) as keyof typeof ROUTER_ADDRESS],
  );
  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    ROUTER_ADDRESS[parseInt(CHAIN_ID as string) as keyof typeof ROUTER_ADDRESS],
  );

  const addTransaction = useTransactionAdder();

  async function onAdd() {
    if (!chainId || !library || !account) return;
    const routerContract = getRouterContract(chainId, library as Web3Provider, account);

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts;
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return;
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    };

    let estimate;
    let method: (...args: any) => Promise<TransactionResponse>;
    let args: Array<string | string[] | number>;
    let value: BigNumber | null;
    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsBNB = currencyB === ETHER;
      estimate = routerContract.estimateGas.addLiquidityETH;
      method = routerContract.addLiquidityETH;
      args = [
        wrappedCurrency(tokenBIsBNB ? currencyA : currencyB, chainId)?.address ?? "", // token
        (tokenBIsBNB ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsBNB ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsBNB ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString(),
      ];
      value = BigNumber.from((tokenBIsBNB ? parsedAmountB : parsedAmountA).raw.toString());
    } else {
      estimate = routerContract.estimateGas.addLiquidity;
      method = routerContract.addLiquidity;
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? "",
        wrappedCurrency(currencyB, chainId)?.address ?? "",
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString(),
      ];
      value = null;
    }

    setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined });
    // @ts-ignore
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit: any) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
          gasPrice,
        }).then(response => {
          setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response.hash });

          addTransaction(response, {
            summary: `Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencies[Field.CURRENCY_A]?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`,
          });
        }),
      )
      .catch((err: any) => {
        if (err && err.code !== 4001) {
          logError(err);
          console.error(`Add Liquidity failed`, err, args, value);
        }
        setLiquidityState({
          attemptingTxn: false,
          liquidityErrorMessage: err && err.code !== 4001 ? `Add Liquidity failed: ${err.message}` : undefined,
          txHash: undefined,
        });
      });
  }

  const pendingText = t("Supplying %amountA% %symbolA% and %amountB% %symbolB%", {
    amountA: parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? "",
    symbolA: currencies[Field.CURRENCY_A]?.symbol ?? "",
    amountB: parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? "",
    symbolB: currencies[Field.CURRENCY_B]?.symbol ?? "",
  });

  const handleCurrencyASelect = useCallback(
    (currencyA_: Currency) => {
      const newCurrencyIdA = currencyId(currencyA_);
      if (newCurrencyIdA === currencyIdB) {
        // router.replace(`/add/${currencyIdB}/${currencyIdA}`, undefined, { shallow: true });
        history.push(`/add/${currencyIdB}/${currencyIdA}`);
      } else if (currencyIdB) {
        // router.replace(`/add/${newCurrencyIdA}/${currencyIdB}`, undefined, { shallow: true });
        history.push(`/add/${newCurrencyIdA}/${currencyIdB}`);
      } else {
        // router.replace(`/add/${newCurrencyIdA}`, undefined, { shallow: true });
        history.push(`/add/${newCurrencyIdA}`);
      }
    },
    [currencyIdB, history, currencyIdA],
  );
  const handleCurrencyBSelect = useCallback(
    (currencyB_: Currency) => {
      const newCurrencyIdB = currencyId(currencyB_);
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          // router.replace(`/add/${currencyIdB}/${newCurrencyIdB}`, undefined, { shallow: true });
          history.push(`/add/${currencyIdB}/${newCurrencyIdB}`);
        } else {
          // router.replace(`/add/${newCurrencyIdB}`, undefined, { shallow: true });
          history.push(`/add/${newCurrencyIdB}`);
        }
      } else {
        // router.replace(`/add/${currencyIdA || "BNB"}/${newCurrencyIdB}`, undefined, { shallow: true });
        history.push(`/add/${currencyIdA || "BNB"}/${newCurrencyIdB}`);
      }
    },
    [currencyIdA, history, currencyIdB],
  );

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput("");
    }
  }, [onFieldAInput, txHash]);

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B);

  const [onPresentAddLiquidityModal] = useModal(
    <ConfirmAddLiquidityModal
      title={noLiquidity ? t("You are creating a pool") : t("You will receive")}
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash as string}
      pendingText={pendingText}
      currencyToAdd={pair?.liquidityToken as Token}
      allowedSlippage={allowedSlippage}
      onAdd={onAdd}
      parsedAmounts={parsedAmounts}
      currencies={currencies}
      liquidityErrorMessage={liquidityErrorMessage as string}
      price={price as Fraction}
      noLiquidity={noLiquidity as boolean}
      poolTokenPercentage={poolTokenPercentage as Percent}
      liquidityMinted={liquidityMinted as TokenAmount}
    />,
    true,
    true,
    "addLiquidityModal",
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
            <AppHeader
              title={t("Add Liquidity")}
              subtitle={t("Add liquidity to receive LP tokens")}
              helper={t(
                "Liquidity providers earn a 0.17% trading fee on all trades made for that token pair, proportional to their share of the liquidity pool.",
              )}
              backTo="/liquidity"
            />
            <CardBody>
              <AutoColumn gap="20px">
                {noLiquidity && (
                  <ColumnCenter>
                    <Message variant="warning">
                      <div>
                        <Text bold mb="8px">
                          {t("You are the first liquidity provider.")}
                        </Text>
                        <Text mb="8px">{t("The ratio of tokens you add will set the price of this pool.")}</Text>
                        <Text>{t("Once you are happy with the rate click supply to review.")}</Text>
                      </div>
                    </Message>
                  </ColumnCenter>
                )}
                <CurrencyInputPanel
                  value={formattedAmounts[Field.CURRENCY_A]}
                  onUserInput={onFieldAInput}
                  onMax={() => {
                    onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? "");
                  }}
                  onCurrencySelect={handleCurrencyASelect}
                  showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                  currency={currencies[Field.CURRENCY_A]}
                  id="add-liquidity-input-tokena"
                  showCommonBases
                  background="primary"
                />
                <ColumnCenter>
                  <AddIcon width="16px" color="primary" />
                </ColumnCenter>
                <CurrencyInputPanel
                  value={formattedAmounts[Field.CURRENCY_B]}
                  onUserInput={onFieldBInput}
                  onCurrencySelect={handleCurrencyBSelect}
                  onMax={() => {
                    onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? "");
                  }}
                  showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                  currency={currencies[Field.CURRENCY_B]}
                  id="add-liquidity-input-tokenb"
                  showCommonBases
                  background="primary"
                />
                {/* {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
                  <>
                    <LightCard padding="0px" borderRadius="20px">
                      <RowBetween padding="1rem">
                        <Text fontSize="14px">
                          {noLiquidity ? t("Initial prices and pool share") : t("Prices and pool share")}
                        </Text>
                      </RowBetween>{" "}
                      <LightCard padding="1rem" borderRadius="20px">
                        <PoolPriceBar
                          currencies={currencies}
                          poolTokenPercentage={poolTokenPercentage}
                          noLiquidity={noLiquidity}
                          price={price}
                        />
                      </LightCard>
                    </LightCard>
                  </>
                )} */}

                {addIsUnsupported ? (
                  <StyledButton disabled mb="4px">
                    {t("Unsupported Asset")}
                  </StyledButton>
                ) : !account ? (
                  <ConnectButton />
                ) : (
                  <AutoColumn gap="md">
                    {(approvalA === ApprovalState.NOT_APPROVED ||
                      approvalA === ApprovalState.PENDING ||
                      approvalB === ApprovalState.NOT_APPROVED ||
                      approvalB === ApprovalState.PENDING) &&
                      isValid && (
                        <RowBetween>
                          {approvalA !== ApprovalState.APPROVED && (
                            <StyledButton
                              onClick={approveACallback}
                              disabled={approvalA === ApprovalState.PENDING}
                              width={approvalB !== ApprovalState.APPROVED ? "48%" : "100%"}
                            >
                              {approvalA === ApprovalState.PENDING ? (
                                <Dots>
                                  {t("Enabling %asset%", { asset: currencies[Field.CURRENCY_A]?.symbol as string })}
                                </Dots>
                              ) : (
                                t("Enable %asset%", { asset: currencies[Field.CURRENCY_A]?.symbol as string })
                              )}
                            </StyledButton>
                          )}
                          {approvalB !== ApprovalState.APPROVED && (
                            <StyledButton
                              onClick={approveBCallback}
                              disabled={approvalB === ApprovalState.PENDING}
                              width={approvalA !== ApprovalState.APPROVED ? "48%" : "100%"}
                            >
                              {approvalB === ApprovalState.PENDING ? (
                                <Dots>
                                  {t("Enabling %asset%", { asset: currencies[Field.CURRENCY_B]?.symbol as string })}
                                </Dots>
                              ) : (
                                t("Enable %asset%", { asset: currencies[Field.CURRENCY_B]?.symbol as string })
                              )}
                            </StyledButton>
                          )}
                        </RowBetween>
                      )}
                    <StyledButton
                      variant={
                        !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                          ? "danger"
                          : "primary"
                      }
                      onClick={() => {
                        if (expertMode) {
                          onAdd();
                        } else {
                          setLiquidityState({
                            attemptingTxn: false,
                            liquidityErrorMessage: undefined,
                            txHash: undefined,
                          });
                          onPresentAddLiquidityModal();
                        }
                      }}
                      disabled={
                        !isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED
                      }
                    >
                      {error ?? t("Supply")}
                    </StyledButton>
                  </AutoColumn>
                )}
              </AutoColumn>
            </CardBody>
          </AppBody>
          {!addIsUnsupported ? (
            pair && !noLiquidity && pairState !== PairState.INVALID ? (
              <AutoColumn style={{ minWidth: "20rem", width: "100%", maxWidth: "400px", marginTop: "1rem" }}>
                <MinimalPositionCard showUnwrapped={oneCurrencyIsWBNB} pair={pair} />
              </AutoColumn>
            ) : null
          ) : (
            <UnsupportedCurrencyFooter currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]} />
          )}
        </Flex>
      </Paper>
    </div>
  );
}
