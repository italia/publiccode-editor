import { upperFirst } from 'lodash';
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import { Multiselect } from "react-widgets";
import { RenderItemProp } from 'react-widgets/cjs/List';
import { allLangs } from '../../i18n';
import { useAppDispatch } from "../store";
import { getPubliccodeYmlLanguages, setPubliccodeYmlLanguages } from "../store/publiccodeYmlLanguages";

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
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const publiccodeYmlLanguages = useSelector(getPubliccodeYmlLanguages)

  const handleChange = (newSelection: Language[]) => {
    if (newSelection.length != 0) {
      dispatch(setPubliccodeYmlLanguages(newSelection.map(l => l.value)));
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
        value={publiccodeYmlLanguages as Language[]}
      />
    </div>
  );
};
export default PubliccodeYmlLanguages;
