// import { t } from "@lingui/macro";
import { SvgIcon, SwipeableDrawer, useTheme, withStyles } from "@material-ui/core";
import { useState } from "react";
import { ReactComponent as WalletIcon } from "src/assets/icons/ripwallet.svg";
import { useWeb3Context } from "src/hooks/web3Context";

import InitialWalletView from "./InitialWalletView";

const WalletButton = ({ openWallet }: { openWallet: () => void }) => {
  const { connect, connected } = useWeb3Context();
  const onClick = connected ? openWallet : connect;
  // const label = connected ? t`Wallet` : t`Connect Wallet`;
  const theme = useTheme();
  return (
    <SvgIcon
      component={WalletIcon}
      style={{ marginRight: theme.spacing(1), cursor: "pointer", width: "45px", height: "41px" }}
      onClick={onClick}
      viewBox="0 0 45 45"
    />
  );
};

const StyledSwipeableDrawer = withStyles(() => ({
  root: {
    width: "460px",
    maxWidth: "100%",
  },
  paper: {
    maxWidth: "100%",
  },
}))(SwipeableDrawer);

export function Wallet() {
  const [isWalletOpen, setWalletOpen] = useState(false);
  const closeWallet = () => setWalletOpen(false);
  const openWallet = () => setWalletOpen(true);

  // only enable backdrop transition on ios devices,
  // because we can assume IOS is hosted on hight-end devices and will not drop frames
  // also disable discovery on IOS, because of it's 'swipe to go back' feat
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <>
      <WalletButton openWallet={openWallet} />
      <StyledSwipeableDrawer
        disableBackdropTransition={!isIOS}
        disableDiscovery={isIOS}
        anchor="right"
        open={isWalletOpen}
        onOpen={openWallet}
        onClose={closeWallet}
      >
        <InitialWalletView onClose={closeWallet} />
      </StyledSwipeableDrawer>
    </>
  );
}

export default Wallet;
