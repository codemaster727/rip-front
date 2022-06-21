import "./Stake.scss";

import { t, Trans } from "@lingui/macro";
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Grid, Typography, Zoom } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import { DataRow, InputWrapper, Paper, Tab, Tabs } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { ChangeEvent, ChangeEventHandler, memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import ConnectButton from "src/components/ConnectButton/ConnectButton";
import StyledButton from "src/components/StyledButton";
import { useAppSelector } from "src/hooks";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";

import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import { getGripBalFromSrip, trim } from "../../helpers";
import { error } from "../../slices/MessagesSlice";
import { changeApproval, changeStake } from "../../slices/StakeThunk";
import { changeApproval as changeGripApproval } from "../../slices/WrapThunk";
import { ConfirmDialog } from "./ConfirmDialog";
// import ExternalStakePool from "./ExternalStakePool";

const Stake: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { provider, address, networkId } = useWeb3Context();
  usePathForNetwork({ pathName: "stake", networkID: networkId, history });

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [confirmation, setConfirmation] = useState(false);

  const isAppLoading = useAppSelector(state => state.app.loading);
  const currentIndex = useAppSelector(state => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useAppSelector(state => {
    return state.app.fiveDayRate;
  });
  const ripBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.rip;
  });
  const sripBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.srip;
  });
  const sripV1Balance = useAppSelector(state => {
    return state.account.balances && state.account.balances.sripV1;
  });
  const fsripBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.fsrip;
  });
  const fgripBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.grip;
  });
  const fgRIPAsfsRIPBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.fgRIPAsfsRIP;
  });
  const wsripBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.wsrip;
  });
  const fiatDaowsripBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.fiatDaowsrip;
  });
  const calculateWrappedAsSrip = (balance: string) => {
    return Number(balance) * Number(currentIndex);
  };
  const fiatDaoAsSrip = calculateWrappedAsSrip(fiatDaowsripBalance);
  const gRipBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.grip;
  });
  const gRipAsSrip = useAppSelector(state => {
    return state.account.balances && state.account.balances.gRipAsSripBal;
  });

  const gRipOnArbitrum = useAppSelector(state => {
    return state.account.balances && state.account.balances.gRipOnArbitrum;
  });
  const gRipOnArbAsSrip = useAppSelector(state => {
    return state.account.balances && state.account.balances.gRipOnArbAsSrip;
  });

  const gRipOnAvax = useAppSelector(state => {
    return state.account.balances && state.account.balances.gRipOnAvax;
  });
  const gRipOnAvaxAsSrip = useAppSelector(state => {
    return state.account.balances && state.account.balances.gRipOnAvaxAsSrip;
  });

  const gRipOnPolygon = useAppSelector(state => {
    return state.account.balances && state.account.balances.gRipOnPolygon;
  });
  const gRipOnPolygonAsSrip = useAppSelector(state => {
    return state.account.balances && state.account.balances.gRipOnPolygonAsSrip;
  });

  const gRipOnFantom = useAppSelector(state => {
    return state.account.balances && state.account.balances.gRipOnFantom;
  });
  const gRipOnFantomAsSrip = useAppSelector(state => {
    return state.account.balances && state.account.balances.gRipOnFantomAsSrip;
  });

  const gRipOnTokemak = useAppSelector(state => {
    return state.account.balances && state.account.balances.gRipOnTokemak;
  });
  const gRipOnTokemakAsSrip = useAppSelector(state => {
    return state.account.balances && state.account.balances.gRipOnTokemakAsSrip;
  });

  const stakeAllowance = useAppSelector(state => {
    return (state.account.staking && state.account.staking.ripStake) || 0;
  });
  const unstakeAllowance = useAppSelector(state => {
    return (state.account.staking && state.account.staking.ripUnstake) || 0;
  });

  const directUnstakeAllowance = useAppSelector(state => {
    return (state.account.wrapping && state.account.wrapping.gRipUnwrap) || 0;
  });

  const stakingRebase = useAppSelector(state => {
    return state.app.stakingRebase || 0;
  });
  const stakingAPY = useAppSelector(state => {
    return state.app.stakingAPY || 0;
  });
  const stakingTVL = useAppSelector(state => {
    return state.app.stakingTVL || 0;
  });

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === 0) {
      setQuantity(ripBalance);
    } else if (!confirmation) {
      setQuantity(sripBalance);
    } else if (confirmation) {
      setQuantity(gRipAsSrip.toString());
    }
  };

  const onSeekApproval = async (token: string) => {
    if (token === "grip") {
      await dispatch(changeGripApproval({ address, token: token.toLowerCase(), provider, networkID: networkId }));
    } else {
      await dispatch(changeApproval({ address, token, provider, networkID: networkId, version2: true }));
    }
  };

  const onChangeStake = async (action: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(Number(quantity)) || Number(quantity) === 0 || Number(quantity) < 0) {
      // eslint-disable-next-line no-alert
      return dispatch(error(t`Please enter a value!`));
    }

    // 1st catch if quantity > balance
    const gweiValue = ethers.utils.parseUnits(quantity.toString(), "gwei");
    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(ripBalance, "gwei"))) {
      return dispatch(error(t`You cannot stake more than your RIP balance.`));
    }

    if (confirmation === false && action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(sripBalance, "gwei"))) {
      return dispatch(
        error(
          t`You do not have enough sRIP to complete this transaction.  To unstake from gRIP, please toggle the srip-grip switch.`,
        ),
      );
    }

    /**
     * converts sRIP quantity to gRIP quantity when box is checked for gRIP staking
     * @returns sRIP as gRIP quantity
     */
    const formQuant = async () => {
      if (confirmation && currentIndex && view === 1) {
        return await getGripBalFromSrip({ provider, networkID: networkId, sRIPbalance: quantity });
      } else {
        return quantity;
      }
    };

    await dispatch(
      changeStake({
        address,
        action,
        value: await formQuant(),
        provider,
        networkID: networkId,
        version2: true,
        rebase: !confirmation,
      }),
    );
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "rip") return stakeAllowance > 0;
      if (token === "srip") return unstakeAllowance > 0;
      if (token === "grip") return directUnstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance, directUnstakeAllowance],
  );

  const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);

  const changeView: any = (_event: ChangeEvent<any>, newView: number) => {
    setView(newView);
  };

  const handleChangeQuantity = useCallback<ChangeEventHandler<HTMLInputElement>>(e => {
    if (Number(e.target.value) >= 0) {
      const decimals = e.target.value.split(".")[1];
      if (decimals && decimals.length > 7)
        setQuantity(e.target.value.slice(0, e.target.value.length - (decimals.length - 7)));
      else {
        setQuantity(e.target.value);
      }
    }
  }, []);

  const trimmedBalance = Number(
    [
      sripBalance,
      gRipAsSrip,
      gRipOnArbAsSrip,
      gRipOnAvaxAsSrip,
      gRipOnPolygonAsSrip,
      gRipOnFantomAsSrip,
      gRipOnTokemakAsSrip,
      fiatDaoAsSrip,
      fsripBalance,
      fgRIPAsfsRIPBalance,
    ]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);

  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((Number(stakingRebasePercentage) / 100) * trimmedBalance, 4);

  const formattedTrimmedStakingAPY = new Intl.NumberFormat("en-US").format(Number(trimmedStakingAPY));
  const formattedStakingTVL = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(stakingTVL);
  const formattedCurrentIndex = trim(Number(currentIndex), 1);

  let stakeOnClick: () => Promise<{ payload: string; type: string } | undefined | void>;
  let stakeDisabled: boolean;
  let stakeButtonText: string;

  //set defaults. if unstake tab selected else use staking tab as default
  if (view === 1) {
    stakeDisabled = isPendingTxn(pendingTransactions, "approve_unstaking");
    stakeOnClick = () => onSeekApproval(confirmation ? "grip" : "srip");
    stakeButtonText = txnButtonText(pendingTransactions, "approve_unstaking", t`Approve`);
  } else {
    stakeDisabled = isPendingTxn(pendingTransactions, "approve_staking");
    stakeOnClick = () => onSeekApproval("rip");
    stakeButtonText = txnButtonText(pendingTransactions, "approve_staking", t`Approve`);
  }

  //evaluate if data allowance data is finished loading
  if (!isAllowanceDataLoading) {
    //If Staking Tab
    if (view === 0) {
      if (address && hasAllowance("rip")) {
        stakeDisabled = isPendingTxn(pendingTransactions, "staking");
        stakeOnClick = () => onChangeStake("stake");
        stakeButtonText = txnButtonText(
          pendingTransactions,
          "staking",
          `${t`Stake to`} ${confirmation ? " gRIP" : " sRIP"}`,
        );
      }
    }
    //If Unstaking Tab
    if (view === 1) {
      if ((address && hasAllowance("srip") && !confirmation) || (hasAllowance("grip") && confirmation)) {
        stakeDisabled = isPendingTxn(pendingTransactions, "unstaking");
        stakeOnClick = () => onChangeStake("unstake");
        stakeButtonText = txnButtonText(
          pendingTransactions,
          "unstaking",
          `${t`Unstake from`} ${confirmation ? " gRIP" : " sRIP"}`,
        );
      }
    }
  }

  return (
    <div id="stake-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className="blur7">
          <Typography align="center" variant="h4" style={{ fontWeight: "bold", marginTop: "20px" }}>
            {t`Single Stake (3, 3)`}
          </Typography>
          <Typography align="center" variant="h6" style={{ fontWeight: "bold", margin: "auto" }}>
            {<RebaseTimer />}
          </Typography>
          <Grid container direction="column" spacing={2} style={{ marginTop: "20px" }}>
            <Grid container direction="row" spacing={3} style={{ marginTop: "20px", padding: "0 0 2rem 0" }}>
              <Grid item md={6} sm={6} xs={6}>
                <Box alignItems="right" display="flex" flexDirection="column" justifyContent="right">
                  <Typography
                    align="right"
                    variant="h5"
                    style={{ fontWeight: "bold", color: "black" }}
                  >{t`APY`}</Typography>
                  <Typography
                    align="right"
                    variant="h5"
                    style={{ fontWeight: "bold", color: "black" }}
                  >{t`Total Value Deposited`}</Typography>
                  <Typography
                    align="right"
                    variant="h5"
                    style={{ fontWeight: "bold", color: "black" }}
                  >{t`Current Index`}</Typography>
                </Box>
              </Grid>
              <Grid item md={6} sm={6} xs={6}>
                <Box alignItems="left" display="flex" flexDirection="column" justifyContent="left">
                  {stakingAPY ? (
                    <Typography align="left" variant="h5" style={{ color: "black" }}>
                      {`${formattedTrimmedStakingAPY}%`}
                    </Typography>
                  ) : (
                    <Typography align="left" variant="h5" style={{ color: "black" }}>
                      Loading...
                    </Typography>
                  )}
                  {stakingTVL ? (
                    <Typography align="left" variant="h5" style={{ color: "black" }}>
                      {formattedStakingTVL}
                    </Typography>
                  ) : (
                    <Typography align="left" variant="h5" style={{ color: "black" }}>
                      Loading...
                    </Typography>
                  )}
                  {currentIndex ? (
                    <Typography align="left" variant="h5" style={{ color: "black" }}>
                      {`${formattedCurrentIndex} sr.rip`}
                    </Typography>
                  ) : (
                    <Typography align="left" variant="h5" style={{ color: "black" }}>
                      Loading...
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    <ConnectButton light="light" />
                  </div>
                  <Typography variant="h6">
                    <Trans>Connect your wallet to stake RIP</Trans>
                  </Typography>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={view}
                      textColor="primary"
                      indicatorColor="primary"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                      //hides the tab underline sliding animation in while <Zoom> is loading
                      TabIndicatorProps={!zoomed ? { style: { display: "none" } } : undefined}
                    >
                      <Tab
                        aria-label="stake-button"
                        label={t({
                          id: "do_stake",
                          comment: "The action of staking (verb)",
                        })}
                      />
                      <Tab aria-label="unstake-button" label={t`Unstake`} />
                    </Tabs>
                    <Grid container className="stake-action-row">
                      {address && !isAllowanceDataLoading ? (
                        (!hasAllowance("rip") && view === 0) ||
                        (!hasAllowance("srip") && view === 1 && !confirmation) ||
                        (!hasAllowance("grip") && view === 1 && confirmation) ? (
                          <>
                            <Grid item xs={12} sm={8} className="stake-grid-item">
                              <Box mt={"10px"}>
                                <Typography variant="body1" className="stake-note" color="textSecondary">
                                  {view === 0 ? (
                                    <>
                                      <Trans>First time staking</Trans> <b>RIP</b>?
                                      <br />
                                      <Trans>Please approve RIPProtocol Dao to use your</Trans> <b>RIP</b>{" "}
                                      <Trans>for staking</Trans>.
                                    </>
                                  ) : (
                                    <>
                                      <Trans>First time unstaking</Trans> <b>{confirmation ? "gRIP" : "sRIP"}</b>?
                                      <br />
                                      <Trans>Please approve RIPProtocol Dao to use your</Trans>{" "}
                                      <b>{confirmation ? "gRIP" : "sRIP"}</b> <Trans>for unstaking</Trans>.
                                    </>
                                  )}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12} sm={4} className="stake-grid-item">
                              <Box mt={1}>
                                <StyledButton
                                  light="light"
                                  className="stake-button"
                                  disabled={stakeDisabled}
                                  onClick={stakeOnClick}
                                >
                                  {stakeButtonText}
                                </StyledButton>
                              </Box>
                            </Grid>
                          </>
                        ) : (
                          <InputWrapper
                            id="amount-input"
                            type="number"
                            label={t`Enter an amount`}
                            value={quantity}
                            onChange={handleChangeQuantity}
                            labelWidth={0}
                            endString={t`Max`}
                            endStringOnClick={setMax}
                            buttonText={stakeButtonText}
                            buttonOnClick={stakeOnClick}
                            disabled={stakeDisabled}
                          />
                        )
                      ) : (
                        <Skeleton width="150px" />
                      )}
                    </Grid>
                  </Box>
                  <ConfirmDialog
                    quantity={quantity}
                    currentIndex={currentIndex}
                    view={view}
                    onConfirm={setConfirmation}
                  />
                  <div className="stake-user-data">
                    <DataRow
                      title={t`Unstaked Balance`}
                      id="user-balance"
                      balance={`${trim(Number(ripBalance), 4)} RIP`}
                      isLoading={isAppLoading}
                    />
                    <Accordion className="stake-accordion" square defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMore className="stake-expand" />}>
                        <DataRow
                          title={t`Total Staked Balance`}
                          id="user-staked-balance"
                          balance={`${trimmedBalance} sRIP`}
                          isLoading={isAppLoading}
                        />
                      </AccordionSummary>
                      <AccordionDetails>
                        <DataRow
                          title={t`sRIP Balance`}
                          balance={`${trim(Number(sripBalance), 4)} sRIP`}
                          indented
                          isLoading={isAppLoading}
                        />
                        <DataRow
                          title={`${t`gRIP Balance`}`}
                          balance={`${trim(Number(gRipBalance), 4)} gRIP`}
                          indented
                          isLoading={isAppLoading}
                        />
                        {Number(gRipOnArbitrum) > 0.00009 && (
                          <DataRow
                            title={`${t`gRIP (Arbitrum)`}`}
                            balance={`${trim(Number(gRipOnArbitrum), 4)} gRIP`}
                            indented
                            {...{ isAppLoading }}
                          />
                        )}
                        {Number(gRipOnAvax) > 0.00009 && (
                          <DataRow
                            title={`${t`gRIP (Avalanche)`}`}
                            balance={`${trim(Number(gRipOnAvax), 4)} gRIP`}
                            indented
                            {...{ isAppLoading }}
                          />
                        )}
                        {Number(gRipOnPolygon) > 0.00009 && (
                          <DataRow
                            title={`${t`gRIP (Polygon)`}`}
                            balance={`${trim(Number(gRipOnPolygon), 4)} gRIP`}
                            indented
                            {...{ isAppLoading }}
                          />
                        )}
                        {Number(gRipOnFantom) > 0.00009 && (
                          <DataRow
                            title={`${t`gRIP (Fantom)`}`}
                            balance={`${trim(Number(gRipOnFantom), 4)} gRIP`}
                            indented
                            {...{ isAppLoading }}
                          />
                        )}
                        {Number(gRipOnTokemak) > 0.00009 && (
                          <DataRow
                            title={`${t`gRIP (Tokemak)`}`}
                            balance={`${trim(Number(gRipOnTokemak), 4)} gRIP`}
                            indented
                            isLoading={isAppLoading}
                          />
                        )}
                        {Number(fgripBalance) > 0.00009 && (
                          <DataRow
                            title={`${t`gRIP Balance in Fuse`}`}
                            balance={`${trim(Number(fgripBalance), 4)} gRIP`}
                            indented
                            isLoading={isAppLoading}
                          />
                        )}
                        {Number(sripV1Balance) > 0.00009 && (
                          <DataRow
                            title={`${t`sRIP Balance`} (v1)`}
                            balance={`${trim(Number(sripV1Balance), 4)} sRIP (v1)`}
                            indented
                            isLoading={isAppLoading}
                          />
                        )}
                        {Number(wsripBalance) > 0.00009 && (
                          <DataRow
                            title={`${t`wsRIP Balance`} (v1)`}
                            balance={`${trim(Number(wsripBalance), 4)} wsRIP (v1)`}
                            isLoading={isAppLoading}
                            indented
                          />
                        )}
                        {Number(fiatDaowsripBalance) > 0.00009 && (
                          <DataRow
                            title={t`wsRIP Balance in FiatDAO (v1)`}
                            balance={`${trim(Number(fiatDaowsripBalance), 4)} wsRIP (v1)`}
                            isLoading={isAppLoading}
                            indented
                          />
                        )}
                        {Number(fsripBalance) > 0.00009 && (
                          <DataRow
                            title={t`sRIP Balance in Fuse (v1)`}
                            balance={`${trim(Number(fsripBalance), 4)} sRIP (v1)`}
                            indented
                            isLoading={isAppLoading}
                          />
                        )}
                      </AccordionDetails>
                    </Accordion>
                    <Divider color="secondary" />
                    <DataRow
                      title={t`Next Reward Amount`}
                      balance={`${nextRewardValue} sRIP`}
                      isLoading={isAppLoading}
                    />
                    <DataRow
                      title={t`Next Reward Yield`}
                      balance={`${stakingRebasePercentage}%`}
                      isLoading={isAppLoading}
                    />
                    <DataRow
                      title={t`ROI (5-Day Rate)`}
                      balance={`${trim(Number(fiveDayRate) * 100, 4)}%`}
                      isLoading={isAppLoading}
                    />
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>
      {/* NOTE (appleseed-olyzaps) olyzaps disabled until v2 contracts */}
      {/* <ExternalStakePool /> */}
    </div>
  );
};

export default memo(Stake);
