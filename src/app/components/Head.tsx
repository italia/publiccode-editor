import {
  Button,
  Collapse,
  Header,
  HeaderBrand,
  HeaderContent,
  HeaderLinkZone,
  HeaderRightZone,
  Headers,
  HeaderToggler,
  Icon,
  LinkList,
  LinkListItem,
} from "design-react-kit";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Head = ({ onSettingsClick }: { onSettingsClick: () => void }): JSX.Element => {
  const { t } = useTranslation();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  return (
    <div>
      <Headers className="head-wrapper">
        <Header small type="slim" className="p-0">
          <HeaderContent>
            <HeaderBrand>
              <span className="text-white fs-4 fw-bold">{t("editor.title")}</span>
            </HeaderBrand>
            <HeaderLinkZone aria-label="Navigazione accessoria">
              <HeaderToggler
                onClick={() => {
                  setIsOpenCollapse(!isOpenCollapse);
                }}
              >
                <span className="text-white">{t("editor.title")}</span>
                <Icon icon="it-expand" />
              </HeaderToggler>
              <Collapse isOpen={isOpenCollapse} header>
                <LinkList noWrapper>
                  <LinkListItem href="https://yml.publiccode.tools/">
                    Aiuto?
                  </LinkListItem>
                  <LinkListItem href="https://github.com/italia/publiccode-editor">
                    Codice sorgente
                  </LinkListItem>
                </LinkList>
              </Collapse>
            </HeaderLinkZone>
            <HeaderRightZone>
              <Button
                color="white"
                size="sm"
                className="ms-4"
                icon
                onClick={() => onSettingsClick()}
              >
                <Icon color="white" size="sm" icon="it-settings" />
              </Button>
            </HeaderRightZone>
          </HeaderContent>
        </Header>
      </Headers>
    </div>
  );
};

export default Head;
