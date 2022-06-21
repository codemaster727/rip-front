import styled from "styled-components";

const RoundedBox = styled.div<{ light?: string }>`
  align-self: baseline;
  max-width: 80%;
  margin: auto;
  border-radius: 1rem;
  background: ${({ light = "light", theme }) =>
    light === "light" ? theme.colors.background : light === "none" ? "transparent" : theme.colors.primary};
  padding: 1rem;
  padding-left: 0.5rem;
  padding-right: 0;

  // ${({ theme }) => theme.mediaQueries.sm} {}
`;

export default RoundedBox;
