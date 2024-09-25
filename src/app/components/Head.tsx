import {
  documentationUrl,
} from "../contents/constants";

import { useTranslation } from "react-i18next";
import { Dropdown, DropdownMenu, DropdownToggle, Icon, LinkList, LinkListItem } from "design-react-kit";
import { formatLanguageLabel, getSupportedLanguages } from "../../i18n";

export const Head = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const supportedLanguages = getSupportedLanguages()
  const onClick = (value: string) => () => i18n.changeLanguage(value)

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
        <div className="pb-1">
          <Dropdown className="">
            <DropdownToggle
              caret
              color="primary"
              tag="a"
            >
              {formatLanguageLabel(i18n.language)}
            </DropdownToggle>
            <DropdownMenu>
              <LinkList>
                {supportedLanguages.map(l =>
                  <LinkListItem key={l} large={false} inDropdown onClick={onClick(l)}><div style={{ textAlign: "justify" }}>{formatLanguageLabel(l)}</div></LinkListItem>
                )}
              </LinkList>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Head;
