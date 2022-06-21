import { forwardRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// react-router-dom LinkProps types
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
  innerRef?: React.Ref<HTMLAnchorElement>;
  prefetch?: boolean;
}

const A = styled.a`
  margin: 0;
`;

/**
 * temporary solution for migrating React Router to Next.js Link
 */
export const NextLinkFromReactRouter = forwardRef<any, LinkProps>(({ to, children, ...props }, ref) => (
  <Link to={to as string} style={{ marginBottom: "0" }}>
    <A ref={ref} {...props}>
      {children}
    </A>
  </Link>
));
