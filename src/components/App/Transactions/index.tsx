import { Button, HistoryIcon, useModal } from "@pancakeswap/uikit";

import TransactionsModal from "./TransactionsModal";

const Transactions = () => {
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />);
  return (
    <>
      <Button variant="text" p={0} onClick={onPresentTransactionsModal} height={24}>
        <HistoryIcon color="primary" width="24px" />
      </Button>
    </>
  );
};

export default Transactions;
