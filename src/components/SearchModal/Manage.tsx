import { Token } from "@pancakeswap/sdk";
import { ButtonMenu, ButtonMenuItem, ModalBody } from "@pancakeswap/uikit";
import { TokenList } from "@uniswap/token-lists";
import { useState } from "react";
import styled from "styled-components";

import { useTranslation } from "../../contexts/Localization";
import ManageLists from "./ManageLists";
import ManageTokens from "./ManageTokens";
import { CurrencyModalView } from "./types";

export const StyledButtonMenu = styled(ButtonMenu)`
  width: 100%;
  background: linear-gradient(259.15deg, rgba(41, 255, 198, 0.2) 40.61%, rgba(255, 255, 255, 0) 166.25%);
  border-color: #09fdb5;
`;

export default function Manage({
  setModalView,
  setImportList,
  setImportToken,
  setListUrl,
}: {
  setModalView: (view: CurrencyModalView) => void;
  setImportToken: (token: Token) => void;
  setImportList: (list: TokenList) => void;
  setListUrl: (url: string) => void;
}) {
  const [showLists, setShowLists] = useState(true);

  const { t } = useTranslation();

  return (
    <ModalBody>
      <StyledButtonMenu
        activeIndex={showLists ? 0 : 1}
        onItemClick={() => setShowLists(prev => !prev)}
        scale="sm"
        variant="subtle"
        mb="32px"
      >
        <ButtonMenuItem
          style={{ backgroundColor: showLists ? "#00FCB0" : "transparent", color: showLists ? "black" : "#09FDB5" }}
          width="50%"
        >
          {t("lists")}
        </ButtonMenuItem>
        <ButtonMenuItem
          style={{ backgroundColor: !showLists ? "#00FCB0" : "transparent", color: !showLists ? "black" : "#09FDB5" }}
          width="50%"
        >
          {t("tokens")}
        </ButtonMenuItem>
      </StyledButtonMenu>
      {showLists ? (
        <ManageLists setModalView={setModalView} setImportList={setImportList} setListUrl={setListUrl} />
      ) : (
        <ManageTokens setModalView={setModalView} setImportToken={setImportToken} />
      )}
    </ModalBody>
  );
}
