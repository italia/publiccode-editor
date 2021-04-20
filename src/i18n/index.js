import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LANGUAGE } from "../app/contents/constants";
import translation from "./translations.json";
import pc from "./publiccode.json";

const getTranslations = () => {
  //checking keys
  if (!Object.keys(translation).every((x) => Object.keys(pc).includes(x))) {
    return translation;
  }
  const result = Object.keys(translation)
    .map((x) => ({
      [x]: { ...translation[x], ...pc[x] },
    }))
    .reduce((acc, x) => ({ ...acc, ...x }), {});
  return result;
};

i18n.use(initReactI18next).init({
  ns: ["translation", "pc"],
  defaultNS: "translation",
  resources: getTranslations(),
  lng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
