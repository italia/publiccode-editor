import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import available_languages from "../contents/langs";
import ComboBoxWidget from "../form/widgets/ComboBoxWidget";
import CloseButton from "./CloseButton";
import { setLanguages } from "../store/language";

export const LanguageSwitcher = () => {
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const dispatch = useDispatch();
  const languages = useSelector((state) => state.language.languages);

  const { t } = useTranslation();

  const handleChange = (v) => {
    setSelectedLanguage(v);
    if (v && !languages.includes(v)) {
      dispatch(setLanguages([...languages, v]));
    }
    setDropdownVisible(false);
    setSelectedLanguage([]);
  };

  const removeLanguage = (v) => {
    dispatch(setLanguages([...languages.filter((x) => x !== v)]));
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
        return (
          <div key={lng} className="language-switcher__item">
            <div className="language-switcher__item-label">{lng}</div>
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
