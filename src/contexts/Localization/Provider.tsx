import { Language } from "@pancakeswap/uikit";
import memoize from "lodash/memoize";
import { createContext, useCallback, useEffect, useState } from "react";

import { EN, languages } from "../../constants/localization/languages";
import translations from "../../constants/localization/translations.json";
import { fetchLocale, getLanguageCodeFromLS, LS_KEY } from "./helpers";
import { ContextApi, ProviderState, TranslateFunction } from "./types";

const initialState: ProviderState = {
  isFetching: true,
  currentLanguage: EN,
};

const includesVariableRegex = new RegExp(/%\S+?%/, "gm");

const translatedTextIncludesVariable = memoize((translatedText: string): boolean => {
  return !!translatedText?.match(includesVariableRegex);
});

// Export the translations directly
export const languageMap = new Map<Language["locale"], Record<string, string>>();
languageMap.set(EN.locale, translations);

//@ts-ignore
export const LanguageContext = createContext<ContextApi>();

export const LanguageProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<ProviderState>(() => {
    const codeFromStorage: string = getLanguageCodeFromLS();

    return {
      ...initialState,
      currentLanguage: languages[codeFromStorage as keyof typeof languages] || EN,
    };
  });
  const { currentLanguage } = state;

  useEffect(() => {
    const fetchInitialLocales = async () => {
      const codeFromStorage = getLanguageCodeFromLS();

      if (codeFromStorage !== EN.locale) {
        const enLocale = languageMap.get(EN.locale);
        const currentLocale = await fetchLocale(codeFromStorage);
        if (currentLocale) {
          languageMap.set(codeFromStorage, { ...enLocale, ...currentLocale });
        }
      }

      setState(prevState => ({
        ...prevState,
        isFetching: false,
      }));
    };

    fetchInitialLocales();
  }, [setState]);

  const setLanguage = useCallback(async (language: Language) => {
    if (!languageMap.has(language.locale)) {
      setState(prevState => ({
        ...prevState,
        isFetching: true,
      }));

      const locale = await fetchLocale(language.locale);
      if (locale) {
        const enLocale = languageMap.get(EN.locale);
        // Merge the EN locale to ensure that any locale fetched has all the keys
        languageMap.set(language.locale, { ...enLocale, ...locale });
      }

      localStorage?.setItem(LS_KEY, language.locale);

      setState(prevState => ({
        ...prevState,
        isFetching: false,
        currentLanguage: language,
      }));
    } else {
      localStorage?.setItem(LS_KEY, language.locale);
      setState(prevState => ({
        ...prevState,
        isFetching: false,
        currentLanguage: language,
      }));
    }
  }, []);

  const translate: TranslateFunction = useCallback(
    (key, data) => {
      const translationSet = languageMap.get(currentLanguage.locale) ?? languageMap.get(EN.locale);
      const translatedText = (translationSet && translationSet[key]) || key;

      // Check the existence of at least one combination of %%, separated by 1 or more non space characters
      const includesVariable = translatedTextIncludesVariable(translatedText);

      if (includesVariable && data) {
        let interpolatedText = translatedText;
        Object.keys(data).forEach(dataKey => {
          const templateKey = new RegExp(`%${dataKey}%`, "g");
          interpolatedText = interpolatedText.replace(templateKey, data[dataKey].toString());
        });

        return interpolatedText;
      }

      return translatedText;
    },
    [currentLanguage],
  );

  return (
    <LanguageContext.Provider value={{ ...state, setLanguage, t: translate }}>{children}</LanguageContext.Provider>
  );
};
