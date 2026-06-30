import { upperFirst } from "lodash";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Multiselect } from "react-widgets";
import { RenderItemProp } from "react-widgets/cjs/List";
import { allLangs } from "../../i18n";
import { useLanguagesStore } from "../lib/store";
import { createAccessibleMultiselectTagList } from "./AccessibleMultiselectTagList";

interface Language {
  value: string;
  text: string;
}

const renderListItem = (item: Language) => <span>{upperFirst(item.text)}</span>;

const renderTagValue = ({ item }: { item: Language }) => (
  <span>{upperFirst(item.text)}</span>
);

export const PubliccodeYmlLanguages = (): JSX.Element => {
  const { languages, setLanguages } = useLanguagesStore();
  const { t } = useTranslation();

  const handleChange = (newSelection: Language[]) => {
    if (newSelection.length) {
      setLanguages(newSelection.map((l) => l.value));
    }
  };

  // Stable tag list; reads the latest languages via a ref so its identity does
  // not change (which would remount the input and steal focus). Keeps the
  // "don't remove the last language" guard.
  const languagesRef = useRef(languages);
  languagesRef.current = languages;
  const TagList = useMemo(
    () =>
      createAccessibleMultiselectTagList<Language>((item) => {
        const next = languagesRef.current.filter((v) => v !== item.value);
        if (next.length) setLanguages(next);
      }),
    [setLanguages],
  );

  return (
    <div className="language-switcher">
      <Multiselect
        onChange={handleChange}
        data={allLangs() as Language[]}
        dataKey="value"
        textField="text"
        filter="contains"
        showPlaceholderWithValues={true}
        placeholder={t("editor.addlanguage")}
        renderListItem={renderListItem as RenderItemProp<Language>} //wa for tsc
        renderTagValue={renderTagValue}
        value={languages}
        tagListComponent={TagList}
      />
    </div>
  );
};
export default PubliccodeYmlLanguages;
