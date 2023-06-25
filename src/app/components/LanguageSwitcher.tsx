import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../store";
import available_languages from "../contents/langs";
import CloseButton from "./CloseButton";
import { setLanguages } from "../store/language";
import { DropdownList } from "react-widgets";

export const LanguageSwitcher = (): JSX.Element => {
  const [selectedLanguage, setSelectedLanguage] = useState<string|undefined>();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dispatch = useAppDispatch();
  const languages = useAppSelector((state) => state.language.languages);
  const { t } = useTranslation();

  const handleChange = (l?: { text: string; value: string }) => {
    if (l !== undefined) {
      const v = l.value;
      if (!languages.includes(v)) {
        dispatch(setLanguages([...languages, v]));
      }
      setSelectedLanguage(undefined);
    }
    setDropdownVisible(false);
  };

  const removeLanguage = (v: string) => {
    dispatch(setLanguages([...languages.filter((x) => x !== v)]));
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
        <DropdownList
          name="language-switcher"
          onChange={handleChange}
          data={available_languages}
          dataKey="value"
          textField="text"
          filter="contains"
          open
          value={selectedLanguage}
        />
      )}
    </div>
  );
};
export default LanguageSwitcher;
