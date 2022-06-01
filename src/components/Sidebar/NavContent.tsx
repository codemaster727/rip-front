/* eslint-disable */
import "./Sidebar.scss";

import { t, Trans } from "@lingui/macro";
import { Box, Divider, Link, Paper, SvgIcon, Typography } from "@material-ui/core";
import { NavItem } from "@olympusdao/component-library";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { NetworkId } from "src/constants";
import { useAppSelector } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { Bond } from "src/lib/Bond";
import { IBondDetails } from "src/slices/BondSlice";
import { getAllBonds, getUserNotes } from "src/slices/BondSliceV2";

import { ReactComponent as RIPProtocolIcon } from "../../assets/icons/RipIcon.svg";
import SpeedOmeterIcon from "../../assets/icons/speedometer.svg";
import GearIcon from "../../assets/icons/gear.svg";
import StakeIcon from "../../assets/icons/stake.svg";
import ConflictIcon from "../../assets/icons/conflict.svg";
import BlanketIcon from "../../assets/icons/blanket.svg";
import BridgeIcon from "../../assets/icons/bridge.svg";
import VotingIcon from "../../assets/icons/voting.svg";
import useBonds from "../../hooks/useBonds";
import WalletAddressEns from "../TopBar/Wallet/WalletAddressEns";
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

  const sortedBonds = bondsV2
    .filter(bond => bond.soldOut === false)
    .sort((a, b) => {
      return a.discount > b.discount ? -1 : b.discount > a.discount ? 1 : 0;
    });

  bonds.sort((a: CustomBond, b: CustomBond) => (b.bondDiscount as number) - (a.bondDiscount as number));

  return (
    <Paper className="blur7 dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://olympusdao.finance" target="_blank">
              <SvgIcon
                color="primary"
                component={RIPProtocolIcon}
                viewBox="0 0 350 100"
                style={{ minWidth: "280px", minHeight: "98px", width: "280px" }}
              />
            </Link>
            <WalletAddressEns />
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              {networkId === NetworkId.MAINNET ||
              networkId === NetworkId.TESTNET_RINKEBY ||
              networkId === NetworkId.BSC ||
              networkId === NetworkId.BSC_TEST ? (
                <>
                  <div
                    style={{ backgroundColor: "black", marginLeft: "20px", marginRight: "20px", borderRadius: "20px" }}
                  >
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
                  </div>
                  <br />
                  <br />
                  <br />
                  <div
                    style={{
                      backgroundColor: "black",
                      marginLeft: "20px",
                      marginRight: "20px",
                      marginTop: "20px",
                      borderRadius: "20px",
                    }}
                  >
                    <NavLink to="/swap" style={{ color: "white", textDecoration: "none" }}>
                      <Box paddingY={1} display="flex" justifyContent="space-between">
                        <img
                          src={"/assets/images/exchange.png"}
                          width="30px"
                          height="30px"
                          style={{ marginLeft: "25px" }}
                        />
                        <Typography
                          variant="h5"
                          align="right"
                          style={{ margin: "auto", marginRight: "20px" }}
                          className="cta-text"
                        >
                          Swap
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
                    <NavLink to="/liquidity" style={{ color: "white", textDecoration: "none" }}>
                      <Box paddingY="6px" display="flex" justifyContent="space-between">
                        <img
                          src={"/assets/images/liquidity1.png"}
                          width="35px"
                          height="35px"
                          style={{ marginLeft: "20px" }}
                        />
                        <Typography
                          variant="h5"
                          align="right"
                          style={{ margin: "auto", marginRight: "20px" }}
                          className="cta-text"
                        >
                          Liquidity
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
                    <NavLink to="/farms" style={{ color: "white", textDecoration: "none" }}>
                      <Box paddingY="6px" display="flex" justifyContent="space-between">
                        <img
                          src={"/assets/images/farm.png"}
                          width="35px"
                          height="35px"
                          style={{ marginLeft: "20px" }}
                        />
                        <Typography
                          variant="h5"
                          align="right"
                          style={{ margin: "auto", marginRight: "20px" }}
                          className="cta-text"
                        >
                          Farm
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
                      href="https://anyswap.exchange/#/bridge"
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
                      href="https://snapshot.org/#/rrip.eth"
                      target="_blank"
                      style={{ color: "white", textDecoration: "none" }}
                    >
                      <Box display="flex" justifyContent="space-between">
                        <img src={VotingIcon} style={{ marginLeft: "25px", width: "33px", height: "45px" }} />
                        <Typography
                          variant="h5"
                          align="right"
                          style={{ margin: "auto", marginRight: "20px" }}
                          className="cta-text"
                        >
                          Voting
                        </Typography>
                      </Box>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <NavItem to="/wrap" icon="wrap" label={t`Wrap`} />
                  <NavItem
                    href="https://synapseprotocol.com/?inputCurrency=gRIP&outputCurrency=gRIP&outputChain=43114"
                    icon="bridge"
                    label={t`Bridge`}
                  />
                </>
              )}
              {}
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
