import { Heading, IconButton, InjectedModalProps, ModalBody, ModalContainer, ModalTitle } from "@pancakeswap/uikit";
import { ReactNode } from "react";
import BackIcon from "src/assets/icons/back.svg";
import styled from "styled-components";

import ModalCloseButton from "../ModalCloseButton";

export const StyledModalContainer = styled(ModalContainer)<{ width: number }>`
  max-width: ${({ width }) => (width > 0 ? width : 1000)}px;
  width: ${({ width }) => (width ? "100%" : "fit-content")};
  background: linear-gradient(259.15deg, rgba(41, 255, 198, 0.2) 40.61%, rgba(255, 255, 255, 0) 166.25%), #000000;
  border: 1px solid #10fcb6;
  border-radius: 20px;
`;

export const StyledModalBody = styled(ModalBody)<{ padding: string }>`
  padding: ${({ padding }) => (padding ? padding : "24px 48px")};
  padding-top: ${({ padding }) => (padding ? "0" : "12px")};
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

interface StyledModalProps extends InjectedModalProps {
  title?: string;
  children: ReactNode;
  onBack?: any;
  width?: number;
  padding?: string;
  closebtn?: boolean;
}

export default function StyledModal({
  title,
  onDismiss = () => null,
  onBack,
  children,
  width = 420,
  padding,
  closebtn = true,
}: StyledModalProps) {
  return (
    <StyledModalContainer minWidth="320px" position={"relative"} width={width} padding={padding}>
      {title && (
        <ModalTitle justifyContent={"center"} alignContent={"center"} paddingTop={"1rem"}>
          {onBack && (
            <IconButton as="a" onClick={onBack} style={{ cursor: "pointer" }}>
              <img src={BackIcon} width={32} />
            </IconButton>
          )}
          <Heading>
            <span className="teal-gradient" style={{ textAlign: "center" }}>
              {title}
            </span>
          </Heading>
        </ModalTitle>
      )}
      {closebtn && <ModalCloseButton onDismiss={onDismiss} />}
      <StyledModalBody padding={padding === undefined ? "40px" : padding}>{children}</StyledModalBody>
    </StyledModalContainer>
  );
}
