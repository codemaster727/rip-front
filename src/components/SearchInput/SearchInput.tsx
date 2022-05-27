import { Input } from "@pancakeswap/uikit";
import debounce from "lodash/debounce";
import { useMemo, useState } from "react";
import { useTranslation } from "src/contexts/Localization";
import styled from "styled-components";

const StyledInput = styled(Input)`
  border-radius: 16px;
  margin-left: auto;
  color: black;
  border-color: black;
  &::placeholder {
    color: black;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`;

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchInput: React.FC<Props> = ({ onChange: onChangeCallback, placeholder = "Search" }) => {
  const [searchText, setSearchText] = useState("");

  const { t } = useTranslation();

  const debouncedOnChange = useMemo(
    () => debounce((e: React.ChangeEvent<HTMLInputElement>) => onChangeCallback(e), 500),
    [onChangeCallback],
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    debouncedOnChange(e);
  };

  return (
    <InputWrapper>
      <StyledInput className="styled-input" value={searchText} onChange={onChange} placeholder={t(placeholder)} />
    </InputWrapper>
  );
};

export default SearchInput;
