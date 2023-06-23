import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../store";
import available_languages from "../contents/langs";
import CloseButton from "./CloseButton";
import { setLanguages } from "../store/language";
import { Combobox } from "react-widgets";

export const LanguageSwitcher = () => {
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const dispatch = useAppDispatch();
  const languages = useAppSelector((state) => state.language.languages);

  const { t } = useTranslation();

  const handleChange = (l) => {
    const v = l.value;
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
    name: "language-switcher",
    onChange: handleChange,
    value: selectedLanguage,
    data: available_languages,
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
      {dropdownVisible && (
        <Combobox
          {...langProps}
          valueField="value"
          textField="text"
          filter="contains"
        />
      )}
    </div>
  );
};
export default LanguageSwitcher;
