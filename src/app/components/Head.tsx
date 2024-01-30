import {
  documentationUrl,
} from "../contents/constants";

import { useTranslation } from "react-i18next";
import { Icon } from "design-react-kit";

export const Head = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="content__head">
      <div className="content__head__title">{t("editor.title")}</div>
      <div className="content__head__help">
        <div>
          <a href={documentationUrl} rel="noopener noreferrer" target="_blank">
            <Icon icon="it-info-circle" />&nbsp;
            {t("editor.needhelp")}
          </a>
        </div>
        <div>
          <a
            href="https://github.com/italia/publiccode-editor"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon icon="it-github" />
            {t("editor.source_code")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Head;
