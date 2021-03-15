import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from 'react-redux'
import available_languages from "../contents/langs";
import ComboBoxWidget from "../form/widgets/ComboBoxWidget";
import CloseButton from "./CloseButton";
import { setCurrentLanguage, setLanguages } from "../store/language";

export const LanguageSwitcher = () => {
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const dispatch = useDispatch();
  const currentLanguage = useSelector(state => state.language.currentLanguage)
  const languages = useSelector(state => state.language.languages)

  const { t } = useTranslation();

  const handleChange = (v) => {
    setSelectedLanguage(v);
    if (v && !languages.includes(v)) {
      dispatch(setLanguages([...languages, v]));
    }
    setDropdownVisible(false);
    setSelectedLanguage([]);
    dispatch(setCurrentLanguage(v));
  };

  const removeLanguage = (v) => {
    dispatch(setLanguages([...languages.filter((x) => x !== v)]));
    dispatch(setCurrentLanguage(languages[0]));
  };

  const switchLang = (lng) => {
    dispatch(setCurrentLanguage(lng));
    setDropdownVisible(false);
  };

  const langProps = {
    multiple: false,
    input: {
      data: available_languages,
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
