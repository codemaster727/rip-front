import "./TreasuryDashboard.scss";

import { Grid, useMediaQuery, Zoom } from "@material-ui/core";
import { Paper } from "@olympusdao/component-library";
import { memo } from "react";

import {
  MarketValueGraph,
  ProtocolOwnedLiquidityGraph,
  RIPStakedGraph,
  RiskFreeValueGraph,
  RunwayAvailableGraph,
  TotalValueDepositedGraph,
} from "./components/Graph/Graph";
import { BackingPerRIP, CircSupply, CurrentIndex, GRIPPrice, MarketCap, RIPPrice } from "./components/Metric/Metric";
const TreasuryDashboard = memo(() => {
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");

  return (
    <div id="treasury-dashboard-view" className={`${isSmallScreen && "smaller"} ${isVerySmallScreen && "very-small"}`}>
      <div
        style={{
          paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "1rem",
          paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "1rem",
        }}
      >
        <Paper className="blur7 rip-card">
          <Zoom in={true}>
            <Grid container className="data-grid" style={{ marginTop: "50px" }}>
              <Grid item lg={2} md={2} sm={12} xs={12} justify="flex-end">
                <MarketCap />
                <RIPPrice />
                <GRIPPrice />
                <CircSupply />
                <BackingPerRIP />
                <CurrentIndex />
              </Grid>
              <Grid item lg={10} md={10} sm={12} xs={12}>
                <Grid container spacing={2} className="data-grid">
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Paper className="blur7 rip-card rip-chart-card" style={{ background: "black" }}>
                      <TotalValueDepositedGraph />
                    </Paper>
                  </Grid>

                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Paper className="blur7 rip-card rip-chart-card" style={{ background: "black" }}>
                      <MarketValueGraph />
                    </Paper>
                  </Grid>

                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Paper className="blur7 rip-card rip-chart-card" style={{ background: "black" }}>
                      <RiskFreeValueGraph />
                    </Paper>
                  </Grid>

                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Paper className="blur7 rip-card rip-chart-card" style={{ background: "black" }}>
                      <ProtocolOwnedLiquidityGraph />
                    </Paper>
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Paper className="blur7 rip-card rip-chart-card" style={{ background: "black" }}>
                      <RIPStakedGraph />
                    </Paper>
                  </Grid>

                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Paper className="blur7 rip-card rip-chart-card" style={{ background: "black" }}>
                      <RunwayAvailableGraph />
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Zoom>
        </Paper>
      </div>
    </div>
  );
});

export default TreasuryDashboard;
