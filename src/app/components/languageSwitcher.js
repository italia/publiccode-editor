import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import available_languages from "../contents/langs";
import ComboBoxWidget from "../form/widgets/ComboBoxWidget";
import CloseButton from "./CloseButton";

export const LanguageSwitcher = () => {
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { t } = useTranslation();

  const handleChange = (v) => {
    setSelectedLanguage(v);
    if (v && !languages.includes(v)) {
      setLanguages([...languages, v]);
    }
    setDropdownVisible(false);
    setSelectedLanguage([]);
    setCurrentLanguage(v);
  };

  const removeLanguage = (v) => {
    setLanguages([...languages.filter((x) => x !== v)]);
    setCurrentLanguage(languages[0]);
  };

  const switchLang = (lng) => {
    console.log("switching lang to ", lng);
    setCurrentLanguage(lng);
    setDropdownVisible(false);
  };

  const langProps = {
    multiple: false,
    input: {
      data: available_languages,
      onBlur: () => {},
      onChange: handleChange,
      value: selectedLanguage,
    },
    schema: {},
    meta: {},
  };
  return (
    <div className="language-switcher">
      {languages.map((lng) => {
        let cn = "language-switcher__item";
        if (lng == currentLanguage) {
          cn += " language-switcher__item--selected";
        }
        return (
          <div key={lng} className={cn}>
            <div
              className="language-switcher__item-label"
              onClick={() => {
                if (lng !== currentLanguage) switchLang(lng);
              }}
            >
              {lng}
            </div>
            <CloseButton onClick={() => removeLanguage(lng)} />
          </div>
        );
      })}
      {!dropdownVisible && (
        <div className="language-switcher__item">
          <div onClick={() => setDropdownVisible(true)}>
            {t("editor.addlanguage")}
          </div>
        </div>
      )}
      {dropdownVisible && <ComboBoxWidget {...langProps} />}
    </div>
  );
};
export default LanguageSwitcher;
