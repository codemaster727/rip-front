import { Button, Checkbox, Flex, Text } from "@pancakeswap/uikit";
import { Handler } from "puppeteer";
import { useState } from "react";

import { useTranslation } from "../../../../contexts/Localization";

interface AcknowledgementProps {
  handleContinueClick: Handler | undefined;
}

const Acknowledgement: React.FC<AcknowledgementProps> = ({ handleContinueClick }) => {
  const { t } = useTranslation();
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <>
      <Flex justifyContent="space-between">
        <Flex alignItems="center">
          <Checkbox
            name="confirmed"
            type="checkbox"
            checked={isConfirmed}
            onChange={() => setIsConfirmed(!isConfirmed)}
            scale="sm"
          />
          <Text ml="10px" style={{ userSelect: "none" }}>
            {t("I understand")}
          </Text>
        </Flex>

        <Button disabled={!isConfirmed} onClick={handleContinueClick}>
          {t("Continue")}
        </Button>
      </Flex>
    </>
  );
};

export default Acknowledgement;
