import { useContext } from "react";
import { useWeb3Context } from "src/hooks";
import { usePriceCakeBusd } from "src/slices/farms/hooks";
import { FarmsContext, FarmsPageLayout } from "src/views/Farms";
import FarmCard from "src/views/Farms/components/FarmCard/FarmCard";
import { getDisplayApr } from "src/views/Farms/Farms";

const FarmsHistoryPage = () => {
  const { address: account } = useWeb3Context();
  const { chosenFarmsMemoized } = useContext(FarmsContext);
  const cakePrice = usePriceCakeBusd();

  return (
    <>
      {chosenFarmsMemoized.map(farm => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr) as string}
          cakePrice={cakePrice}
          account={account}
          removed
        />
      ))}
    </>
  );
};

FarmsHistoryPage.Layout = FarmsPageLayout;

export default FarmsHistoryPage;
