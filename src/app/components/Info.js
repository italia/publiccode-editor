import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { show } from "../store/infobox";

const ellipsis = (descr) => {
  let partial = descr;
  if (descr.length > MAX_LEN) {
    partial = descr.substring(0, MAX_LEN - 1) + "...";
  }
  return partial;
};

const MAX_LEN = 100;

const InfoBox = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  if (!(props.title || props.description)) return null;
  let { title, description } = props;
  let partial = ellipsis(description);
  return (
    <div className="field_info">
      <small className="form-text text-muted">
        <span>{partial}</span>
        {description.length > MAX_LEN && (
          <span>
            <a
              href="#"
              className="link"
              onClick={() => {
                dispatch(show({ title, description }));
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
