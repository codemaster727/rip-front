/* eslint-disable global-require */
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { dark, light, ModalProvider } from "@pancakeswap/uikit";
import { FC, useEffect } from "react";
import { QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "src/contexts/Localization";
import { ToastsProvider } from "src/contexts/ToastsContext";
import { ThemeProvider } from "styled-components";

import App, { GlobalHooks } from "./App";
import useTheme from "./hooks/useTheme";
import { Web3ContextProvider } from "./hooks/web3Context";
import { queryClient } from "./lib/react-query";
import { initLocale } from "./locales";
import ListsUpdater from "./slices/lists/updater";
import MulticallUpdater from "./slices/multicall/updater";
import TransactionUpdater from "./slices/transactions/updater";
import store from "./store";

export function Updaters() {
  return (
    <>
      <ListsUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  );
}

const { colors } = light as any;
const updatedLight = {
  ...light,
  colors: {
    ...colors,
    background: "linear-gradient(259.15deg, rgba(41, 255, 198, 0.2) 40.61%, rgba(255, 255, 255, 0) 166.25%), #000000",
    success: "#09FDB5",
    primary: "#00FCB0",
    blueish_gray: "#445FA7",
    text: "#ffffff",
    textSubtle: "#ffffff",
    gradients: {
      ...colors.gradients,
      background: "linear-gradient(259.15deg, rgba(41, 255, 198, 0.2) 40.61%, rgba(255, 255, 255, 0) 166.25%), #000000",
      cardHeader: "linear-gradient(259.15deg, rgba(41, 255, 198, 0.2) 40.61%, rgba(255, 255, 255, 0) 166.25%), #000000",
    },
  },
};

const StyledThemeProvider = (props: any) => {
  const [theme] = useTheme();
  return <ThemeProvider theme={theme === "dark" ? dark : updatedLight} {...props} />;
};

const Root: FC = () => {
  useEffect(() => {
    initLocale();
  }, []);

  return (
    <Web3ContextProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ToastsProvider>
            <StyledThemeProvider>
              <LanguageProvider>
                <Updaters />
                <GlobalHooks />
                <I18nProvider i18n={i18n}>
                  <BrowserRouter basename={"/#"}>
                    <ModalProvider>
                      <App />
                    </ModalProvider>
                  </BrowserRouter>
                </I18nProvider>
              </LanguageProvider>
            </StyledThemeProvider>
          </ToastsProvider>
        </Provider>
      </QueryClientProvider>
    </Web3ContextProvider>
  );
};

export default Root;

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
