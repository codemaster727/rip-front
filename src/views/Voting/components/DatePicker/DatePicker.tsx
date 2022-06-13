import "react-datepicker/dist/react-datepicker.css";

import { Input, InputProps } from "@pancakeswap/uikit";
import ReactDatePicker, { ReactDatePickerProps } from "react-datepicker";

export interface DatePickerProps extends ReactDatePickerProps {
  inputProps?: InputProps;
}

const DatePicker: React.FC<DatePickerProps> = ({ inputProps = {}, ...props }) => {
  return (
    <ReactDatePicker customInput={<Input {...inputProps} />} portalId="reactDatePicker" dateFormat="PPP" {...props} />
  );
};

export default DatePicker;
