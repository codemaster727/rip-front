import { Box, Button, Flex, InjectedModalProps, Modal, Spinner } from "@pancakeswap/uikit";
import { useState } from "react";
import { useTranslation } from "src/contexts/Localization";
import useTheme from "src/hooks/useTheme";

import useGetVotingPower from "../hooks/useGetVotingPower";
import DetailsView from "./CastVoteModal/DetailsView";

interface VoteDetailsModalProps extends InjectedModalProps {
  block: number;
}

const VoteDetailsModal: React.FC<VoteDetailsModalProps> = ({ block, onDismiss }) => {
  const { t } = useTranslation();
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const {
    isLoading,
    total,
    cakeBalance,
    cakeVaultBalance,
    cakePoolBalance,
    poolsBalance,
    cakeBnbLpBalance,
    ifoPoolBalance,
  } = useGetVotingPower(block, modalIsOpen);
  const [theme] = useTheme();

  const handleDismiss = () => {
    setModalIsOpen(false);
    onDismiss && onDismiss();
  };

  return (
    <Modal title={t("Voting Power")} onDismiss={handleDismiss} headerBackground={"green"}>
      <Box mb="24px" width="320px">
        {isLoading ? (
          <Flex height="450px" alignItems="center" justifyContent="center">
            <Spinner size={80} />
          </Flex>
        ) : (
          <>
            <DetailsView
              total={total as number}
              cakeBalance={cakeBalance}
              cakeVaultBalance={cakeVaultBalance}
              cakePoolBalance={cakePoolBalance}
              poolsBalance={poolsBalance}
              ifoPoolBalance={ifoPoolBalance}
              cakeBnbLpBalance={cakeBnbLpBalance}
              block={block}
            />
            <Button variant="secondary" onClick={onDismiss} width="100%" mt="16px">
              {t("Close")}
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default VoteDetailsModal;
