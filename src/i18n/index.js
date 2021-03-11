import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "./translations.json";

i18n.use(initReactI18next).init({
  resources,
  lng: "it",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
