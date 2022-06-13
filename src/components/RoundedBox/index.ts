import styled from "styled-components";

const RoundedBox = styled.div<{ light?: string }>`
  align-self: baseline;
  max-width: 100%;
  width: fit-content;
  border-radius: 1rem;
  background: ${({ light = "light", theme }) => (light === "light" ? theme.colors.background : theme.colors.primary)};
  padding: 1rem;
  padding-left: 0.5rem;
  padding-right: 0;

  // ${({ theme }) => theme.mediaQueries.sm} {}
`;

export default RoundedBox;
