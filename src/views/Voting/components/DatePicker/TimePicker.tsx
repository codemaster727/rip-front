import { useTranslation } from "src/contexts/Localization";

import DatePicker, { DatePickerProps } from "./DatePicker";

const TimePicker: React.FC<DatePickerProps> = (props: any) => {
  const { t } = useTranslation();

  return (
    <DatePicker
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption={t("Time")}
      dateFormat="ppp"
      {...props}
    />
  );
};

export default TimePicker;
