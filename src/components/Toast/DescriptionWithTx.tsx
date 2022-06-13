import { Link, Text } from "@pancakeswap/uikit";
// import { getBscScanLink } from 'src/utils'
// import useActiveWeb3React from 'src/hooks/useActiveWeb3React'
import { useWeb3Context } from "src/hooks/web3Context";

import { useTranslation } from "../../contexts/Localization";
import { getBscScanLink } from "../../utils";
import truncateHash from "../../utils/truncateHash";

interface DescriptionWithTxProps {
  description?: string;
  txHash?: string;
}

const DescriptionWithTx: React.FC<DescriptionWithTxProps> = ({ txHash, children }) => {
  const { networkId: chainId } = useWeb3Context();
  const { t } = useTranslation();

  return (
    <>
      {typeof children === "string" ? <Text as="p">{children}</Text> : children}
      {txHash && (
        <Link external href={getBscScanLink(txHash, "transaction", chainId)}>
          {t("View on BscScan")}: {truncateHash(txHash, 8, 0)}
        </Link>
      )}
    </>
  );
};

export default DescriptionWithTx;
