import { Flex, Radio, Text } from "@pancakeswap/uikit";
import { ChangeEvent } from "react";
import { useTranslation } from "src/contexts/Localization";
import { ProposalState } from "src/slices/types";
import styled from "styled-components";

interface FiltersProps {
  filterState: ProposalState;
  onFilterChange: (filterState: ProposalState) => void;
  isLoading: boolean;
}

const StyledFilters = styled(Flex).attrs({ alignItems: "center" })`
  padding: 16px 24px;
`;

const FilterLabel = styled.label`
  align-items: center;
  cursor: pointer;
  display: flex;
  margin-right: 16px;
`;

const options = [
  { value: ProposalState.ACTIVE, label: "Vote Now" },
  { value: ProposalState.PENDING, label: "Soon" },
  { value: ProposalState.CLOSED, label: "Closed" },
];

const Filters: React.FC<FiltersProps> = ({ filterState, onFilterChange, isLoading }) => {
  const { t } = useTranslation();

  return (
    <StyledFilters>
      {options.map(({ value, label }, index) => {
        const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
          const { value: radioValue } = evt.currentTarget;
          onFilterChange(radioValue as ProposalState);
        };

        return (
          <FilterLabel key={label}>
            <Radio
              className="styled-radio"
              scale="sm"
              name="sm"
              value={value}
              onChange={handleChange}
              checked={filterState === value}
            />
            <Text color="#445FA7">{value}</Text>
          </FilterLabel>
        );
      })}
    </StyledFilters>
  );
};

export default Filters;
