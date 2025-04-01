import { upperFirst } from 'lodash';
import { useTranslation } from "react-i18next";
import { Multiselect } from "react-widgets";
import { RenderItemProp } from 'react-widgets/cjs/List';
import { allLangs } from '../../i18n';
import { useLanguagesStore } from '../lib/store';

interface Language {
  value: string;
  text: string;
}

const renderListItem = (item: Language) => (
  <span>
    {upperFirst(item.text)}
  </span>
)

const renderTagValue = ({ item }: { item: Language }) => (
  <span>
    {upperFirst(item.text)}
  </span>
)

export const PubliccodeYmlLanguages = (): JSX.Element => {
  const { languages, setLanguages } = useLanguagesStore();
  const { t } = useTranslation();

  const handleChange = (newSelection: Language[]) => {
    if (newSelection.length != 0) {
      setLanguages(newSelection.map(l => l.value));
    }
  };

  return (
    <div className="language-switcher">
      <Multiselect
        onChange={handleChange}
        data={allLangs() as Language[]}
        dataKey="value"
        textField="text"
        filter="contains"
        showPlaceholderWithValues={true}
        placeholder={t('editor.addlanguage')}
        renderListItem={renderListItem as RenderItemProp<Language>} //wa for tsc
        renderTagValue={renderTagValue}
        value={languages as unknown as Language[]}
      />
    </div>
  );
};
export default PubliccodeYmlLanguages;
