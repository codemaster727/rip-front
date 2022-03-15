import "../Stake/Stake.scss";
import "./V1-Stake.scss";

import { t, Trans } from "@lingui/macro";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Zoom,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import { Tab, TabPanel, Tabs } from "@olympusdao/component-library";
import { DataRow, Paper } from "@olympusdao/component-library";
import { ethers } from "ethers";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { LearnMoreButton, MigrateButton } from "src/components/CallToAction/CallToAction";
import ConnectButton from "src/components/ConnectButton/ConnectButton";
import { useAppSelector } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";

import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import { getRipTokenImage, getTokenImage, trim } from "../../helpers";
import { error } from "../../slices/MessagesSlice";
import { changeApproval, changeStake } from "../../slices/StakeThunk";
import ExternalStakePool from "../Stake/ExternalStakePool";

const sRipImg = getTokenImage("srip");
const ripImg = getRipTokenImage(16, 16);

function V1Stake({ oldAssetsDetected, setMigrationModalOpen, hasActiveV1Bonds }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { provider, address, connect, networkId } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");

  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useSelector(state => {
    return state.app.fiveDayRate;
  });
  const ripBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ripV1;
  });
  const sripBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sripV1;
  });
  const fsripBalance = useSelector(state => {
    return state.account.balances && state.account.balances.fsrip;
  });
  const wsripBalance = useSelector(state => {
    return state.account.balances && state.account.balances.wsrip;
  });
  const stakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.ripStakeV1;
  });
  const unstakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.ripUnstakeV1;
  });
  const stakingRebase = useSelector(state => {
    return state.app.stakingRebase;
  });
  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY;
  });
  const stakingTVL = useSelector(state => {
    return state.app.stakingTVL;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const fiatDaowsripBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.fiatDaowsrip;
  });

  const gRipBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.grip;
  });
  const sripV2Balance = useSelector(state => {
    return state.account.balances && state.account.balances.srip;
  });

  const calculateWrappedAsSrip = balance => {
    return Number(balance) * Number(currentIndex);
  };
  const fiatDaoAsSrip = calculateWrappedAsSrip(fiatDaowsripBalance);
  const gRipAsSrip = calculateWrappedAsSrip(gRipBalance);
  const wsripAsSrip = calculateWrappedAsSrip(wsripBalance);

  const setMax = () => {
    if (view === 0) {
      setQuantity(ripBalance);
    } else {
      setQuantity(sripBalance);
    }
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: networkId, version2: false }));
  };

  const onChangeStake = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity, "gwei");
    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(ripBalance, "gwei"))) {
      return dispatch(error("You cannot stake more than your RIP balance."));
    }

    if (action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(sripBalance, "gwei"))) {
      return dispatch(error("You cannot unstake more than your sRIP balance."));
    }

    await dispatch(
      changeStake({ address, action, value: quantity.toString(), provider, networkID: networkId, version2: false }),
    );
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "rip") return stakeAllowance > 0;
      if (token === "srip") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance],
  );

  const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);

  const changeView = (event, newView) => {
    setView(newView);
  };

  const trimmedBalance = Number(
    [sripBalance, gRipAsSrip, sripV2Balance, wsripAsSrip, fiatDaoAsSrip, fsripBalance]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((stakingRebasePercentage / 100) * trimmedBalance, 4);

  const goToV2Stake = () => {
    history.push("/stake");
  };

  const goToBonds = () => {
    // v1 bonds for v1 stake
    history.push("/bonds-v1");
  };

  const formattedTrimmedStakingAPY = new Intl.NumberFormat("en-US").format(Number(trimmedStakingAPY));
  const formattedStakingTVL = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(stakingTVL);
  const formattedCurrentIndex = trim(currentIndex, 1);
  return (
    <div id="v1-stake-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper headerText={`${t`Single Stake`} (3, 3)`} subHeader={<RebaseTimer />}>
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
            {/* <Grid container direction="column" spacing={2}>
            <Grid item>
              <MetricCollection>
                <Metric
                  className="stake-apy"
                  label={`${t`APY`} (v1)`}
                  metric={`${formattedTrimmedStakingAPY}%`}
                  isLoading={stakingAPY ? false : true}
                />
                <Metric
                  className="stake-tvl"
                  label={`${t`TVL`} (v1)`}
                  metric={formattedStakingTVL}
                  isLoading={stakingTVL ? false : true}
                />
                <Metric
                  className="stake-index"
                  label={`${t`Current Index`} (v1)`}
                  metric={`${formattedCurrentIndex} RIP`}
                  isLoading={currentIndex ? false : true}
                />
              </MetricCollection>
            </Grid> */}

            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    <ConnectButton />
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
                    >
                      <Tab aria-label="stake-button" label={t`Stake`} />
                      <Tab aria-label="unstake-button" label={t`Unstake`} />
                    </Tabs>

                    <Box mt={"10px"}>
                      <Typography variant="body1" className="stake-note" color="textSecondary">
                        {view === 0 ? (
                          <>
                            {hasActiveV1Bonds
                              ? t`Once your current bonds have been claimed, you can migrate your assets to stake more RIP`
                              : !oldAssetsDetected
                              ? t`All your assets are migrated`
                              : t`You must complete the migration of your assets to stake additional RIP`}
                          </>
                        ) : (
                          <br />
                        )}
                      </Typography>
                    </Box>

                    <Box className="stake-action-row v1-row " display="flex" alignItems="center">
                      {address && !isAllowanceDataLoading ? (
                        !hasAllowance("srip") && view === 1 ? (
                          <Box mt={"10px"}>
                            <Typography variant="body1" className="stake-note" color="textSecondary">
                              <>
                                <Trans>First time unstaking</Trans> <b>sRIP</b>?
                                <br />
                                <Trans>Please approve RIPProtocol Dao to use your</Trans> <b>sRIP </b>
                                <Trans> for unstaking</Trans>.
                              </>
                            </Typography>
                          </Box>
                        ) : (
                          <>
                            {view === 1 && (
                              <FormControl className="rip-input" variant="outlined" color="primary">
                                <InputLabel htmlFor="amount-input"></InputLabel>
                                <OutlinedInput
                                  id="amount-input"
                                  type="number"
                                  placeholder="Enter an amount"
                                  className="stake-input"
                                  value={quantity}
                                  onChange={e => setQuantity(e.target.value)}
                                  labelWidth={0}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <Button variant="text" onClick={setMax} color="inherit">
                                        Max
                                      </Button>
                                    </InputAdornment>
                                  }
                                />
                              </FormControl>
                            )}

                            {view === 0 && <LearnMoreButton />}
                          </>
                        )
                      ) : (
                        <Skeleton width="150px" />
                      )}

                      {!hasActiveV1Bonds && oldAssetsDetected ? (
                        <TabPanel value={view} index={0}>
                          {isAllowanceDataLoading ? (
                            <Skeleton />
                          ) : (
                            <MigrateButton setMigrationModalOpen={setMigrationModalOpen} btnText={t`Migrate`} />
                          )}
                        </TabPanel>
                      ) : hasActiveV1Bonds ? (
                        <TabPanel value={view} index={0}>
                          <Button
                            className="migrate-button"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              goToBonds();
                            }}
                          >
                            <Trans>Go to Bonds</Trans>
                          </Button>
                        </TabPanel>
                      ) : (
                        <TabPanel value={view} index={0}>
                          <Button
                            className="migrate-button"
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              goToV2Stake();
                            }}
                          >
                            <Trans>Go to Stake V2</Trans>
                          </Button>
                        </TabPanel>
                      )}

                      <TabPanel value={view} index={1}>
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && hasAllowance("srip") ? (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "unstaking")}
                            onClick={() => {
                              onChangeStake("unstake");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "unstaking", t`Unstake RIP`)}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                            onClick={() => {
                              onSeekApproval("srip");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_unstaking", t`Approve`)}
                          </Button>
                        )}
                      </TabPanel>
                    </Box>
                  </Box>
                  <div className="stake-user-data">
                    <DataRow
                      title={`${t`Unstaked Balance`} (v1)`}
                      id="user-balance"
                      balance={`${trim(Number(ripBalance), 4)} RIP`}
                      isLoading={isAppLoading}
                    />
                    <Accordion className="stake-accordion" square>
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
                          title={`${t`sRIP Balance`} (v1)`}
                          balance={`${trim(Number(sripBalance), 4)} sRIP`}
                          indented
                          isLoading={isAppLoading}
                        />
                        {Number(fsripBalance) > 0.00009 && (
                          <DataRow
                            title={`${t`gRIP Balance in Fuse`}`}
                            balance={`${trim(Number(fsripBalance), 4)} gRIP`}
                            indented
                            isLoading={isAppLoading}
                          />
                        )}
                        {Number(wsripBalance) > 0.0 && (
                          <DataRow
                            title={`${t`wsRIP Balance`} (v1)`}
                            balance={`${trim(Number(wsripBalance), 4)} wsRIP`}
                            isLoading={isAppLoading}
                            indented
                          />
                        )}
                        {Number(fiatDaowsripBalance) > 0.00009 && (
                          <DataRow
                            title={`${t`wsRIP Balance in FiatDAO`} (v1)`}
                            balance={`${trim(Number(fiatDaowsripBalance), 4)} wsRIP`}
                            isLoading={isAppLoading}
                            indented
                          />
                        )}
                        <DataRow
                          title={`${t`sRIP Balance`} (v2)`}
                          balance={`${trim(Number(sripV2Balance), 4)} sRIP`}
                          indented
                          isLoading={isAppLoading}
                        />
                        <DataRow
                          title={`${t`gRIP Balance`} (v2)`}
                          balance={`${trim(Number(gRipBalance), 4)} gRIP`}
                          indented
                          isLoading={isAppLoading}
                        />
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

      <ExternalStakePool />
    </div>
  );
}

export default V1Stake;
