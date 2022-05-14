import "./Zap.scss";

import { Trans } from "@lingui/macro";
import { Box, Button, Grid, Paper, SvgIcon, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Token, TokenStack } from "@olympusdao/component-library";
import React from "react";

import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { trackGAEvent, trackSegmentEvent } from "../../helpers/analytics";

const useStyles = makeStyles(theme => ({
  infoBox: {
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "row",
    },
    [theme.breakpoints.up("md")]: {
      display: "flex",
      flexDirection: "column",
    },
  },
  infoBoxItem: {
    [theme.breakpoints.down("md")]: {
      padding: "8px !important",
    },
    [theme.breakpoints.up("md")]: {
      padding: "16px !important",
    },
  },
  infoHeader: {
    [theme.breakpoints.down("md")]: {
      width: "40%",
      padding: "12px 0px",
    },
    [theme.breakpoints.up("md")]: {
      width: "100%",
      paddingBottom: "1.5rem",
    },
  },
  infoBody: {
    [theme.breakpoints.down("md")]: {
      width: "60%",
      paddingTop: "12px",
      paddingInline: "6px",
    },
    [theme.breakpoints.up("md")]: {
      width: "100%",
      paddingTop: 0,
    },
  },
}));

type ZapInfoProps = {
  tokens?: Array<string>;
  address: string;
};

const ZapInfo: React.FC<ZapInfoProps> = ({ address }) => {
  const isSmallScreen = useMediaQuery("(max-width: 960px)");
  const classes = useStyles();

  const trackClick = (address: string) => {
    const uaData = {
      address,
      type: "Learn more OlyZaps",
    };
    trackSegmentEvent(uaData);
    trackGAEvent({
      category: "OlyZaps",
      action: uaData.type,
    });
  };

  return (
    <Paper className="blur7 rip-card" id="olyzaps-info">
      <Typography variant="h5" style={{ color: "black" }} align="center">
        <Trans>Zap</Trans>
      </Typography>
      <Grid container direction="row" spacing={3} style={{ marginTop: "20px" }}>
        <Grid
          item
          sm={12}
          md={3}
          classes={{ root: classes.infoBox, item: classes.infoBoxItem }}
          style={
            !isSmallScreen
              ? {
                  backgroundColor: "black",
                  marginLeft: "1rem",
                  borderRadius: "15px",
                }
              : { backgroundColor: "black", marginLeft: "0rem", borderRadius: "15px" }
          }
        >
          <Box
            alignItems="left"
            display="flex"
            flexDirection="column"
            justifyContent="left"
            className={`${classes.infoHeader} oly-info-header-box`}
          >
            <Box>
              <TokenStack tokens={["DAI", "wETH"]} style={{ marginBottom: "16px" }} />
            </Box>
            <Typography variant="h4" style={{ color: "white" }} align="left">
              <Trans>You Give</Trans>
            </Typography>
          </Box>
          <Box className={classes.infoBody}>
            <Typography variant="body1" style={{ color: "white" }} className="oly-info-body-header">
              <Trans>Zap is a swap</Trans>
            </Typography>
            <Typography align="left" style={{ color: "white" }} variant="body2" className="oly-info-body">
              <Trans>
                A zap swap is a series of smart contracts that deploys one asset to another protocol to handle a trusted
                transaction.
              </Trans>
            </Typography>
          </Box>
        </Grid>
        <Grid item md={1}></Grid>
        <Grid
          item
          sm={12}
          md={3}
          classes={{ root: classes.infoBox, item: classes.infoBoxItem }}
          style={
            !isSmallScreen
              ? {
                  backgroundColor: "black",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                  borderRadius: "15px",
                }
              : { backgroundColor: "black", marginLeft: "0rem", borderRadius: "15px" }
          }
        >
          <Box
            alignItems="left"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            className={`${classes.infoHeader} oly-info-header-box`}
          >
            {/* @ts-ignore - (keith) add style prop & types to Token Component */}
            <Token name="zap" style={{ marginBottom: "16px" }} />
            <Typography variant="h4" style={{ color: "white" }} align="left">
              <Trans>All-in-one zap contracts</Trans>
            </Typography>
          </Box>
          <Box className={classes.infoBody}>
            <Typography variant="body1" style={{ color: "white" }} className="oly-info-body-header">
              <Trans>All-in-one easy staking</Trans>
            </Typography>
            <Typography align="left" style={{ color: "white" }} variant="body2" className="oly-info-body">
              <Trans>OlyZap reduces complexity, saves you time and keeps you here on RIPProtocol.</Trans>
            </Typography>
          </Box>
        </Grid>
        <Grid item md={1}></Grid>
        <Grid
          item
          sm={12}
          md={3}
          classes={{ root: classes.infoBox, item: classes.infoBoxItem }}
          style={{ backgroundColor: "black", borderRadius: "15px" }}
        >
          <Box
            alignItems="left"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            className={`${classes.infoHeader} oly-info-header-box`}
          >
            {/* @ts-ignore - (keith) add style prop & types to Token Component */}
            <TokenStack tokens={["sOHM", "wsOHM"]} style={{ marginBottom: "16px" }} />
            <Typography color="textSecondary" align="left" style={{ color: "white" }} variant="h4">
              <Trans>You Choose</Trans>
            </Typography>
          </Box>
          <Box className={classes.infoBody}>
            <Typography variant="body1" className="oly-info-body-header" style={{ color: "white" }}>
              <Trans>Staking</Trans>
            </Typography>
            <Typography align="left" variant="body2" className="oly-info-body" style={{ color: "white" }}>
              <Trans>
                Staking is the primary value accrual strategy of RIPProtocol. When you stake, you lock RIP and receive
                an equal value of sRIP or gRIP.
              </Trans>
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Box className="button-box">
        <Button
          variant="outlined"
          color="secondary"
          href="https://docs.olympusdao.finance/main/using-the-website/olyzaps"
          target="_blank"
          className="learn-more-button"
          onClick={() => {
            trackClick(address);
          }}
        >
          <Typography variant="body1">Learn More</Typography>
          <SvgIcon component={ArrowUp} color="primary" />
        </Button>
      </Box>
    </Paper>
  );
};

export default ZapInfo;
