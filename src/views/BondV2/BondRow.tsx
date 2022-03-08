import "./ChooseBond.scss";

import { t, Trans } from "@lingui/macro";
import { Box, Grid, Link, Paper, Slide, SvgIcon, Typography } from "@material-ui/core";
// import { Link, Paper, Slide, SvgIcon, TableCell, TableRow, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { TertiaryButton, TokenStack } from "@olympusdao/component-library";
import { NavLink } from "react-router-dom";
import { getEtherscanUrl } from "src/helpers";
import { useAppSelector } from "src/hooks";
import { IBondV2 } from "src/slices/BondSliceV2";

import { ReactComponent as Info } from "../../assets/icons/info.svg";
// import Info from "../../assets/icons/info.svg";
import { NetworkId } from "../../constants";
import { DisplayBondDiscount, DisplayBondPrice } from "./BondV2";

export function BondDataCard({ bond, networkId }: { bond: IBondV2; networkId: NetworkId }) {
  const isBondLoading = useAppSelector(state => state.bondingV2.loading);

  return (
    <Slide direction="up" in={true} style={{ backgroundColor: "black" }}>
      <Paper id={`${bond.index}--bond`} className="bond-data-card rip-card">
        <div className="bond-pair">
          <TokenStack tokens={bond.bondIconSvg} />
          <div className="bond-name">
            <Typography style={{ color: "white" }}>{bond.displayName}</Typography>
            {bond && bond.isLP ? (
              <div>
                <Link href={bond.lpUrl} target="_blank">
                  <Typography variant="body1" style={{ color: "white" }}>
                    <Trans>Get LP</Trans>
                    {/* <SvgIcon component={Info} htmlColor="#A3A3A3" /> */}
                  </Typography>
                </Link>
              </div>
            ) : (
              <div>
                <Link href={getEtherscanUrl({ bond, networkId })} target="_blank">
                  <Typography variant="body1" style={{ color: "white" }}>
                    <Trans>View Asset</Trans>
                    {/* <SvgIcon component={Info} htmlColor="#A3A3A3" /> */}
                  </Typography>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="data-row">
          <Typography style={{ color: "white" }}>
            <Trans>Price</Trans>
          </Typography>
          <Typography className="bond-price" style={{ color: "white" }}>
            <>{isBondLoading ? <Skeleton width="50px" /> : <DisplayBondPrice key={bond.index} bond={bond} />}</>
          </Typography>
        </div>
        <div className="data-row">
          <Typography style={{ color: "white" }}>
            <Trans>Discount</Trans>
          </Typography>
          <Typography style={{ color: "white" }}>
            {isBondLoading ? <Skeleton width="50px" /> : <DisplayBondDiscount key={bond.index} bond={bond} />}
          </Typography>
        </div>
        <div className="data-row" style={{ color: "white" }}>
          <Typography>
            <Trans>Duration</Trans>
          </Typography>
          <Typography style={{ color: "white" }}>
            {isBondLoading ? <Skeleton width="50px" /> : bond.duration}
          </Typography>
        </div>

        {/* <div className="data-row">
          <Typography>
            <Trans>Purchased</Trans>
          </Typography>
          <Typography>
            {isBondLoading ? (
              <Skeleton width="80px" />
            ) : (
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(bond.purchased)
            )}
          </Typography>
        </div> */}
        <Link component={NavLink} to={`/bonds/${bond.index}`}>
          <TertiaryButton fullWidth disabled={bond.soldOut} style={{ color: "white" }}>
            {bond.soldOut ? t`Sold Out` : t`Bond ${bond.displayName}`}
          </TertiaryButton>
        </Link>
      </Paper>
    </Slide>
  );
}

export function BondTableData({ bond, networkId }: { bond: IBondV2; networkId: NetworkId }) {
  // Use BondPrice as indicator of loading.
  const isBondLoading = !bond.priceUSD ?? true;

  console.log(bond);
  return (
    <Grid item md={6} sm={6} style={{ marginTop: "40px" }}>
      <Grid container direction="row" spacing={3}>
        <Grid md={2} sm={2}></Grid>
        <Grid item md={8} sm={8}>
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            style={{ backgroundColor: "black" }}
            borderRadius="10px"
            // className={`${classes.infoHeader} oly-info-header-box`}
          >
            {bond && bond.isLP ? (
              <Typography
                variant="h6"
                style={{ fontWeight: "bold", color: "white", marginLeft: "10px", marginTop: "20px" }}
              >
                {bond.displayName}
                <Link color="primary" href={bond.lpUrl} target="_blank">
                  <SvgIcon component={Info} htmlColor="#A3A3A3" />
                </Link>
              </Typography>
            ) : (
              <Typography
                variant="h6"
                style={{ fontWeight: "bold", color: "white", marginLeft: "10px", marginTop: "20px" }}
              >
                {bond.displayName}
                <Link color="primary" href={bond.lpUrl} target="_blank">
                  <SvgIcon component={Info} htmlColor="#A3A3A3" />
                </Link>
              </Typography>
            )}
            <Typography
              variant="body2"
              style={{ color: "white", marginLeft: "10px", marginTop: "10px", fontSize: "0.7rem" }}
            >
              <>{isBondLoading ? <Skeleton width="50px" /> : <DisplayBondPrice key={bond.index} bond={bond} />}</>
            </Typography>
            <Typography
              variant="body2"
              style={{
                color: "white",
                marginLeft: "10px",
                marginTop: "7px",
                fontSize: "0.7rem",
                marginBottom: "10px",
              }}
            >
              {isBondLoading ? (
                <Skeleton width="50px" style={{ color: "red" }} />
              ) : (
                <DisplayBondDiscount key={bond.index} bond={bond} />
              )}
              <span style={{ marginLeft: "15px" }}>{isBondLoading ? <Skeleton /> : bond.duration}</span>
            </Typography>
            <Link component={NavLink} to={`/bonds/${bond.index}`} style={{ marginBottom: "10px" }}>
              <TertiaryButton fullWidth disabled={bond.soldOut}>
                {bond.soldOut ? t`Sold Out` : t`do_bond`}
              </TertiaryButton>
            </Link>
          </Box>
        </Grid>
        <Grid md={2} sm={2}></Grid>
      </Grid>
    </Grid>
    // <TableRow id={`${bond.index}--bond`}>
    //   <TableCell align="left" className="bond-name-cell">
    //     <TokenStack tokens={bond.bondIconSvg} />
    //     <div className="bond-name">
    //       {bond && bond.isLP ? (
    //         <>
    //           <Typography variant="body1">{bond.displayName}</Typography>
    //           <Link color="primary" href={bond.lpUrl} target="_blank">
    //             <Typography variant="body1">
    //               <Trans>Get LP</Trans>
    //               <SvgIcon component={Info} htmlColor="#A3A3A3" />
    //             </Typography>
    //           </Link>
    //         </>
    //       ) : (
    //         <>
    //           <Typography variant="body1">{bond.displayName}</Typography>
    //           <Link color="primary" href={getEtherscanUrl({ bond, networkId })} target="_blank">
    //             <Typography variant="body1">
    //               <Trans>View Asset</Trans>
    //               <SvgIcon component={Info} htmlColor="#A3A3A3" />
    //             </Typography>
    //           </Link>
    //         </>
    //       )}
    //       {/* <Typography>{bond.fixedTerm ? t`Fixed Term` : t`Fixed Expiration`}</Typography> */}
    //     </div>
    //   </TableCell>
    //   <TableCell align="left">
    //     <Typography>
    //       <>{isBondLoading ? <Skeleton width="50px" /> : <DisplayBondPrice key={bond.index} bond={bond} />}</>
    //     </Typography>
    //   </TableCell>
    //   <TableCell align="left">
    //     {isBondLoading ? <Skeleton width="50px" /> : <DisplayBondDiscount key={bond.index} bond={bond} />}
    //   </TableCell>
    //   <TableCell align="left">{isBondLoading ? <Skeleton /> : bond.duration}</TableCell>
    //   <TableCell>
    //     <Link component={NavLink} to={`/bonds/${bond.index}`}>
    //       <TertiaryButton fullWidth disabled={bond.soldOut}>
    //         {bond.soldOut ? t`Sold Out` : t`do_bond`}
    //       </TertiaryButton>
    //     </Link>
    //   </TableCell>
    // </TableRow>
  );
}
