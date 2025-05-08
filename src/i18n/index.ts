import { countries } from "countries-list";
import i18n from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import locales from "locale-codes";
import { initReactI18next } from "react-i18next";

import { FALLBACK_LANGUAGE } from "../app/contents/constants";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";
import de from "./locales/de.json";

type LocalizedEntity = 'language' | 'region';

const resources = {
  it: { translation: it },
  en: { translation: en },
  fr: { translation: fr },
  de: { translation: de } 
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'it',
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

export const displayName = (tag: string, locale: string = i18n.language, entity: LocalizedEntity) => {
  try {
    return new Intl.DisplayNames([locale], { type: entity }).of(tag);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null;
  }
}

export const allLangs = (locale: string = i18n.language) => {
  return locales.all
    .map(l => ({ text: displayName(l.tag, locale, 'language'), value: l.tag }))
    .filter(e => e !== null)
}

export const allCountries = (locale: string = i18n.language) => {
  return Object.keys(countries)
    .map((countryCode) => ({ text: displayName(countryCode, locale, 'region'), value: countryCode }))
}

/**
 * Get all the languages supported by the app
 */
export const getSupportedLanguages = (): Array<string> => {
  //It's a special language code used by i18next for debugging purposes, and it's automatically included, so you may want to exclude it from the displayed list.
  const cimode = 'cimode'
  const supportedLngs = i18n.options.supportedLngs;
  return (Array.isArray(supportedLngs) ? supportedLngs.filter(l => l !== cimode) : [])
}

export const formatLanguageLabel = (language: string) => displayName(language, undefined, 'language')?.toUpperCase()
