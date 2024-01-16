import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import locales from "locale-codes";
import LanguageDetector from 'i18next-browser-languagedetector';

import { FALLBACK_LANGUAGE } from "../app/contents/constants";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  it: { translation: it },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: Object.keys(resources),
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
