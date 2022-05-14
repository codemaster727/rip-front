import { ChainId, Currency /*, Token*/ } from "@pancakeswap/sdk";
import {
  ArrowUpIcon,
  Box,
  Button,
  ErrorIcon,
  Flex,
  InjectedModalProps,
  Link,
  // Modal,
  Spinner,
  Text,
} from "@pancakeswap/uikit";
import { Handler } from "puppeteer";
import { useCallback } from "react";
import styled from "styled-components";

import { useTranslation } from "../../contexts/Localization";
// import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useWeb3Context } from "../../hooks/web3Context";
import { getBscScanLink } from "../../utils";
// import { wrappedCurrency } from "../../utils/wrappedCurrency";
import { AutoColumn, ColumnCenter } from "../Layout/Column";
import StyledModal from "../StyledModal";

const Wrapper = styled.div`
  width: 100%;
`;
const Section = styled(AutoColumn)`
  padding: 24px;
`;

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 24px 0;
`;

function ConfirmationPendingContent({ pendingText }: { pendingText: string }) {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <ConfirmedIcon>
        <Spinner />
      </ConfirmedIcon>
      <AutoColumn gap="12px" justify="center">
        <Text fontSize="20px" color="white">
          {t("Waiting For Confirmation")}
        </Text>
        <AutoColumn gap="12px" justify="center">
          <Text bold small textAlign="center" color="white">
            {pendingText}
          </Text>
        </AutoColumn>
        <Text small color="white" textAlign="center">
          {t("Confirm this transaction in your wallet")}
        </Text>
      </AutoColumn>
    </Wrapper>
  );
}

export function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
}: {
  onDismiss: () => void;
  hash: string | undefined;
  chainId: ChainId;
  currencyToAdd?: Currency | undefined;
}) {
  // const { provider: library } = useWeb3Context();

  const { t } = useTranslation();

  // const token: Token | undefined = wrappedCurrency(currencyToAdd, chainId);

  return (
    <Wrapper>
      <Section>
        <ConfirmedIcon>
          <ArrowUpIcon strokeWidth={0.5} width="90px" color="primary" />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify="center">
          <Text fontSize="20px" color="white">
            {t("Transaction Submitted")}
          </Text>
          {chainId && hash && (
            <Link external small href={getBscScanLink(hash, "transaction", chainId)}>
              {t("View on BscScan")}
            </Link>
          )}
          {/* {currencyToAdd && library?.provider?.isMetaMask && (
            <Button
              variant="tertiary"
              mt="12px"
              width="fit-content"
              onClick={() =>
                registerToken(
                  token.address,
                  token.symbol,
                  token.decimals,
                  token instanceof WrappedTokenInfo ? token.logoURI : undefined,
                )
              }
            >
              <RowFixed>
                {t('Add %asset% to Metamask', { asset: currencyToAdd.symbol })}
                <MetamaskIcon width="16px" ml="6px" />
              </RowFixed>
            </Button>
          )} */}
          <Button onClick={onDismiss} mt="20px">
            {t("Close")}
          </Button>
        </AutoColumn>
      </Section>
    </Wrapper>
  );
}

export function ConfirmationModalContent({
  bottomContent,
  topContent,
}: {
  topContent: () => React.ReactNode;
  bottomContent: () => React.ReactNode;
}) {
  return (
    <Wrapper>
      <Box>{topContent()}</Box>
      <Box>{bottomContent()}</Box>
    </Wrapper>
  );
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: Handler | undefined }) {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <AutoColumn justify="center">
        <ErrorIcon color="failure" width="64px" />
        <Text color="failure" style={{ textAlign: "center", width: "85%", wordBreak: "break-word" }}>
          {message}
        </Text>
      </AutoColumn>

      <Flex justifyContent="center" pt="24px">
        <Button onClick={onDismiss}>{t("Dismiss")}</Button>
      </Flex>
    </Wrapper>
  );
}

interface ConfirmationModalProps {
  title: string;
  customOnDismiss?: () => void;
  hash: string | undefined;
  content: () => React.ReactNode;
  attemptingTxn: boolean;
  pendingText: string;
  currencyToAdd?: Currency | undefined;
}

const TransactionConfirmationModal: React.FC<InjectedModalProps & ConfirmationModalProps> = ({
  title,
  onDismiss,
  customOnDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd,
}) => {
  const { networkId: chainId } = useWeb3Context();

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss();
    }
    onDismiss?.();
  }, [customOnDismiss, onDismiss]);

  if (!chainId) return null;

  return (
    <StyledModal title={title} onDismiss={handleDismiss} width={650}>
      {attemptingTxn ? (
        <ConfirmationPendingContent pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={handleDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )}
    </StyledModal>
  );
};

export default TransactionConfirmationModal;
