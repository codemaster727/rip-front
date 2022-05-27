import { Token } from "@pancakeswap/sdk";
import { Text } from "@pancakeswap/uikit";
import { TokenPairImage } from "src/components/TokenImage";
import { useTranslation } from "src/contexts/Localization";
import { useFarmUser } from "src/slices/farms/hooks";
import { getBalanceNumber } from "src/utils/formatBalance";
import styled from "styled-components";

export interface FarmProps {
  label: string;
  pid: number;
  token: Token;
  quoteToken: Token;
}

const Container = styled.div`
  padding-left: 16px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
  }
`;

const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
  }
`;

const Farm: React.FunctionComponent<FarmProps> = ({ token, quoteToken, label, pid }) => {
  const { stakedBalance } = useFarmUser(pid);
  const { t } = useTranslation();
  const rawStakedBalance = getBalanceNumber(stakedBalance);

  const handleRenderFarming = (): JSX.Element | null => {
    if (rawStakedBalance) {
      return (
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t("Farming")}
        </Text>
      );
    }

    return null;
  };

  return (
    <Container>
      <TokenWrapper>
        <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={40} height={40} />
      </TokenWrapper>
      <div>
        {handleRenderFarming()}
        <Text bold>{label}</Text>
      </div>
    </Container>
  );
};

export default Farm;
