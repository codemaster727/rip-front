import { Checkbox, Flex, InjectedModalProps, Message, Text } from "@pancakeswap/uikit";
import { useState } from "react";
import StyledButton from "src/components/StyledButton";
import StyledModal from "src/components/StyledModal";

import { useTranslation } from "../../../contexts/Localization";
import { useExpertModeManager } from "../../../slices/user/hooks";

interface ExpertModalProps extends InjectedModalProps {
  setShowConfirmExpertModal: (arg: boolean) => void;
  setShowExpertModeAcknowledgement: (arg: boolean) => void;
}

const ExpertModal: React.FC<ExpertModalProps> = ({ setShowConfirmExpertModal, setShowExpertModeAcknowledgement }) => {
  const [, toggleExpertMode] = useExpertModeManager();
  const [isRememberChecked, setIsRememberChecked] = useState(false);

  const { t } = useTranslation();

  return (
    <StyledModal
      title={t("expert mode")}
      onBack={() => setShowConfirmExpertModal(false)}
      onDismiss={() => setShowConfirmExpertModal(false)}
      width={360}
    >
      <Message variant="warning" mb="24px">
        <Text>
          {t(
            "Expert mode turns off the 'Confirm' transaction prompt, and allows high slippage trades that often result in bad rates and lost funds.",
          )}
        </Text>
      </Message>
      <Text mb="24px">{t("Only use this mode if you know what you’re doing.")}</Text>
      <Flex alignItems="center" mb="24px">
        <Checkbox
          name="confirmed"
          type="checkbox"
          checked={isRememberChecked}
          onChange={() => setIsRememberChecked(!isRememberChecked)}
          scale="sm"
        />
        <Text ml="10px" color="textSubtle" style={{ userSelect: "none" }}>
          {t("Don’t show this again")}
        </Text>
      </Flex>
      <StyledButton
        mb="8px"
        id="confirm-expert-mode"
        onClick={() => {
          // eslint-disable-next-line no-alert
          if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === "confirm") {
            toggleExpertMode();
            setShowConfirmExpertModal(false);
            if (isRememberChecked) {
              setShowExpertModeAcknowledgement(false);
            }
          }
        }}
      >
        {t("Turn On Expert Mode")}
      </StyledButton>
      <StyledButton
        variant="secondary"
        onClick={() => {
          setShowConfirmExpertModal(false);
        }}
      >
        {t("Cancel")}
      </StyledButton>
    </StyledModal>
  );
};

export default ExpertModal;
