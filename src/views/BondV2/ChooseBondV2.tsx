import "./ChooseBond.scss";

import { t } from "@lingui/macro";
import { Box, Grid, Typography, Zoom } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Paper } from "@olympusdao/component-library";
import isEmpty from "lodash/isEmpty";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useAppSelector, useWeb3Context } from "src/hooks";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { IUserBondDetails } from "src/slices/AccountSlice";
import { getAllBonds, getUserNotes, IUserNote } from "src/slices/BondSliceV2";
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
  // console.log(bondsV2);
  return (
    <div id="choose-bond-view">
      {(!isEmpty(accountNotes) || !isEmpty(v1AccountBonds)) && <ClaimBonds activeNotes={accountNotes} />}

      <Zoom in={true}>
        <Paper>
          <Typography align="center" variant="h4" style={{ fontWeight: "bold" }}>{`${t`Bond`} (4,4)`}</Typography>
          <Grid container direction="row" spacing={3} style={{ marginTop: "20px" }}>
            <Grid item md={6}>
              <Box
                alignItems="right"
                display="flex"
                flexDirection="column"
                justifyContent="right"
                // className={`${classes.infoHeader} oly-info-header-box`}
              >
                <Typography align="right" variant="h5" style={{ fontWeight: "bold" }}>{t`treasury balance`}</Typography>
                <Typography align="right" variant="h5" style={{ fontWeight: "bold" }}>{t`r.rip price`}</Typography>
              </Box>
            </Grid>
            <Grid item md={6}>
              <Box
                alignItems="left"
                display="flex"
                flexDirection="column"
                justifyContent="left"
                // className={`${classes.infoHeader} oly-info-header-box`}
              >
                <Typography align="left" variant="h5">
                  {!!treasuryBalance ? formattedTreasuryBalance : "loading..."}
                  {/* {formattedTreasuryBalance} */}
                </Typography>
                <Typography align="left" variant="h5">
                  {marketPrice ? formatCurrency(Number(marketPrice), 2) : "loading..."}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          {/* <MetricCollection>
            <Metric
              label={t`Treasury Balance`}
              metric={formattedTreasuryBalance}
              isLoading={!!treasuryBalance ? false : true}
            />
            <Metric
              label={t`OHM Price`}
              metric={formatCurrency(Number(marketPrice), 2)}
              isLoading={marketPrice ? false : true}
            />
          </MetricCollection> */}

          {bondsV2.length == 0 && !isBondsLoading && (
            <Box display="flex" justifyContent="center" marginY="24px">
              <Typography variant="h4">No active bonds</Typography>
            </Box>
          )}

          {!isSmallScreen && bondsV2.length != 0 && (
            <Grid container item direction="row" spacing={3}>
              {/* <TableContainer>
                <Table aria-label="Available bonds">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        <Trans>Bond</Trans>
                      </TableCell>
                      <TableCell align="left">
                        <Trans>Price</Trans>
                      </TableCell>
                      <TableCell align="left">
                        <Trans>Discount</Trans>
                      </TableCell>
                      <TableCell align="left">
                        <Trans>Duration</Trans>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    
                  </TableBody>
                </Table>
              </TableContainer> */}
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
                as sOHM or gOHM at the end of the term.
              </Typography>
            </em>
          </Box>
        </Paper>
      </Zoom>

      {isSmallScreen && (
        <Box className="ohm-card-container">
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
