import { Currency, Token } from "@pancakeswap/sdk";
import { Button, InjectedModalProps } from "@pancakeswap/uikit";
import { TokenList } from "@uniswap/token-lists";
import { useCallback, useState } from "react";
import styled from "styled-components";

import ManageIcon from "../../assets/icons/manage.svg";
import { useTranslation } from "../../contexts/Localization";
import usePrevious from "../../hooks/usePreviousValue";
import StyledModal from "../StyledModal";
import CurrencySearch from "./CurrencySearch";
import ImportList from "./ImportList";
import ImportToken from "./ImportToken";
import Manage from "./Manage";
import { CurrencyModalView } from "./types";

export const Footer = styled.div`
  width: 100%;
  background-color: transparent;
  text-align: center;
`;

interface CurrencySearchModalProps extends InjectedModalProps {
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
}

export default function CurrencySearchModal({
  onDismiss = () => null,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases = false,
}: CurrencySearchModalProps) {
  const [modalView, setModalView] = useState<CurrencyModalView>(CurrencyModalView.search);

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onDismiss?.();
      onCurrencySelect(currency);
    },
    [onDismiss, onCurrencySelect],
  );

  // for token import view
  const prevView = usePrevious(modalView);

  // used for import token flow
  const [importToken, setImportToken] = useState<Token | undefined>();

  // used for import list
  const [importList, setImportList] = useState<TokenList | undefined>();
  const [listURL, setListUrl] = useState<string | undefined>();

  const { t } = useTranslation();

  const config = {
    [CurrencyModalView.search]: { title: t("select a token"), onBack: undefined },
    [CurrencyModalView.manage]: {
      title: t("manage tokens"),
      onBack: /*() => setModalView(CurrencyModalView.search)*/ undefined,
    },
    [CurrencyModalView.importToken]: {
      title: t("import tokens"),
      onBack: () =>
        setModalView(prevView && prevView !== CurrencyModalView.importToken ? prevView : CurrencyModalView.search),
    },
    [CurrencyModalView.importList]: { title: t("import list"), onBack: () => setModalView(CurrencyModalView.search) },
  };

  return (
    <StyledModal title={config[modalView].title} onBack={config[modalView].onBack} onDismiss={onDismiss}>
      {modalView === CurrencyModalView.search ? (
        <CurrencySearch
          onCurrencySelect={handleCurrencySelect}
          selectedCurrency={selectedCurrency}
          otherSelectedCurrency={otherSelectedCurrency}
          showCommonBases={showCommonBases}
          showImportView={() => setModalView(CurrencyModalView.importToken)}
          setImportToken={setImportToken}
        />
      ) : modalView === CurrencyModalView.importToken && importToken ? (
        <ImportToken tokens={[importToken]} handleCurrencySelect={handleCurrencySelect} />
      ) : modalView === CurrencyModalView.importList && importList && listURL ? (
        <ImportList list={importList} listURL={listURL} onImport={() => setModalView(CurrencyModalView.manage)} />
      ) : modalView === CurrencyModalView.manage ? (
        <Manage
          setModalView={setModalView}
          setImportToken={setImportToken}
          setImportList={setImportList}
          setListUrl={setListUrl}
        />
      ) : (
        ""
      )}
      {modalView === CurrencyModalView.search && (
        <Footer>
          <Button
            scale="sm"
            variant="text"
            onClick={() => setModalView(CurrencyModalView.manage)}
            style={{
              backgroundColor: "transparent",
              color: "white",
              marginTop: "1rem",
              fontSize: ".8rem",
              fontWeight: "200",
            }}
          >
            <img src={ManageIcon} width={24} />
            {t("manage tokens")}
          </Button>
        </Footer>
      )}
    </StyledModal>
  );
}
