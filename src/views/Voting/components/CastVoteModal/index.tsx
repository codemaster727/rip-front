import { Box } from "@pancakeswap/uikit";
import { useState } from "react";
import StyledModal from "src/components/StyledModal";
import { useTranslation } from "src/contexts/Localization";
import { useWeb3Context } from "src/hooks";
// import useWeb3Provider from 'src/hooks/useActiveWeb3React'
import useTheme from "src/hooks/useTheme";
import useToast from "src/hooks/useToast";
import { SnapshotCommand } from "src/slices/types";
import { signMessage } from "src/utils/web3React";

import { generatePayloadData, Message, sendSnapshotData } from "../../helpers";
import useGetVotingPower from "../../hooks/useGetVotingPower";
import DetailsView from "./DetailsView";
import MainView from "./MainView";
import { CastVoteModalProps, ConfirmVoteView } from "./types";

const CastVoteModal: React.FC<CastVoteModalProps> = ({ onSuccess, proposalId, vote, block, onDismiss }) => {
  const [view, setView] = useState<ConfirmVoteView>(ConfirmVoteView.MAIN);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const { account, provider: library } = useWeb3Context();
  const { t } = useTranslation();
  const { toastError } = useToast();
  const [theme] = useTheme();
  const {
    isLoading,
    isError,
    total,
    cakeBalance,
    cakeVaultBalance,
    cakePoolBalance,
    poolsBalance,
    cakeBnbLpBalance,
    ifoPoolBalance,
  } = useGetVotingPower(block, modalIsOpen);

  const isStartView = view === ConfirmVoteView.MAIN;
  const handleBack = isStartView ? undefined : () => setView(ConfirmVoteView.MAIN);
  const handleViewDetails = () => setView(ConfirmVoteView.DETAILS);

  const title = {
    [ConfirmVoteView.MAIN]: t("Confirm Vote"),
    [ConfirmVoteView.DETAILS]: t("Voting Power"),
  };

  const handleDismiss = () => {
    setModalIsOpen(false);
    onDismiss && onDismiss();
  };

  const handleConfirmVote = async () => {
    try {
      setIsPending(true);
      const voteMsg = JSON.stringify({
        ...generatePayloadData(),
        type: SnapshotCommand.VOTE,
        payload: {
          proposal: proposalId,
          choice: vote.value,
        },
      });

      const sig = await signMessage(/*connector, */ library, account as string, voteMsg);
      const msg: Message = { address: account as string, msg: voteMsg, sig };

      // Save proposal to snapshot
      await sendSnapshotData(msg);

      await onSuccess();

      handleDismiss();
    } catch (error) {
      toastError(t("Error"), (error as Error)?.message ?? t("Error occurred, please try again"));
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <StyledModal title={title[view]} onBack={handleBack} onDismiss={onDismiss}>
      <Box mb="24px" width="320px">
        {view === ConfirmVoteView.MAIN && (
          <MainView
            vote={vote}
            isError={isError}
            isLoading={isLoading}
            isPending={isPending}
            total={total as number}
            onConfirm={handleConfirmVote}
            onViewDetails={handleViewDetails}
            onDismiss={handleDismiss}
          />
        )}
        {view === ConfirmVoteView.DETAILS && (
          <DetailsView
            total={total as number}
            cakeBalance={cakeBalance}
            ifoPoolBalance={ifoPoolBalance}
            cakeVaultBalance={cakeVaultBalance}
            cakePoolBalance={cakePoolBalance}
            poolsBalance={poolsBalance}
            cakeBnbLpBalance={cakeBnbLpBalance}
            block={block as number}
          />
        )}
      </Box>
    </StyledModal>
  );
};

export default CastVoteModal;
