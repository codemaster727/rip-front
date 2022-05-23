import { useCallback } from "react";
import { useMasterchef } from "src/hooks/useContract";
import { harvestFarm } from "src/utils/calls";

const useHarvestFarm = (farmPid: number) => {
  const masterChefContract = useMasterchef();

  const handleHarvest = useCallback(async () => {
    return harvestFarm(masterChefContract, farmPid);
  }, [farmPid, masterChefContract]);

  return { onReward: handleHarvest };
};

export default useHarvestFarm;
