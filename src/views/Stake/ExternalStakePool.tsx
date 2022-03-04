import { t, Trans } from "@lingui/macro";
import { Box, Grid, makeStyles, Typography, useTheme, Zoom } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Skeleton } from "@material-ui/lab";
import { Paper, SecondaryButton, TokenStack } from "@olympusdao/component-library";
// import { DataRow, Paper, SecondaryButton, TokenStack } from "@olympusdao/component-library";
import { useQuery } from "react-query";
import allPools, { fetchPoolData } from "src/helpers/AllExternalPools";
import { useGripPrice } from "src/hooks/usePrices";
import { useWeb3Context } from "src/hooks/web3Context";
import { ExternalPoolwBalance } from "src/lib/ExternalPool";

export const useExternalPools = (address: string) => {
  const { data: gRipPrice } = useGripPrice();
  const { isLoading, data } = useQuery(["externalPools", address], () => fetchPoolData(address, Number(gRipPrice)), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    placeholderData: allPools,
    enabled: !!gRipPrice,
  });
  return { isLoading, pools: data };
};

const useStyles = makeStyles(theme => ({
  stakePoolsWrapper: {
    display: "grid",
    gridTemplateColumns: `1.0fr 0.5fr 0.5fr 1.5fr auto`,
    gridTemplateRows: "auto",
    alignItems: "center",
  },
  stakePoolHeaderText: {
    color: theme.palette.text.secondary,
    lineHeight: 1.4,
  },
  poolPair: {
    display: "flex !important",
    alignItems: "center",
    justifyContent: "left",
    marginBottom: "15px",
  },
  poolName: {
    marginLeft: "10px",
  },
}));

const MobileStakePool = ({ pool, isLoading }: { pool: ExternalPoolwBalance; isLoading: boolean }) => {
  const styles = useStyles();
  const { connected } = useWeb3Context();
  return (
    <Paper style={{ background: "black" }}>
      <div className={styles.poolPair}>
        <TokenStack tokens={pool.icons} />
        <div style={{ color: "white" }} className={styles.poolName}>
          <Typography>{pool.poolName}</Typography>
        </div>
      </div>
      {!pool.tvl ? (
        <div>
          <Typography style={{ color: "white", marginTop: "10px" }}>{t`TVL`}</Typography>
          <Typography style={{ color: "white", marginTop: "10px" }}>Loading...</Typography>
        </div>
      ) : (
        <div>
          <Typography style={{ color: "white", marginTop: "10px" }}>{t`TVL`}</Typography>
          <Typography style={{ color: "white", marginTop: "10px" }}>{pool.tvl}</Typography>
        </div>
      )}
      {connected && !pool.userBalance ? (
        <div>
          <Typography style={{ color: "white", marginTop: "10px" }}>{t`Balance`}</Typography>
          <Typography style={{ color: "white", marginTop: "10px" }}>Loading...</Typography>
        </div>
      ) : (
        <div>
          <Typography style={{ color: "white", marginTop: "10px" }}>{t`Balance`}</Typography>
          <Typography style={{ color: "white", marginTop: "10px" }}>{`${pool.userBalance} LP`}</Typography>
        </div>
        // <DataRow title={t`Balance`} balance={`${pool.userBalance} LP`} isLoading={pool.userBalance ? false : true} />
      )}
      {/* Pool Staking Linkouts */}
      <SecondaryButton href={pool.href} fullWidth style={{ background: "#333", color: "white" }}>
        {`${t`Stake on`} ${pool.stakeOn}`}
      </SecondaryButton>
    </Paper>
  );
};

const StakePool = ({ pool, isLoading }: { pool: ExternalPoolwBalance; isLoading: boolean }) => {
  const theme = useTheme();
  const styles = useStyles();
  const { connected } = useWeb3Context();
  return (
    <Grid md={3} sm={3}>
      <div style={{ background: "black", margin: "10px", borderRadius: "10px" }}>
        <TokenStack style={{ textAlign: "center", marginTop: "20px", marginLeft: "10px" }} tokens={pool.icons} />
        <Typography style={{ color: "white", paddingTop: "20px", marginLeft: "10px" }} align="left">
          {pool.poolName}
        </Typography>
        <Typography style={{ color: "white", marginTop: "30px", marginLeft: "15px" }} align="left">
          <Trans>TVL</Trans>
        </Typography>
        <Typography style={{ color: "white", marginTop: "5px", marginLeft: "15px" }} align="left">
          <Trans>
            {!pool.userBalance && connected ? (
              <Skeleton width={30} />
            ) : connected && pool.userBalance ? (
              `${pool.userBalance} LP`
            ) : (
              ""
            )}
          </Trans>
        </Typography>
        <SecondaryButton
          target="_blank"
          href={pool.href}
          fullWidth
          style={{ backgroundColor: "transparent", color: "#11ffbd" }}
        >
          {t`Stake`}
        </SecondaryButton>
      </div>
    </Grid>
    // <Box style={{ gap: theme.spacing(1.5) }} className={styles.stakePoolsWrapper}>
    //   <Box sx={{ display: "flex", alignItems: "center" }}>
    //     <TokenStack tokens={pool.icons} />
    //     <Typography gutterBottom={false} style={{ lineHeight: 1.4, marginLeft: "10px" }}>
    //       {pool.poolName}
    //     </Typography>
    //   </Box>
    //   <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
    //     {!pool.tvl ? <Skeleton width={30} /> : pool.tvl}
    //   </Typography>
    //   <Typography gutterBottom={false} style={{ lineHeight: 1.4 }}>
    //     {!pool.userBalance && connected ? (
    //       <Skeleton width={30} />
    //     ) : connected && pool.userBalance ? (
    //       `${pool.userBalance} LP`
    //     ) : (
    //       ""
    //     )}
    //   </Typography>
    //   <Box sx={{ display: "flex", flexBasis: "100px", flexGrow: 1, maxWidth: "500px" }}>
    //     <SecondaryButton target="_blank" href={pool.href} fullWidth>
    //       {`${t`Stake on`} ${pool.stakeOn}`}
    //     </SecondaryButton>
    //   </Box>
    // </Box>
  );
};

export default function ExternalStakePool() {
  const { address, connected } = useWeb3Context();
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  // const isMobileScreen = useMediaQuery("(max-width: 513px)");
  const theme = useTheme();
  const styles = useStyles();
  const allStakePools = useExternalPools(address);
  // const stakePoolArray = [

  // ]
  console.log(allStakePools.pools);
  return (
    <Zoom in={true}>
      {isSmallScreen ? (
        <>
          {allStakePools?.pools?.map(pool => (
            <MobileStakePool key={pool.address} pool={pool} isLoading={allStakePools?.isLoading} />
          ))}
        </>
      ) : (
        <Paper headerText={t`Farm Pool`}>
          {/* <Box className={styles.stakePoolsWrapper} style={{ gap: theme.spacing(1.5), marginBottom: "0.5rem" }}>
            <Typography gutterBottom={false} className={styles.stakePoolHeaderText} style={{ marginLeft: "75px" }}>
              <Trans>Asset</Trans>
            </Typography>
            <Typography gutterBottom={false} className={styles.stakePoolHeaderText} style={{ paddingLeft: "3px" }}>
              <Trans>TVL</Trans>   
            </Typography>
            <Typography gutterBottom={false} className={styles.stakePoolHeaderText}>
              {connected && t`Balance`}
            </Typography>
          </Box> */}
          <Box sx={{ display: "flex", flexDirection: "column" }} style={{ gap: theme.spacing(4), padding: "16px 0px" }}>
            <Grid container direction="row" spacing={3}>
              {allStakePools?.pools?.map(pool => (
                <StakePool key={pool.address} pool={pool} isLoading={allStakePools?.isLoading} />
              ))}
            </Grid>
          </Box>
        </Paper>
      )}
    </Zoom>
  );
}
