import { useCallback } from "react";
import { useMasterchef } from "src/hooks/useContract";
import { stakeFarm } from "src/utils/calls";

const useStakeFarms = (pid: number) => {
  const masterChefContract = useMasterchef();

  const handleStake = useCallback(
    async (amount: string) => {
      return stakeFarm(masterChefContract, pid, amount);
    },
    [masterChefContract, pid],
  );

  return { onStake: handleStake };
};

export default useStakeFarms;
