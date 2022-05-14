import * as Sentry from "@sentry/react";
import { useEffect } from "react";

// import useActiveWeb3React from './useActiveWeb3React'
import { useWeb3Context } from "./web3Context";

function useSentryUser() {
  const { address: account } = useWeb3Context();
  useEffect(() => {
    if (account) {
      Sentry.setUser({ account });
    }
  }, [account]);
}

export default useSentryUser;
