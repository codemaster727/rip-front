import { memo } from "react";
import { useTranslation } from "src/contexts/Localization";
import styled from "styled-components";

import DatePicker, { DatePickerProps } from "./DatePicker";

const StyledDatePicker = styled(DatePicker)`
  color: black !important;
  text-align: center;
  &:placeholder {
    color: black !important;
  }
`;

const TimePicker: React.FC<DatePickerProps> = memo((props: any) => {
  const { t } = useTranslation();

  return (
    <StyledDatePicker
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption={t("Time")}
      dateFormat="ppp"
      {...props}
    />
  );
});

export default TimePicker;
