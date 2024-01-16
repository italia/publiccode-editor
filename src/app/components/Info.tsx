import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../store";
import { show } from "../store/infobox";

const ellipsis = (descr: string) => {
  let partial = descr;
  if (descr.length > MAX_LEN) {
    partial = descr.substring(0, MAX_LEN - 1) + "...";
  }
  return partial;
};

const MAX_LEN = 100;

interface Props {
  inputTitle: string
  description: string
}

const InfoBox = ({inputTitle, description}: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const translationReadyLabel = t(`publiccodeyml.${inputTitle}.label`);
  // some components use Info to display some constraint
  // e.g. max/minLength info
  const translationReadyDescription = inputTitle
    ? t(`publiccodeyml.${inputTitle.replace(/\[[0-9]+\]/,'')}.description`)
    : description;

  const partial = ellipsis(translationReadyDescription);
  return (
    <div className="field_info">
      <small className="form-text text-muted">
        <span>{partial}</span>
        {translationReadyDescription.length > MAX_LEN && (
          <span>
            <a
              href="#"
              className="link"
              onClick={() => {
                dispatch(
                  show({
                    title: translationReadyLabel,
                    description: translationReadyDescription,
                  })
                );
              }}
            >
              {t("editor.readmore")}
            </a>
          </span>
        )}
      </small>
    </div>
  );
};

export default InfoBox;
