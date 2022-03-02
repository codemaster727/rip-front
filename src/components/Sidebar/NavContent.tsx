/* eslint-disable */
import "./Sidebar.scss";

import { t, Trans } from "@lingui/macro";
import {
  // Accordion,
  // AccordionDetails,
  // AccordionSummary,
  Box,
  Divider,
  Link,
  Paper,
  SvgIcon,
  Typography,
} from "@material-ui/core";
// import { ExpandMore } from "@material-ui/icons";
import { NavItem } from "@olympusdao/component-library";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { NetworkId } from "src/constants";
// import { EnvHelper } from "src/helpers/Environment";
import { useAppSelector } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { Bond } from "src/lib/Bond";
import { IBondDetails } from "src/slices/BondSlice";
import { getAllBonds, getUserNotes } from "src/slices/BondSliceV2";
// import { DisplayBondDiscount } from "src/views/BondV2/BondV2";

import { ReactComponent as OlympusIcon } from "../../assets/icons/RipIcon.svg";
// import { ReactComponent as SpeedOmeterIcon } from "../../assets/icons/speedometer.svg";
import SpeedOmeterIcon from "../../assets/icons/speedometer.svg";
import GearIcon from "../../assets/icons/gear.svg";
import StakeIcon from "../../assets/icons/stake.svg";
import ConflictIcon from "../../assets/icons/conflict.svg";
import BlanketIcon from "../../assets/icons/blanket.svg";
import BridgeIcon from "../../assets/icons/bridge.svg";
import useBonds from "../../hooks/useBonds";
import WalletAddressEns from "../TopBar/Wallet/WalletAddressEns";
// import externalUrls from "./externalUrls";
import Social from "./Social";

type NavContentProps = {
  handleDrawerToggle?: () => void;
};

type CustomBond = Bond & Partial<IBondDetails>;

const NavContent: React.FC<NavContentProps> = ({ handleDrawerToggle }) => {
  const { networkId, address, provider } = useWeb3Context();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { bonds } = useBonds(networkId);
  const location = useLocation();
  const dispatch = useDispatch();

  const bondsV2 = useAppSelector(state => state.bondingV2.indexes.map(index => state.bondingV2.bonds[index]));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && handleDrawerToggle) {
      handleDrawerToggle();
    }
  }, [location]);

  useEffect(() => {
    const interval = setTimeout(() => {
      dispatch(getAllBonds({ address, networkID: networkId, provider }));
      dispatch(getUserNotes({ address, networkID: networkId, provider }));
    }, 60000);
    return () => clearTimeout(interval);
  });

  const sortedBonds = bondsV2
    .filter(bond => bond.soldOut === false)
    .sort((a, b) => {
      return a.discount > b.discount ? -1 : b.discount > a.discount ? 1 : 0;
    });

  bonds.sort((a: CustomBond, b: CustomBond) => b.bondDiscount! - a.bondDiscount!);

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://olympusdao.finance" target="_blank">
              <SvgIcon
                color="primary"
                component={OlympusIcon}
                viewBox="0 0 350 100"
                style={{ minWidth: "280px", minHeight: "98px", width: "280px" }}
              />
            </Link>
            <WalletAddressEns />
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              {networkId === NetworkId.MAINNET || networkId === NetworkId.TESTNET_RINKEBY || networkId === NetworkId.BSC || networkId === NetworkId.BSC_TEST ? (
                <>
                  <div
                    style={{ backgroundColor: "black", marginLeft: "20px", marginRight: "20px", borderRadius: "20px" }}
                  >
                    {/* <NavItem to="/dashboard" icon={"dashboard"} label={t`Dashboard`} style={{ color: "white" }} /> */}
                    <NavLink to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
                      <Box display="flex" justifyContent="space-between">
                        <img src={SpeedOmeterIcon} width="45px" height="45px" style={{ marginLeft: "20px" }} />
                        <Typography
                          variant="h5"
                          align="right"
                          style={{ margin: "auto", marginRight: "20px" }}
                          className="cta-text"
                        >
                          dashboard
                        </Typography>
                      </Box>
                    </NavLink>
                  </div>
                  <div
                    style={{
                      backgroundColor: "black",
                      marginLeft: "20px",
                      marginRight: "20px",
                      marginTop: "20px",
                      borderRadius: "20px",
                    }}
                  >
                    {/* <Link href="/dashboard" style={{ color: "white" }}>
                      <Box display="flex" justifyContent="space-between" >
                        <img src={SpeedOmeterIcon} width="45px" height="45px" style={{marginLeft: "20px"}} />
                        <Typography variant="h5" align="right" style={{margin: 'auto'}} className="cta-text">
                          dashboard
                        </Typography>
                      </Box>
                    </Link> */}
                    <NavLink to="/bonds" style={{ color: "white", textDecoration: "none" }}>
                      <Box display="flex" justifyContent="space-between">
                        <img src={GearIcon} width="45px" height="45px" style={{ marginLeft: "20px" }} />
                        <Typography
                          variant="h5"
                          align="right"
                          style={{ margin: "auto", marginRight: "20px" }}
                          className="cta-text"
                        >
                          Bond
                        </Typography>
                      </Box>
                    </NavLink>
                    {/* <NavItem to="/bonds" icon="bond" label={t`Bond`} style={{ color: "white" }} /> */}
                  </div>
                  {/* <div className="dapp-menu-data discounts">
                    <div className="bond-discounts">
                      <Accordion className="discounts-accordion" square defaultExpanded={true}>
                        <AccordionSummary
                          expandIcon={
                            <ExpandMore className="discounts-expand" style={{ width: "18px", height: "18px" }} />
                          }
                        >
                          <Typography variant="body2">
                            <Trans>Highest Discount</Trans>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {sortedBonds.map((bond, i) => {
                            return (
                              <Link
                                component={NavLink}
                                to={`/bonds/${bond.index}`}
                                key={i}
                                className={"bond"}
                                onClick={handleDrawerToggle}
                              >
                                <Typography variant="body2">
                                  {bond.displayName}
                                  <span className="bond-pair-roi">
                                    <DisplayBondDiscount key={bond.index} bond={bond} />
                                  </span>
                                </Typography>
                              </Link>
                            );
                          })}
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  </div> */}
                  <div
                    style={{
                      backgroundColor: "black",
                      marginLeft: "20px",
                      marginRight: "20px",
                      marginTop: "20px",
                      borderRadius: "20px",
                    }}
                  >
                    <NavLink to="/stake" style={{ color: "white", textDecoration: "none" }}>
                      <Box display="flex" justifyContent="space-between">
                        <img src={StakeIcon} width="45px" height="45px" style={{ marginLeft: "20px" }} />
                        <Typography
                          variant="h5"
                          align="right"
                          style={{ margin: "auto", marginRight: "20px" }}
                          className="cta-text"
                        >
                          Stake
                        </Typography>
                      </Box>
                    </NavLink>
                    {/* <NavItem to="/stake" icon="stake" label={t`Stake`} style={{ color: "white" }} /> */}
                  </div>
                  <br />
                  <br />
                  <br />
                  {/* NOTE (appleseed-olyzaps): OlyZaps disabled until v2 contracts */}
                  <div
                    style={{
                      backgroundColor: "black",
                      marginLeft: "20px",
                      marginRight: "20px",
                      marginTop: "20px",
                      borderRadius: "20px",
                    }}
                  >
                    <NavLink to="/zap" style={{ color: "white", textDecoration: "none" }}>
                      <Box display="flex" justifyContent="space-between">
                        <img src={ConflictIcon} width="45px" height="45px" style={{ marginLeft: "20px" }} />
                        <Typography
                          variant="h5"
                          align="right"
                          style={{ margin: "auto", marginRight: "20px" }}
                          className="cta-text"
                        >
                          Zap
                        </Typography>
                      </Box>
                    </NavLink>
                    {/* <NavItem to="/zap" icon="zap" label={t`Zap`} style={{ color: "white" }} /> */}
                  </div>
                  {/* {EnvHelper.isGiveEnabled(location.search) && (
                    <NavItem to="/give" icon="give" label={t`Give`} chip={t`New`} />
                  )} */}
                  <div
                    style={{
                      backgroundColor: "black",
                      marginLeft: "20px",
                      marginRight: "20px",
                      marginTop: "20px",
                      borderRadius: "20px",
                    }}
                  >
                    <NavLink to="/wrap" style={{ color: "white", textDecoration: "none" }}>
                      <Box display="flex" justifyContent="space-between">
                        <img src={BlanketIcon} width="45px" height="45px" style={{ marginLeft: "20px" }} />
                        <Typography
                          variant="h5"
                          align="right"
                          style={{ margin: "auto", marginRight: "20px" }}
                          className="cta-text"
                        >
                          Wrap
                        </Typography>
                      </Box>
                    </NavLink>
                    {/* <NavItem to="/wrap" icon="wrap" label={t`Wrap`} style={{ color: "white" }} /> */}
                  </div>
                  <div
                    style={{
                      backgroundColor: "black",
                      marginLeft: "20px",
                      marginRight: "20px",
                      marginTop: "20px",
                      borderRadius: "20px",
                    }}
                  >
                    <Link
                      href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=43114"
                      target="_blank"
                      style={{ color: "white", textDecoration: "none" }}
                    >
                      <Box display="flex" justifyContent="space-between">
                        <img src={BridgeIcon} width="45px" height="45px" style={{ marginLeft: "20px" }} />
                        <Typography
                          variant="h5"
                          align="right"
                          style={{ margin: "auto", marginRight: "20px" }}
                          className="cta-text"
                        >
                          Bridge
                        </Typography>
                      </Box>
                    </Link>
                    {/* <NavItem
                      href={"https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=43114"}
                      icon="bridge"
                      label={t`Bridge`}
                      style={{ color: "white" }}
                    /> */}
                  </div>
                  {/* <Box className="menu-divider">
                    <Divider />
                  </Box> */}
                  {/* <NavItem href="https://pro.olympusdao.finance/" icon="olympus" label={t`Olympus Pro`} /> */}
                  {/* <NavItem to="/33-together" icon="33-together" label={t`3,3 Together`} /> */}
                  {/* <Box className="menu-divider">
                    <Divider />
                  </Box> */}
                </>
              ) : (
                <>
                  <NavItem to="/wrap" icon="wrap" label={t`Wrap`} />
                  <NavItem
                    href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=43114"
                    icon="bridge"
                    label={t`Bridge`}
                  />
                </>
              )}
              {}
              {/* {Object.keys(externalUrls).map((link: any, i: number) => (
                <NavItem
                  key={i}
                  href={`${externalUrls[link].url}`}
                  icon={externalUrls[link].icon as any}
                  label={externalUrls[link].title as any}
                />
              ))} */}
            </div>
          </div>
        </div>
        <Box className="dapp-menu-social" display="flex" justifyContent="space-between" flexDirection="column">
          <Social />
        </Box>
      </Box>
    </Paper>
  );
};

export default NavContent;
