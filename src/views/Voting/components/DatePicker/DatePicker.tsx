import "react-datepicker/dist/react-datepicker.css";

import { Input, InputProps } from "@pancakeswap/uikit";
import ReactDatePicker, { ReactDatePickerProps } from "react-datepicker";
import styled from "styled-components";

export interface DatePickerProps extends ReactDatePickerProps {
  inputProps?: InputProps;
}

const StyledDatePicker = styled(ReactDatePicker)`
  color: black;
  text-align: center;
`;

const DatePicker: React.FC<DatePickerProps> = ({ inputProps = {}, ...props }) => {
  return (
    <StyledDatePicker customInput={<Input {...inputProps} />} portalId="reactDatePicker" dateFormat="PPP" {...props} />
  );
};

export default DatePicker;
