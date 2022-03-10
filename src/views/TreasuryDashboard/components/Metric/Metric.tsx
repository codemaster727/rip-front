import { t } from "@lingui/macro";
import { Metric } from "@olympusdao/component-library";
import { STAKING_CONTRACT_DECIMALS } from "src/constants/decimals";
import { formatCurrency, parseBigNumber } from "src/helpers";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useGripPrice, useRipPrice } from "src/hooks/usePrices";
import {
  useMarketCap,
  useRipCirculatingSupply,
  useTotalSupply,
  useTreasuryMarketValue,
} from "src/hooks/useProtocolMetrics";

type MetricProps = PropsOf<typeof Metric>;

const sharedProps: MetricProps = {
  labelVariant: "h6",
  metricVariant: "h5",
};

export const MarketCap = () => {
  const { data: marketCap } = useMarketCap();

  const props: MetricProps = {
    ...sharedProps,
    label: t`Market Cap`,
  };

  if (marketCap) props.metric = formatCurrency(marketCap, 0);
  else props.isLoading = true;

  return <Metric {...props} />;
};

export const RIPPrice = () => {
  const { data: ripPrice } = useRipPrice();
  console.log("realhere", ripPrice);
  const props: MetricProps = {
    ...sharedProps,
    label: t`RIP Price`,
  };

  if (ripPrice) props.metric = formatCurrency(ripPrice, 2);
  else props.isLoading = true;

  return <Metric {...props} />;
};

export const CircSupply = () => {
  const { data: totalSupply } = useTotalSupply();
  const { data: circSupply } = useRipCirculatingSupply();

  const props: MetricProps = {
    ...sharedProps,
    label: t`Circulating Supply (total)`,
  };

  if (circSupply && totalSupply) props.metric = `${circSupply.toFixed()} / ${totalSupply.toFixed()}`;
  else props.isLoading = true;

  return <Metric {...props} />;
};

export const BackingPerRIP = () => {
  const { data: circSupply } = useRipCirculatingSupply();
  const { data: treasuryValue } = useTreasuryMarketValue();

  const props: MetricProps = {
    ...sharedProps,
    label: t`Backing per RIP`,
  };

  if (treasuryValue && circSupply) props.metric = formatCurrency(treasuryValue / circSupply, 2);
  else props.isLoading = true;

  return <Metric {...props} />;
};

export const CurrentIndex = () => {
  const { data: currentIndex } = useCurrentIndex();

  const props: MetricProps = {
    ...sharedProps,
    label: t`Current Index`,
    tooltip: t`The current index tracks the amount of sRIP accumulated since the beginning of staking. Basically, how much sRIP one would have if they staked and held 1 RIP from launch.`,
  };

  if (currentIndex) props.metric = `${parseBigNumber(currentIndex, STAKING_CONTRACT_DECIMALS).toFixed(2)} sRIP`;
  else props.isLoading = true;

  return <Metric {...props} />;
};

export const GRIPPrice = () => {
  const { data: gRipPrice } = useGripPrice();

  const props: MetricProps = {
    ...sharedProps,
    label: t`gRIP Price`,
    className: "wsoprice",
    tooltip:
      t`gRIP = sRIP * index` +
      "\n\n" +
      t`The price of gRIP is equal to the price of RIP multiplied by the current index`,
  };

  if (gRipPrice) props.metric = formatCurrency(gRipPrice, 2);
  else props.isLoading = true;

  return <Metric {...props} />;
};
