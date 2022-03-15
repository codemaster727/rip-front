import "./ChooseBond.scss";

import { t, Trans } from "@lingui/macro";
import { Box, Grid, Link, Paper, Slide, SvgIcon, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { TertiaryButton, TokenStack } from "@olympusdao/component-library";
import { NavLink } from "react-router-dom";
import { getEtherscanUrl } from "src/helpers";
import { useAppSelector } from "src/hooks";
import { IBondV2 } from "src/slices/BondSliceV2";

import { ReactComponent as Info } from "../../assets/icons/info.svg";
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
                  </Typography>
                </Link>
              </div>
            ) : (
              <div>
                <Link href={getEtherscanUrl({ bond, networkId })} target="_blank">
                  <Typography variant="body1" style={{ color: "white" }}>
                    <Trans>View Asset</Trans>
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
            <>{isBondLoading && !bond.priceUSD ? <Skeleton width="50px" /> : <DisplayBondPrice bond={bond} />}</>
          </Typography>
        </div>
        <div className="data-row">
          <Typography style={{ color: "white" }}>
            <Trans>Discount</Trans>
          </Typography>
          <Typography style={{ color: "white" }}>
            {isBondLoading && !bond.priceUSD ? <Skeleton width="50px" /> : <DisplayBondDiscount bond={bond} />}
          </Typography>
        </div>
        <div className="data-row" style={{ color: "white" }}>
          <Typography>
            <Trans>Duration</Trans>
          </Typography>
          <Typography style={{ color: "white" }}>
            {isBondLoading && !bond.priceUSD ? <Skeleton width="50px" /> : bond.duration}
          </Typography>
        </div>
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
          >
            {bond && bond.isLP ? (
              <Typography
                variant="h6"
                style={{ fontWeight: "bold", color: "white", marginLeft: "10px", marginTop: "20px" }}
              >
                {bond.displayName}
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
              <>{isBondLoading && !bond.priceUSD ? <Skeleton width="50px" /> : <DisplayBondPrice bond={bond} />}</>
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
              {isBondLoading && !bond.priceUSD ? (
                <Skeleton width="50px" style={{ color: "red" }} />
              ) : (
                <DisplayBondDiscount key={bond.index} bond={bond} />
              )}
              <span style={{ marginLeft: "15px" }}>
                {isBondLoading && !bond.priceUSD ? <Skeleton /> : bond.duration}
              </span>
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
  );
}
