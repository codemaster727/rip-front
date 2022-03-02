import "./TreasuryDashboard.scss";

import { Grid, useMediaQuery, Zoom } from "@material-ui/core";
// import { Box, Container, Grid, useMediaQuery, Zoom } from "@material-ui/core";
import { Paper } from "@olympusdao/component-library";
// import { MetricCollection, Paper } from "@olympusdao/component-library";
import { memo } from "react";

import {
  MarketValueGraph,
  OHMStakedGraph,
  ProtocolOwnedLiquidityGraph,
  RiskFreeValueGraph,
  RunwayAvailableGraph,
  TotalValueDepositedGraph,
} from "./components/Graph/Graph";
import { BackingPerOHM, CircSupply, CurrentIndex, GOHMPrice, MarketCap, OHMPrice } from "./components/Metric/Metric";
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
        {/* <Box className="hero-metrics">
          <Paper className="ohm-card">
            <MetricCollection>
              <MarketCap />
              <OHMPrice />
              <GOHMPrice />
              <CircSupply />
              <BackingPerOHM />
              <CurrentIndex />
            </MetricCollection>
          </Paper>
        </Box> */}
        <Paper className="ohm-card">
          <Zoom in={true}>
            <Grid container className="data-grid" style={{ marginTop: "50px" }}>
              <Grid item lg={2} md={2} sm={12} xs={12} justify="flex-end">
                <MarketCap />
                <OHMPrice />
                <GOHMPrice />
                <CircSupply />
                <BackingPerOHM />
                <CurrentIndex />
              </Grid>
              <Grid item lg={10} md={10} sm={12} xs={12}>
                <Grid container spacing={2} className="data-grid">
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Paper className="ohm-card ohm-chart-card" style={{ background: "black" }}>
                      <TotalValueDepositedGraph />
                    </Paper>
                  </Grid>

                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Paper className="ohm-card ohm-chart-card" style={{ background: "black" }}>
                      <MarketValueGraph />
                    </Paper>
                  </Grid>

                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Paper className="ohm-card ohm-chart-card" style={{ background: "black" }}>
                      <RiskFreeValueGraph />
                    </Paper>
                  </Grid>

                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Paper className="ohm-card ohm-chart-card" style={{ background: "black" }}>
                      <ProtocolOwnedLiquidityGraph />
                    </Paper>
                  </Grid>

                  {/*  Temporarily removed until correct data is in the graph */}
                  {/* <Grid item lg={6} md={12} sm={12} xs={12}>
                    <Paper className="ohm-card">
                      <Chart
                        type="bar"
                        data={data}
                        dataKey={["holders"]}
                        headerText="Holders"
                        stroke={[theme.palette.text.secondary]}
                        headerSubText={`${data.length > 0 && data[0].holders}`}
                        bulletpointColors={bulletpoints.holder}
                        itemNames={tooltipItems.holder}
                        itemType={undefined}
                        infoTooltipMessage={tooltipInfoMessages().holder}
                        expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                        scale={undefined}
                        color={undefined}
                        stroke={undefined}
                        dataFormat={undefined}
                        isPOL={undefined}
                        isStaked={undefined}
                      />
                    </Paper>
                  </Grid> */}

                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Paper className="ohm-card ohm-chart-card" style={{ background: "black" }}>
                      <OHMStakedGraph />
                    </Paper>
                  </Grid>

                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Paper className="ohm-card ohm-chart-card" style={{ background: "black" }}>
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
