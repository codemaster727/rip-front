import { Trans } from "@lingui/macro";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
  withStyles,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Icon, OHMTokenStackProps, TokenStack } from "@olympusdao/component-library";
import type { TokenName } from "@olympusdao/component-library/lib/components/Token/Token";
import { ReactElement, useState } from "react";
import { ReactComponent as ArrowUpIcon } from "src/assets/icons/arrow-up.svg";
import RipIcon from "src/assets/icons/RipIcon.svg";
// import { CurrencyLogo } from "src/components/Logo";
import { addresses } from "src/constants";
import { formatCurrency } from "src/helpers";
import { dai, frax } from "src/helpers/AllBonds";
import { useAppSelector, useWeb3Context } from "src/hooks";
import { useCurrency } from "src/hooks/Tokens";
import useCurrentTheme from "src/hooks/useTheme";

import { Tokens, useWallet } from "./Token";
import WalletAddressEns from "./WalletAddressEns";

type RIPTokenPropsName = TokenName | "wsRIP";

const Borrow = ({
  Icon1,
  borrowableTokensIcons,
  borrowOn,
  href,
}: {
  Icon1: RIPTokenPropsName;
  borrowableTokensIcons: OHMTokenStackProps["tokens"];
  borrowOn: string;
  href: string;
}) => {
  const theme = useTheme();
  const Icon1_currency = useCurrency(Icon1);
  return (
    <ExternalLink href={href}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "flex-start" }}>
          {/* <Token name={Icon1} style={{ fontSize: 26 }} /> */}
          {/* <CurrencyLogo currency={Icon1_currency} size="48" style={{ marginRight: "8px", width: "48px" }} /> */}
          <img src={RipIcon} width="48px" />
          <Icon
            name="arrow-down"
            style={{ fontSize: 15, transform: "rotate(270deg)", marginLeft: 5, marginRight: 5 }}
          />
          <TokenStack style={{ fontSize: 26 }} tokens={borrowableTokensIcons} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", marginTop: theme.spacing(1) }}>
          <Box sx={{ display: "flex", flexDirection: "column", textAlign: "right", marginRight: theme.spacing(0.5) }}>
            <Typography align="left" style={{ maxWidth: "90px", whiteSpace: "break-spaces" }}>
              Borrow on {borrowOn}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ExternalLink>
  );
};

const ExternalLink = ({ href, children, color }: { href: string; children: ReactElement; color?: any }) => {
  const theme = useTheme();
  return (
    <Button
      href={href}
      color={color}
      variant="outlined"
      size="large"
      style={{ padding: theme.spacing(1.5), maxHeight: "unset", height: "auto" }}
      fullWidth
      target={`_blank`}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box sx={{ width: "100%" }}>{children}</Box>
        <Box sx={{ display: "flex", alignSelf: "start" }}>
          <SvgIcon
            component={ArrowUpIcon}
            htmlColor={color === "textSecondary" ? theme.palette.text.secondary : ""}
            style={{
              position: "absolute",
              right: -2,
              top: -2,
              height: `18px`,
              width: `18px`,
              verticalAlign: "middle",
            }}
          />
        </Box>
      </Box>
    </Button>
  );
};

const DisconnectButton = () => {
  const { disconnect } = useWeb3Context();
  return (
    <Button onClick={disconnect} variant="contained" size="large" color="secondary">
      <Trans>Disconnect</Trans>
    </Button>
  );
};

const CloseButton = withStyles(theme => ({
  root: {
    ...theme.overrides?.MuiButton?.containedSecondary,
    width: "30px",
    height: "30px",
  },
}))(IconButton);

const WalletTotalValue = () => {
  const { address: userAddress, networkId, providerInitialized } = useWeb3Context();
  const tokens = useWallet(userAddress, networkId, providerInitialized);
  const isLoading = useAppSelector(s => s.account.loading || s.app.loadingMarketPrice || s.app.loading);
  const marketPrice = useAppSelector(s => s.app.marketPrice || 0);
  const [currency, setCurrency] = useState<"USD" | "RIP">("USD");

  const walletTotalValueUSD = Object.values(tokens).reduce(
    (totalValue, token) => totalValue + parseFloat(token.totalBalance) * token.price,
    0,
  );
  const walletValue = {
    USD: walletTotalValueUSD,
    RIP: walletTotalValueUSD / marketPrice,
  };
  return (
    <Box onClick={() => setCurrency(currency === "USD" ? "RIP" : "USD")}>
      <Typography style={{ lineHeight: 1.1, fontWeight: 600, fontSize: "0.975rem" }} color="textSecondary">
        MY WALLET
      </Typography>
      <Typography style={{ fontWeight: 700, cursor: "pointer" }} variant="h3">
        {!isLoading ? formatCurrency(walletValue[currency], 2, currency) : <Skeleton variant="text" width={100} />}
      </Typography>
      <WalletAddressEns />
    </Box>
  );
};

function InitialWalletView({ onClose }: { onClose: () => void }) {
  const theme = useTheme();
  const [currentTheme] = useCurrentTheme();
  const { networkId } = useWeb3Context();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  return (
    <Paper style={{ backdropFilter: "blur(7px)" }}>
      <Box sx={{ padding: theme.spacing(0, 3), display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", padding: theme.spacing(3, 0) }}>
          <WalletTotalValue />
          <CloseButton size="small" onClick={onClose} aria-label="close wallet">
            <Icon name="x" />
          </CloseButton>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }} style={{ gap: theme.spacing(1) }}>
          <Tokens />
        </Box>

        <Box sx={{ margin: theme.spacing(2, -3) }}>
          <Divider color="secondary" />
        </Box>

        <Box
          sx={{
            ...(isSmallScreen
              ? { display: "flex", flexDirection: "column" }
              : { display: "grid", gridTemplateRows: "min-content", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }),
          }}
          style={{ gap: theme.spacing(1.5) }}
        >
          <ExternalLink
            color={currentTheme === "dark" ? "primary" : undefined}
            href={`https://app.sushi.com/swap?inputCurrency=${dai.getAddressForReserve(networkId)}&outputCurrency=${
              addresses[networkId].RIP_V2
            }`}
          >
            <Typography>Get on Sushiswap</Typography>
          </ExternalLink>
          <ExternalLink
            color={currentTheme === "dark" ? "primary" : undefined}
            href={`https://app.uniswap.org/#/swap?inputCurrency=${frax.getAddressForReserve(
              networkId,
            )}&outputCurrency=${addresses[networkId].RIP_V2}`}
          >
            <Typography>Get on Uniswap</Typography>
          </ExternalLink>
          <Borrow
            href={`https://app.cream.finance/`}
            borrowOn="Cream finance"
            borrowableTokensIcons={["wETH", "DAI"]}
            Icon1="wsRIP"
          />
          <Box sx={{ display: "flex", flexDirection: "column" }} style={{ gap: theme.spacing(1.5) }}>
            <ExternalLink href={`https://dune.xyz/fluidsonic/RIPProtocol-DAO`}>
              <Typography>Fluidsonic's dashboard</Typography>
            </ExternalLink>
            <ExternalLink href={`https://dune.xyz/0xrusowsky/RIPProtocol-Wallet-History`}>
              <Typography>Rusowsky's dashboard</Typography>
            </ExternalLink>
            <ExternalLink href={`https://dune.xyz/shadow/RIPProtocol-(RIP)`}>
              <Typography>Shadow's dashboard</Typography>
            </ExternalLink>
          </Box>
        </Box>

        <Box sx={{ marginTop: "auto", marginX: "auto", padding: theme.spacing(2) }}>
          <DisconnectButton />
        </Box>
      </Box>
    </Paper>
  );
}

export default InitialWalletView;
