import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../store";
import { show } from "../store/infobox";
import PropTypes from "prop-types";

const ellipsis = (descr) => {
  let partial = descr;
  if (descr.length > MAX_LEN) {
    partial = descr.substring(0, MAX_LEN - 1) + "...";
  }
  return partial;
};

const MAX_LEN = 100;

const InfoBox = (props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { inputTitle, description } = props;
  const translationReadyLabel = t(`pc:${inputTitle}.label`);
  // some components use Info to display some constraint
  // e.g. max/minLength info
  const translationReadyDescription = inputTitle
    ? t(`pc:${inputTitle.replace(/\[[0-9]+\]/,'')}.description`)
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

InfoBox.propTypes = {
  inputTitle: PropTypes.string,
  description: PropTypes.string,
};
