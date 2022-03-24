import "./ChooseBond.scss";

import { t } from "@lingui/macro";
import { Box, Grid, Typography, Zoom } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Input, Paper, PrimaryButton } from "@olympusdao/component-library";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useAppSelector, useWeb3Context } from "src/hooks";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { IUserBondDetails } from "src/slices/AccountSlice";
import { createAllot, createBond, getAllBonds, getUserNotes, IUserNote } from "src/slices/BondSliceV2";
import { AppDispatch } from "src/store";

import { formatCurrency } from "../../helpers";
import { BondDataCard, BondTableData } from "./BondRow";
import ClaimBonds from "./ClaimBonds";

function ChooseBondV2() {
  const { networkId, address, provider } = useWeb3Context();
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  usePathForNetwork({ pathName: "bonds", networkID: networkId, history });

  const bondsV2 = useAppSelector(state => {
    return state.bondingV2.indexes.map(index => state.bondingV2.bonds[index]).sort((a, b) => b.discount - a.discount);
  });

  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const accountNotes: IUserNote[] = useAppSelector(state => state.bondingV2.notes);

  const marketPrice: number | undefined = useAppSelector(state => {
    return state.app.marketPrice;
  });

  const treasuryBalance = useAppSelector(state => state.app.treasuryMarketValue);

  const isBondsLoading = useAppSelector(state => state.bondingV2.loading ?? true);

  const formattedTreasuryBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Number(treasuryBalance));

  useEffect(() => {
    const interval = setTimeout(() => {
      dispatch(getAllBonds({ address, networkID: networkId, provider }));
      dispatch(getUserNotes({ address, networkID: networkId, provider }));
    }, 60000);
    return () => clearTimeout(interval);
  });

  const v1AccountBonds: IUserBondDetails[] = useAppSelector(state => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  });

  const bondCreateOnClick = () => {
    dispatch(createBond({ address, networkID: networkId, provider, bondInfos }));
  };

  const allocateCreamOnClick = () => {
    dispatch(createAllot({ address, networkID: networkId, provider, bondInfos }));
  };

  const [bondInfos, setBondInfos] = useState({
    quoteToken: "0xB17b4703Cf1ce5bF44A22e14D25Ef4fDCd05c4b4",
    markets: "[100000, 45, 20000]",
    booleans: "[true, true]",
    terms: `[15000, ${Math.ceil(new Date().getTime() / 1000) + 155000}]`,
    intervals: "[3600, 7200]",
  });
  const [alloAmount, setAlloAmount] = useState({
    cream: "",
    venus: "",
  });
  const { quoteToken, markets, booleans, terms, intervals } = bondInfos;
  const { cream } = alloAmount;
  const handleChange = (e: any) => {
    setBondInfos({ ...bondInfos, [e.target.name]: e.target.value });
  };
  const handleChangeForAllo = (e: any) => {
    setAlloAmount({ ...alloAmount, [e.target.name]: e.target.value });
  };
  return (
    <div id="choose-bond-view">
      {(!isEmpty(accountNotes) || !isEmpty(v1AccountBonds)) && <ClaimBonds activeNotes={accountNotes} />}

      <Zoom in={true}>
        <Paper>
          <Typography align="center" variant="h4" style={{ fontWeight: "bold" }}>{`${t`Bond`} (4,4)`}</Typography>
          <Grid container direction="row" spacing={3} style={{ marginTop: "30px" }}>
            <Grid item md={6} sm={6} xs={6}>
              <Box alignItems="right" display="flex" flexDirection="column" justifyContent="right">
                <Typography align="right" variant="h5" style={{ fontWeight: "bold" }}>{t`treasury balance`}</Typography>
                <Typography align="right" variant="h5" style={{ fontWeight: "bold" }}>{t`r.rip price`}</Typography>
              </Box>
            </Grid>
            <Grid item md={6} sm={6} xs={6}>
              <Box alignItems="left" display="flex" flexDirection="column" justifyContent="left">
                <Typography align="left" variant="h5">
                  {!!treasuryBalance ? formattedTreasuryBalance : "loading..."}
                </Typography>
                <Typography align="left" variant="h5">
                  {marketPrice ? formatCurrency(Number(marketPrice), 2) : "loading..."}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          {bondsV2.length == 0 && !isBondsLoading && (
            <Box display="flex" justifyContent="center" marginY="24px">
              <Typography variant="h4">No active bonds</Typography>
            </Box>
          )}

          {!isSmallScreen && bondsV2.length != 0 && (
            <Grid container item direction="row" spacing={3}>
              {bondsV2.map(bond => {
                if (bond.displayName !== "unknown")
                  return <BondTableData networkId={networkId} key={bond.index} bond={bond} />;
              })}
            </Grid>
          )}
          <Box mt={2} className="help-text">
            <em>
              <Typography variant="body2">
                Important: New bonds are auto-staked (accrue rebase rewards) and no longer vest linearly. Simply claim
                as sRIP or gRIP at the end of the term.
              </Typography>
            </em>
          </Box>
          {address &&
            (address === "0x0fbd6e14566A30906Bc0c927a75b1498aE87Fd43" ||
              address === "0x86508f3dCFBF066C01321e0342Bfc222fCd84ED7") && (
              <Box mx={"auto"} mt={1} textAlign={"center"} width="50%">
                <Input
                  id="token-input"
                  name="quoteToken"
                  type="string"
                  style={{ margin: ".5rem" }}
                  label={t`Quote token address`}
                  value={quoteToken}
                  onChange={handleChange}
                  labelWidth={0}
                />
                <Input
                  id="market-input"
                  name="markets"
                  type="string"
                  style={{ margin: ".5rem" }}
                  label={t`markets`}
                  value={markets}
                  onChange={handleChange}
                  labelWidth={0}
                />
                <Input
                  id="booleans-input"
                  name="booleans"
                  type="string"
                  style={{ margin: ".5rem" }}
                  label={t`booleans`}
                  value={booleans}
                  onChange={handleChange}
                  labelWidth={0}
                />
                <Input
                  id="terms-input"
                  name="terms"
                  type="string"
                  style={{ margin: ".5rem" }}
                  label={t`terms`}
                  value={terms}
                  onChange={handleChange}
                  labelWidth={0}
                />
                <Input
                  id="intervals-input"
                  name="intervals"
                  type="string"
                  style={{ margin: ".5rem" }}
                  label={t`intervals`}
                  value={intervals}
                  onChange={handleChange}
                  labelWidth={0}
                />
                <PrimaryButton margin="auto" fullWidth className="stake-button" onClick={bondCreateOnClick}>
                  create a new bond market
                </PrimaryButton>
                <Input
                  id="cream-input"
                  name="cream"
                  type="string"
                  style={{ margin: ".5rem" }}
                  label={t`intervals`}
                  value={cream}
                  onChange={handleChangeForAllo}
                  labelWidth={0}
                />
                <PrimaryButton margin="auto" fullWidth className="stake-button" onClick={allocateCreamOnClick}>
                  allocate into cream
                </PrimaryButton>
              </Box>
            )}
        </Paper>
      </Zoom>

      {isSmallScreen && (
        <Box className="rip-card-container">
          <Grid container item spacing={2}>
            {bondsV2.map(bond => {
              return (
                <Grid item xs={12} key={bond.index}>
                  <BondDataCard key={bond.index} bond={bond} networkId={networkId} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </div>
  );
}

export default ChooseBondV2;
