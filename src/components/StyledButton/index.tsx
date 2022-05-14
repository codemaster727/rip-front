import { Button, ButtonProps } from "@pancakeswap/uikit";
import React from "react";
import styled from "styled-components";

const StyledBtn = styled(Button)`
  border-radius: 40px;
  background: linear-gradient(259.15deg, rgba(41, 255, 198, 0.2) 40.61%, rgba(255, 255, 255, 0) 166.25%);
  border: 1px solid #b3ffab;
`;
const StyledButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return <StyledBtn {...rest}>{children}</StyledBtn>;
};

export default StyledButton;
