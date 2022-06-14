import { Box, CloseIcon, IconButton, InputProps } from "@pancakeswap/uikit";
import { ChangeEvent, InputHTMLAttributes, useState } from "react";
import { StyledInput } from "src/components/SearchModal/CurrencySearch";

interface ChoiceProps extends InputProps, InputHTMLAttributes<HTMLInputElement> {
  onTextInput: (value: string) => void;
  onRemove?: () => void;
}

const Choice: React.FC<ChoiceProps> = ({ onRemove, onTextInput, ...props }) => {
  const [isWarning, setIsWarning] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.currentTarget;

    setIsWarning(isDirty && value.length === 0);
    setIsDirty(true);
    onTextInput(value);
  };

  return (
    <Box position="relative" mb="16px">
      <StyledInput
        id="name"
        name="name"
        scale="sm"
        {...props}
        onChange={handleChange}
        isWarning={isWarning}
        required
        style={{ backgroundColor: "#00FCB0", border: "1px solid black", color: "black" }}
      />
      {onRemove && (
        <Box position="absolute" right="8px" top="0px" zIndex={30}>
          <IconButton variant="text" onClick={onRemove}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default Choice;
