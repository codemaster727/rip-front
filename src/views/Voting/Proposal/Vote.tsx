import { CardProps, Flex, Heading, Radio, Text, useModal } from "@pancakeswap/uikit";
import { useState } from "react";
import ConnectButton from "src/components/ConnectButton/ConnectButton";
import StyledButton from "src/components/StyledButton";
import { useTranslation } from "src/contexts/Localization";
import { useWeb3Context } from "src/hooks";
import useToast from "src/hooks/useToast";
import { Proposal } from "src/slices/types";
import styled from "styled-components";

import CastVoteModal from "../components/CastVoteModal";

interface VoteProps extends CardProps {
  proposal: Proposal;
  onSuccess?: () => void;
}

interface State {
  label: string;
  value: number;
}

const Choice = styled.label<{ isChecked: boolean; isDisabled: boolean }>`
  align-items: center;
  border: none;
  border-radius: 16px;
  cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};
  display: flex;
  margin-bottom: 16px;
  padding: 0.5rem;
`;

const ChoiceText = styled.div`
  flex: 1;
  padding-left: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 0;
`;

const Vote: React.FC<VoteProps> = ({ proposal, onSuccess, ...props }) => {
  //@ts-ignore
  const [vote, setVote] = useState<State>(null);
  const { t } = useTranslation();
  const { toastSuccess } = useToast();
  const { account } = useWeb3Context();

  const handleSuccess = async () => {
    toastSuccess(t("Vote cast!"));
    if (onSuccess) {
      onSuccess();
    }
  };

  const [presentCastVoteModal] = useModal(
    <CastVoteModal onSuccess={handleSuccess} proposalId={proposal.id} vote={vote} block={Number(proposal.snapshot)} />,
  );

  return (
    <div>
      <Heading as="h3" scale="md" color="black">
        {t("your vote")}
      </Heading>
      {proposal.choices.map((choice, index) => {
        const isChecked = index + 1 === vote?.value;

        const handleChange = () => {
          setVote({
            label: choice,
            value: index + 1,
          });
        };

        return (
          <Choice key={choice} isChecked={isChecked} isDisabled={!account}>
            <Flex key={index} flexDirection="row" alignItems="center" style={{ gap: "1rem" }}>
              <Radio
                className="styled-radio"
                scale="sm"
                name="sm"
                value={choice}
                onChange={handleChange}
                checked={isChecked}
                disabled={!account}
              />
              <Text color="#445FA7">{choice}</Text>
            </Flex>
          </Choice>
        );
      })}
      {account ? (
        <StyledButton onClick={presentCastVoteModal} disabled={vote === null} light="light">
          {t("vote now")}
        </StyledButton>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
};

export default Vote;
