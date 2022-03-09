import "../Stake/Stake.scss";

import { t } from "@lingui/macro";
import { Box, Button, Divider, FormControl, Grid, MenuItem, Select, Typography, Zoom } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { DataRow, InputWrapper, Paper } from "@olympusdao/component-library";
import { FC, useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import ConnectButton from "src/components/ConnectButton/ConnectButton";
import { useAppSelector } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonTextMultiType } from "src/slices/PendingTxnsSlice";

import { NETWORKS } from "../../constants";
import { formatCurrency, trim } from "../../helpers";
import { switchNetwork } from "../../helpers/NetworkHelper";
import { changeApproval, changeWrapV2 } from "../../slices/WrapThunk";
import WrapCrossChain from "./WrapCrossChain";

const Wrap: FC = () => {
  const dispatch = useDispatch();
  const { provider, address, connect, networkId } = useWeb3Context();

  const [, setZoomed] = useState<boolean>(false);
  const [assetFrom, setAssetFrom] = useState<string>("sRIP");
  const [assetTo, setAssetTo] = useState<string>("gRIP");
  const [quantity, setQuantity] = useState<string>("");

  const chooseCurrentAction = () => {
    if (assetFrom === "sRIP") return "Wrap from";
    if (assetTo === "sRIP") return "Unwrap from";
    return "Transform";
  };
  const currentAction = chooseCurrentAction();

  const isAppLoading = useAppSelector(state => state.app.loading);
  const currentIndex = useAppSelector(state => Number(state.app.currentIndex));
  const sRipPrice = useAppSelector(state => Number(state.app.marketPrice));

  const gRipPrice = useAppSelector(state => state.app.marketPrice! * Number(state.app.currentIndex));
  const sripBalance = useAppSelector(state => state.account.balances && state.account.balances.srip);
  const gripBalance = useAppSelector(state => state.account.balances && state.account.balances.grip);
  const unwrapGripAllowance = useAppSelector(state => state.account.wrapping && state.account.wrapping.gRipUnwrap);
  const wrapSripAllowance = useAppSelector(state => state.account.wrapping && state.account.wrapping.sripWrap);
  const pendingTransactions = useAppSelector(state => state.pendingTransactions);

  const avax = NETWORKS[43114];
  const arbitrum = NETWORKS[42161];

  const isAvax = useMemo(() => networkId != 56 && networkId != 97 && networkId != -1, [networkId]);

  const wrapButtonText =
    assetTo === "gRIP" ? (assetFrom === "wsRIP" ? "Migrate" : "Wrap") + " to gRIP" : `${currentAction} ${assetFrom}`;

  const setMax = () => {
    if (assetFrom === "sRIP") setQuantity(sripBalance);
    if (assetFrom === "gRIP") setQuantity(gripBalance);
  };

  const handleSwitchChain = (id: number) => {
    return () => {
      switchNetwork({ provider: provider, networkId: id });
    };
  };

  const hasCorrectAllowance = useCallback(() => {
    if (assetFrom === "sRIP" && assetTo === "gRIP") return wrapSripAllowance > Number(sripBalance);
    if (assetFrom === "gRIP" && assetTo === "sRIP") return unwrapGripAllowance > Number(gripBalance);

    return 0;
  }, [unwrapGripAllowance, wrapSripAllowance, assetTo, assetFrom, sripBalance, gripBalance]);

  // @ts-ignore
  const isAllowanceDataLoading = currentAction === "Unwrap";

  const temporaryStore = assetTo;

  const changeAsset = () => {
    setQuantity("");
    setAssetTo(assetFrom);
    setAssetFrom(temporaryStore);
  };

  const approveWrap = (token: string) => {
    dispatch(changeApproval({ address, token: token.toLowerCase(), provider, networkID: networkId }));
  };

  const unwrapGrip = () => {
    dispatch(changeWrapV2({ action: "unwrap", value: quantity, provider, address, networkID: networkId }));
  };

  const wrapSrip = () => {
    dispatch(changeWrapV2({ action: "wrap", value: quantity, provider, address, networkID: networkId }));
  };

  const approveCorrectToken = () => {
    if (assetFrom === "sRIP" && assetTo === "gRIP") approveWrap("sRIP");
    if (assetFrom === "gRIP" && assetTo === "sRIP") approveWrap("gRIP");
  };

  const chooseCorrectWrappingFunction = () => {
    if (assetFrom === "sRIP" && assetTo === "gRIP") wrapSrip();
    if (assetFrom === "gRIP" && assetTo === "sRIP") unwrapGrip();
  };

  const chooseInputArea = () => {
    if (!address || isAllowanceDataLoading) return <Skeleton width="150px" />;
    if (assetFrom === assetTo) return "";
    if (!hasCorrectAllowance() && assetTo === "gRIP")
      return (
        <div className="no-input-visible">
          First time wrapping to <b>gRIP</b>?
          <br />
          Please approve RIPProtocol to use your <b>{assetFrom}</b> for this transaction.
        </div>
      );
    else if (!hasCorrectAllowance() && assetTo === "sRIP")
      return (
        <div className="no-input-visible">
          First time unwrapping <b>{assetFrom}</b>?
          <br />
          Please approve RIPProtocol to use your <b>{assetFrom}</b> for unwrapping.
        </div>
      );

    return (
      <InputWrapper
        id="amount-input"
        type="number"
        placeholder={t`Enter an amount`}
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
        labelWidth={0}
        endString={t`Max`}
        endStringOnClick={setMax}
        disabled={isPendingTxn(pendingTransactions, "wrapping") || isPendingTxn(pendingTransactions, "migrate")}
        buttonOnClick={chooseCorrectWrappingFunction}
        buttonText={txnButtonTextMultiType(pendingTransactions, ["wrapping", "migrate"], wrapButtonText)}
      />
    );
  };

  const chooseButtonArea = () => {
    if (!address) return "";
    if (assetFrom === assetTo) return "";
    if (!hasCorrectAllowance())
      return (
        <Button
          className="stake-button wrap-page"
          variant="contained"
          color="primary"
          disabled={
            isPendingTxn(pendingTransactions, "approve_wrapping") ||
            isPendingTxn(pendingTransactions, "approve_migration")
          }
          onClick={approveCorrectToken}
        >
          {txnButtonTextMultiType(pendingTransactions, ["approve_wrapping", "approve_migration"], "Approve")}
        </Button>
      );
  };

  if (!isAvax) {
    return (
      <div id="stake-view" className="wrapper">
        <Zoom in={true} onEntered={() => setZoomed(true)}>
          <Paper
          // topRight={
          //   <Link
          //     className="migrate-srip-button"
          //     style={{ textDecoration: "none" }}
          //     href={
          //       assetTo === "wsRIP"
          //         ? "https://docs.olympusdao.finance/main/contracts/tokens#wsrip"
          //         : "https://docs.olympusdao.finance/main/contracts/tokens#grip"
          //     }
          //     aria-label="wsrip-wut"
          //     target="_blank"
          //   >
          //     <Typography>gr.rip</Typography> <Icon style={{ marginRight: "5px" }} name="arrow-up" />
          //   </Link>
          // }
          >
            <Typography align="center" variant="h4" style={{ fontWeight: "bold", marginTop: "20px" }}>
              {t`Wrap / Unwrap`}
            </Typography>
            <Grid container direction="row" spacing={3} style={{ marginTop: "20px", padding: "0 0 2rem 0" }}>
              <Grid item md={6} sm={6} xs={6}>
                <Box
                  alignItems="right"
                  display="flex"
                  flexDirection="column"
                  justifyContent="right"
                  // className={`${classes.infoHeader} oly-info-header-box`}
                >
                  <Typography
                    align="right"
                    variant="h5"
                    style={{ fontWeight: "bold", color: "black" }}
                  >{`sr.rip ${t`Price`}`}</Typography>
                  <Typography
                    align="right"
                    variant="h5"
                    style={{ fontWeight: "bold", color: "black" }}
                  >{t`Current Index`}</Typography>
                  <Typography
                    align="right"
                    variant="h5"
                    style={{ fontWeight: "bold", color: "black" }}
                  >{`gr.rip ${t`Price`}`}</Typography>
                </Box>
              </Grid>
              <Grid item md={6} sm={6} xs={6}>
                <Box
                  alignItems="left"
                  display="flex"
                  flexDirection="column"
                  justifyContent="left"
                  // className={`${classes.infoHeader} oly-info-header-box`}
                >
                  {sRipPrice ? (
                    <Typography align="left" variant="h5" style={{ color: "black" }}>
                      {formatCurrency(sRipPrice, 2)}
                    </Typography>
                  ) : (
                    <Typography align="left" variant="h6" style={{ color: "black" }}>
                      Loading...
                    </Typography>
                  )}
                  {gRipPrice ? (
                    <Typography align="left" variant="h5" style={{ color: "black" }}>
                      {trim(currentIndex, 1)}
                    </Typography>
                  ) : (
                    <Typography align="left" variant="h6" style={{ color: "black" }}>
                      Loading...
                    </Typography>
                  )}
                  {gRipPrice ? (
                    <Typography align="left" variant="h5" style={{ color: "black" }}>
                      {formatCurrency(gRipPrice, 2)}
                    </Typography>
                  ) : (
                    <Typography align="left" variant="h6" style={{ color: "black" }}>
                      Loading...
                    </Typography>
                  )}
                </Box>
              </Grid>
              {/* <MetricCollection>
                <Metric
                  label={`sRIP ${t`Price`}`}
                  metric={formatCurrency(sRipPrice, 2)}
                  isLoading={sRipPrice ? false : true}
                />
                <Metric
                  label={t`Current Index`}
                  metric={trim(currentIndex, 1)}
                  isLoading={currentIndex ? false : true}
                />
                <Metric
                  label={`gRIP ${t`Price`}`}
                  metric={formatCurrency(gRipPrice, 2)}
                  isLoading={gRipPrice ? false : true}
                  tooltip={`gRIP = sRIP * index\n\nThe price of gRIP is equal to the price of sRIP multiplied by the current index`}
                />
              </MetricCollection> */}
            </Grid>
            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    <ConnectButton />
                  </div>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                    <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                      <>
                        <Typography>
                          <span className="asset-select-label" style={{ whiteSpace: "nowrap" }}>
                            {currentAction}
                          </span>
                        </Typography>
                        <FormControl
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            margin: "0 10px",
                            height: "33px",
                            minWidth: "69px",
                          }}
                        >
                          <Select
                            id="asset-select"
                            value={assetFrom}
                            label="Asset"
                            onChange={changeAsset}
                            disableUnderline
                          >
                            <MenuItem value={"sRIP"}>sRIP</MenuItem>
                            <MenuItem value={"gRIP"}>gRIP</MenuItem>
                          </Select>
                        </FormControl>

                        <Typography>
                          <span className="asset-select-label"> to </span>
                        </Typography>
                        <FormControl
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            margin: "0 10px",
                            height: "33px",
                            minWidth: "69px",
                          }}
                        >
                          <Select
                            id="asset-select"
                            value={assetTo}
                            label="Asset"
                            onChange={changeAsset}
                            disableUnderline
                          >
                            <MenuItem value={"gRIP"}>gRIP</MenuItem>
                            <MenuItem value={"sRIP"}>sRIP</MenuItem>
                          </Select>
                        </FormControl>
                      </>
                    </Box>
                    <Box display="flex" alignItems="center" style={{ paddingBottom: 0 }}>
                      <div className="stake-tab-panel wrap-page">
                        {chooseInputArea()}
                        {chooseButtonArea()}
                      </div>
                    </Box>
                  </Box>
                  <div className={`stake-user-data`}>
                    <>
                      <DataRow
                        title={t`sRIP Balance`}
                        balance={`${trim(+sripBalance, 4)} sRIP`}
                        isLoading={isAppLoading}
                      />
                      <DataRow
                        title={t`gRIP Balance`}
                        balance={`${trim(+gripBalance, 4)} gRIP`}
                        isLoading={isAppLoading}
                      />
                      <Divider />
                      <Box width="100%" p={1} sx={{ textAlign: "center" }}>
                        <Typography variant="body1" style={{ margin: "15px 0 10px 0" }}>
                          wsRIP on the other networks is not launched yet.
                        </Typography>
                        {/* <Button onClick={handleSwitchChain(43114)} variant="outlined" style={{ margin: "0.3rem" }}>
                          <img height="28px" width="28px" src={String(avax.image)} alt={avax.imageAltText} />
                          <Typography variant="h6" style={{ marginLeft: "8px" }}>
                            {avax.chainName}
                          </Typography>
                        </Button>
                        <Button onClick={handleSwitchChain(42161)} variant="outlined" style={{ margin: "0.3rem" }}>
                          <img height="28px" width="28px" src={String(arbitrum.image)} alt={arbitrum.imageAltText} />
                          <Typography variant="h6" style={{ marginLeft: "8px" }}>
                            {arbitrum.chainName}
                          </Typography>
                        </Button> */}
                      </Box>
                    </>
                  </div>
                </>
              )}
            </div>
          </Paper>
        </Zoom>
      </div>
    );
  } else {
    return <WrapCrossChain />;
  }
};

export default Wrap;
