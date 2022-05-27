import { useCallback } from "react";
import { useMasterchef } from "src/hooks/useContract";
import { unstakeFarm } from "src/utils/calls";

const useUnstakeFarms = (pid: number) => {
  const masterChefContract = useMasterchef();

  const handleUnstake = useCallback(
    async (amount: string) => {
      return unstakeFarm(masterChefContract, pid, amount);
    },
    [masterChefContract, pid],
  );

  return { onUnstake: handleUnstake };
};

export default useUnstakeFarms;
