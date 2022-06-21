import { Heading } from "@pancakeswap/uikit";
import uniqueId from "lodash/uniqueId";
import AddIcon from "src/assets/icons/add.svg";
import StyledButton from "src/components/StyledButton";
import { useTranslation } from "src/contexts/Localization";

import Choice from "./Choice";

export interface Choice {
  id: string;
  value: string;
}

interface ChoicesProps {
  choices: Choice[];
  onChange: (newChoices: Choice[]) => void;
}

export const MINIMUM_CHOICES = 2;
export const makeChoice = (): Choice => ({ id: uniqueId(), value: "" });

const Choices: React.FC<ChoicesProps> = ({ choices, onChange }) => {
  const { t } = useTranslation();
  const hasMinimumChoices = choices.filter(choice => choice.value.length > 0).length >= MINIMUM_CHOICES;

  const addChoice = () => {
    onChange([...choices, makeChoice()]);
  };

  return (
    <div>
      <Heading as="h3" scale="md" color="black">
        {t("choices")}
      </Heading>
      {choices.map(({ id, value }, index) => {
        const handleTextInput = (newValue: string) => {
          const newChoices = [...choices];
          const choiceIndex = newChoices.findIndex(newChoice => newChoice.id === id);

          newChoices[choiceIndex].value = newValue;

          onChange(newChoices);
        };

        const handleRemove = () => {
          onChange(choices.filter(newPrevChoice => newPrevChoice.id !== id));
        };

        return (
          <Choice
            key={id}
            scale="lg"
            onTextInput={handleTextInput}
            placeholder={t("input choice text")}
            value={value}
            onRemove={index > 1 ? handleRemove : undefined}
          />
        );
      })}

      <StyledButton
        style={{ background: "transparent", border: "none", width: "45px" }}
        type="button"
        onClick={addChoice}
        disabled={!hasMinimumChoices}
      >
        <img src={AddIcon} />
      </StyledButton>
    </div>
  );
};

export default Choices;
