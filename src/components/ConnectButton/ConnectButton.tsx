// import { Trans } from "@lingui/macro";
// import { PrimaryButton } from "@olympusdao/component-library";
import { Text } from "@pancakeswap/uikit";
import React from "react";
import { useWeb3Context } from "src/hooks/web3Context";

import StyledButton from "../StyledButton";

const ConnectButton: React.FC<{ light?: string }> = ({ light = "dark" }) => {
  const { connect } = useWeb3Context();
  return (
    <StyledButton light={light} size="large" onClick={connect}>
      <Text color="#B3FFAB">Connect Wallet</Text>
    </StyledButton>
  );
};

export default ConnectButton;
