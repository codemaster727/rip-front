import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers";
import { useCallback, useState } from "react";
import { ToastDescriptionWithTx } from "src/components/Toast";
import { useTranslation } from "src/contexts/Localization";
import useToast from "src/hooks/useToast";
import { isUserRejected, logError } from "src/utils/sentry";

import { useWeb3Context } from "./web3Context";

export type TxResponse = TransactionResponse | null;

export type CatchTxErrorReturn = {
  fetchWithCatchTxError: (fn: () => Promise<TxResponse>) => Promise<TransactionReceipt | null | undefined>;
  loading: boolean;
};

type ErrorData = {
  code: number;
  message: string;
};

type TxError = {
  data: ErrorData;
  error: string;
};

// -32000 is insufficient funds for gas * price + value
const isGasEstimationError = (err: TxError): boolean => err?.data?.code === -32000;

export default function useCatchTxError(): CatchTxErrorReturn {
  const { provider: library } = useWeb3Context();
  const { t } = useTranslation();
  const { toastError, toastSuccess } = useToast();
  const [loading, setLoading] = useState(false);

  const handleNormalError = useCallback(
    (error, tx?: TxResponse) => {
      logError(error);

      if (tx) {
        toastError(
          t("Error"),
          <ToastDescriptionWithTx txHash={tx.hash}>
            {t("Please try again. Confirm the transaction and make sure you are paying enough gas!")}
          </ToastDescriptionWithTx>,
        );
      } else {
        toastError(t("Error"), t("Please try again. Confirm the transaction and make sure you are paying enough gas!"));
      }
    },
    [t, toastError],
  );

  const fetchWithCatchTxError = useCallback(
    async (callTx: () => Promise<TxResponse>): Promise<TransactionReceipt | null | undefined> => {
      let tx: TxResponse = null;

      try {
        setLoading(true);

        /**
         * https://github.com/vercel/swr/pull/1450
         *
         * wait for useSWRMutation finished, so we could apply SWR in case manually trigger tx call
         */
        tx = await callTx();

        toastSuccess(`${t("Transaction Submitted")}!`, <ToastDescriptionWithTx txHash={tx?.hash} />);

        const receipt = await tx?.wait();

        return receipt;
      } catch (error: any) {
        if (!isUserRejected(error)) {
          if (!tx) {
            handleNormalError(error);
          } else {
            library
              //@ts-ignore
              .call(tx, tx.blockNumber)
              .then(() => {
                handleNormalError(error, tx);
              })
              .catch((err: any) => {
                if (isGasEstimationError(err)) {
                  handleNormalError(error, tx);
                } else {
                  logError(err);

                  let recursiveErr = err;

                  let reason: string | undefined;

                  // for MetaMask
                  if (recursiveErr?.data?.message) {
                    reason = recursiveErr?.data?.message;
                  } else {
                    // for other wallets
                    // Reference
                    // https://github.com/Uniswap/interface/blob/ac962fb00d457bc2c4f59432d7d6d7741443dfea/src/hooks/useSwapCallback.tsx#L216-L222
                    while (recursiveErr) {
                      reason = recursiveErr.reason ?? recursiveErr.message ?? reason;
                      recursiveErr = recursiveErr.error ?? recursiveErr.data?.originalError;
                    }
                  }

                  const REVERT_STR = "execution reverted: ";
                  const indexInfo = reason?.indexOf(REVERT_STR);
                  const isRevertedError = (indexInfo as number) >= 0;

                  if (isRevertedError) reason = reason?.substring((indexInfo as number) + REVERT_STR.length);

                  toastError(
                    "Failed",
                    <ToastDescriptionWithTx txHash={tx?.hash}>
                      {isRevertedError
                        ? `Transaction failed with error: ${reason}`
                        : "Transaction failed. For detailed error message:"}
                    </ToastDescriptionWithTx>,
                  );
                }
              });
          }
        }
      } finally {
        setLoading(false);
      }

      return null;
    },
    [handleNormalError, toastError, library, toastSuccess, t],
  );

  return {
    fetchWithCatchTxError,
    loading,
  };
}
