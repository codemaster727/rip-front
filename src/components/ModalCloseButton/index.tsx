import "./ModalCloseButton.scss";

import { InjectedModalProps } from "@pancakeswap/uikit";
import styled from "styled-components";

import CloseIcon from "../../assets/icons/close.svg";

const CloseButton = styled.button`
  background-color: transparent;
  position: absolute;
  top: 1rem;
  right: 1rem;
  border-radius: 100%;
  width: 20px;
  border: 0;
  display: flex;
  justify-content: center;
  &:hover {
    opacity: 0.65;
  }
`;

export default function ModalCloseButton({ onDismiss = () => null }: InjectedModalProps) {
  return (
    <CloseButton onClick={onDismiss}>
      <img style={{ borderRadius: "100%" }} src={CloseIcon} width={20} height={20} />
    </CloseButton>
  );
}
