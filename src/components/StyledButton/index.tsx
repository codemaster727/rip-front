import { Button, ButtonProps, Flex } from "@pancakeswap/uikit";
import React from "react";
import styled from "styled-components";

const StyledBtn = styled(Button)`
  border-radius: 40px;
  background: transparent;
  border: 1px solid #b3ffab;
  width: fit-content;
  color: #b3ffab;
`;
const StyledLightBtn = styled(Button)`
  border-radius: 40px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid #b3ffab;
  color: #b3ffab;
  width: fit-content;
`;
interface StyledButtonProps extends ButtonProps {
  light?: string;
}
const StyledButton: React.FC<StyledButtonProps> = ({ light = "dark", children, ...rest }) => {
  return (
    <Flex width="100%" justifyContent="center">
      {light === "dark" ? (
        <StyledBtn {...rest}>{children}</StyledBtn>
      ) : (
        <StyledLightBtn {...rest}>{children}</StyledLightBtn>
      )}
    </Flex>
  );
};

export default StyledButton;
