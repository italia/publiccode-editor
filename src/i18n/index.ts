import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import locales from "locale-codes";
import LanguageDetector from 'i18next-browser-languagedetector';

import { FALLBACK_LANGUAGE } from "../app/contents/constants";
import translation from "./translations.json";
import pc from "./publiccode.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ns: ["translation", "pc"],
    defaultNS: "translation",
    resources: {
      en: {
        pc: pc.en.pc,
        translation: translation.en.translation,
      },
      it: {
        pc: pc.it.pc,
        translation: translation.it.translation,
      },
    },
    supportedLngs: ["en", "it"],
    nonExplicitSupportedLngs: true, // make pass eg. "en-US" if "en" is in supportedLngs
    fallbackLng: FALLBACK_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'navigator', 'htmlTag', 'path', 'subdomain'],

      lookupQuerystring: 'lang',
      lookupCookie: 'lang',
      lookupLocalStorage: 'lang',
      lookupSessionStorage: 'lang',

      caches: [],
    }
  });

export const displayName = (tag: string, locale: string = i18n.language) => {
  try {
    return new Intl.DisplayNames([locale], { type: 'language' }).of(tag);
  } catch (e) {
    return null;
  }
}

export const allLangs = (locale: string = i18n.language) => {
  return locales.all
    .map(l => ({ text: displayName(l.tag, locale), value: l.tag }))
    .filter(e => e !== null)
}
