// import { Card } from "@pancakeswap/uikit";
import styled from "styled-components";

export const BodyWrapper = styled("div")`
  border-radius: 24px;
  max-width: 396px;
  width: 100%;
  z-index: 1;
  background: ${({ theme }) => theme.colors.background};
`;

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>;
}
