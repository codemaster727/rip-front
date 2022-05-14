import { Button, Flex, InjectedModalProps, Text } from "@pancakeswap/uikit";
import orderBy from "lodash/orderBy";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
// import useActiveWeb3React from '../../../hooks/useActiveWeb3React'
import StyledModal from "src/components/StyledModal";
import { useWeb3Context } from "src/hooks";

import { useTranslation } from "../../../contexts/Localization";
import { AppDispatch } from "../../../Root";
import { clearAllTransactions } from "../../../slices/transactions/actions";
import { isTransactionRecent, useAllTransactions } from "../../../slices/transactions/hooks";
import { TransactionDetails } from "../../../slices/transactions/reducer";
import ConnectButton from "../../ConnectButton/ConnectButton";
import { AutoRow } from "../../Layout/Row";
import Transaction from "./Transaction";

function renderTransactions(transactions: TransactionDetails[]) {
  return (
    <Flex flexDirection="column">
      {transactions.map(tx => {
        return <Transaction key={tx.hash + tx.addedTime} tx={tx} />;
      })}
    </Flex>
  );
}

const TransactionsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const { account, networkId: chainId } = useWeb3Context();
  const dispatch = useDispatch<AppDispatch>();
  const allTransactions = useAllTransactions();

  const { t } = useTranslation();

  const sortedRecentTransactions = orderBy(
    Object.values(allTransactions).filter(isTransactionRecent),
    "addedTime",
    "desc",
  );

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt);
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt);

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }));
  }, [dispatch, chainId]);

  return (
    <StyledModal title={t("Recent Transactions")} onDismiss={onDismiss}>
      {account ? (
        !!pending.length || !!confirmed.length ? (
          <>
            <AutoRow mb="1rem" style={{ justifyContent: "space-between" }}>
              <Text color="white">{t("Recent Transactions")}</Text>
              <Button variant="tertiary" scale="xs" onClick={clearAllTransactionsCallback}>
                {t("clear all")}
              </Button>
            </AutoRow>
            {renderTransactions(pending)}
            {renderTransactions(confirmed)}
          </>
        ) : (
          <Text color="white">{t("No recent transactions")}</Text>
        )
      ) : (
        <ConnectButton />
      )}
    </StyledModal>
  );
};

export default TransactionsModal;
