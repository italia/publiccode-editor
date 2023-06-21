import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LANGUAGE } from "../app/contents/constants";
import translation from "./translations.json";
import pc from "./publiccode.json";

i18n.use(initReactI18next).init({
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
  lng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});
