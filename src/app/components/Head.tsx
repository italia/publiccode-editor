import flag from "../../assets/img/Flag.svg";
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

const Head = ({
  onSettingsClick,
}: {
  onSettingsClick: () => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  return (
    <div>
      <Headers className="head-wrapper">
        <Header small type="slim" className="p-0">
          <HeaderContent>
            <HeaderLinkZone aria-label="Navigazione accessoria">
              <HeaderToggler
                onClick={() => {
                  setIsOpenCollapse(!isOpenCollapse);
                }}
              >
                <Icon icon="it-burger" />
              </HeaderToggler>
              <Collapse isOpen={isOpenCollapse} header>
                <LinkList noWrapper>
                  <LinkListItem href="https://yml.publiccode.tools/">
                    {t("editor.needhelp")}
                  </LinkListItem>
                  <LinkListItem href="https://github.com/puzzle/publiccode-editor">
                    {t("editor.source_code")}
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
        <Header small type="center" className="p-0 border-bottom border-light" theme="light">
          <HeaderContent>
            <HeaderBrand>
              <div>
                  <img
                      src={flag}
                      alt="Logo of the Swiss Confederation"
                      height="30"
                  />
                  <span className="fs-6 m-2 p-2 text-black border-start border-light">{t("editor.title")}</span>
              </div>
            </HeaderBrand>
          </HeaderContent>
        </Header>
      </Headers>
    </div>
  );
};

export default Head;
