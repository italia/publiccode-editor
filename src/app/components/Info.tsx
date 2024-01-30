import { useTranslation } from "react-i18next";

interface Props {
  inputTitle: string
  description: string
}

const InfoBox = ({inputTitle, description}: Props): JSX.Element => {
  const { t } = useTranslation();

  // some components use Info to display some constraint
  // e.g. max/minLength info
  const translationReadyDescription = inputTitle
    ? t(`publiccodeyml.${inputTitle.replace(/\[[0-9]+\]/,'')}.description`)
    : description;

  return (
    <div className="field_info">
      <small className="form-text text-muted">
        <span>{translationReadyDescription}</span>
      </small>
    </div>
  );
};

export default InfoBox;
