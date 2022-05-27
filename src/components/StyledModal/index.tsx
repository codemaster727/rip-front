import { Heading, IconButton, InjectedModalProps, ModalBody, ModalContainer, ModalTitle } from "@pancakeswap/uikit";
import { ReactNode } from "react";
import BackIcon from "src/assets/icons/back.svg";
import styled from "styled-components";

import ModalCloseButton from "../ModalCloseButton";

export const StyledModalContainer = styled(ModalContainer)<{ width: number }>`
  max-width: ${({ width }) => width}px;
  width: 100%;
  background: linear-gradient(259.15deg, rgba(41, 255, 198, 0.2) 40.61%, rgba(255, 255, 255, 0) 166.25%), #000000;
  border: 1px solid #10fcb6;
  border-radius: 20px;
`;

export const StyledModalBody = styled(ModalBody)`
  padding: 24px 48px;
  padding-top: 12px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

interface StyledModalProps extends InjectedModalProps {
  title: string;
  children: ReactNode;
  onBack?: any;
  width?: number;
}

export default function StyledModal({
  title,
  onDismiss = () => null,
  onBack,
  children,
  width = 420,
}: StyledModalProps) {
  return (
    <StyledModalContainer minWidth="320px" position={"relative"} width={width}>
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
      <ModalCloseButton onDismiss={onDismiss} />
      <StyledModalBody padding={"40px"}>{children}</StyledModalBody>
    </StyledModalContainer>
  );
}
