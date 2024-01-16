import { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../store";
import { getPubliccodeYmlLanguages, setPubliccodeYmlLanguages } from "../store/publiccodeYmlLanguages";
import { Multiselect } from "react-widgets";
import { useSelector } from 'react-redux';
import { allLangs } from '../../i18n';
import { upperFirst } from 'lodash';

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
  const { i18n, t } = useTranslation();
  const publiccodeYmlLanguages = useSelector(getPubliccodeYmlLanguages)

  useEffect(() => {
    dispatch(setPubliccodeYmlLanguages([i18n.language]));
    console.log(i18n.language)
  }, [dispatch, i18n.language]);

  const handleChange = (newSelection: Language[]) => {
    if (newSelection.length != 0){
      dispatch(setPubliccodeYmlLanguages(newSelection.map(l => l.value)));
    }
  };

  return (
    <div className="language-switcher">
      <Multiselect
        onChange={handleChange}
        data={allLangs()}
        dataKey="value"
        textField="text"
        filter="contains"
        showPlaceholderWithValues={true}
        placeholder={t('editor.addlanguage')}
        renderListItem={renderListItem}
        renderTagValue={renderTagValue}
        value={publiccodeYmlLanguages}
      />
    </div>
  );
};
export default PubliccodeYmlLanguages;
