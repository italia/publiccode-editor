import {
  Col,
  Collapse,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
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
  Row,
} from "design-react-kit";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatLanguageLabel, getSupportedLanguages } from "../../i18n";

const Head = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const supportedLanguages = getSupportedLanguages();
  const onClick = (value: string) => () => i18n.changeLanguage(value);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);

  return (
    <div>
      <Headers className="head-wrapper">
        <Header small type="slim" className="p-0">
          <HeaderContent>
            <HeaderBrand >
              <span className="text-white">{t("editor.title")}</span>
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
                  <LinkListItem href="https://yml.publiccode.tools/">Aiuto?</LinkListItem>
                  <LinkListItem href="https://github.com/italia/publiccode-editor">Codice sorgente</LinkListItem>
                </LinkList>
              </Collapse>
            </HeaderLinkZone>
            <HeaderRightZone>
              <Dropdown inNavbar id="dropdown-language">
                <DropdownToggle caret>
                  {formatLanguageLabel(i18n.language)}
                </DropdownToggle>
                <DropdownMenu>
                  <Row>
                    <Col size="12">
                      <LinkList>
                        {supportedLanguages.map((l) => (
                          <LinkListItem
                            key={l}
                            large={false}
                            inDropdown
                            onClick={onClick(l)}
                            style={{
                              cursor: "pointer",
                              color: "black",
                            }}
                          >
                            {formatLanguageLabel(l)}
                          </LinkListItem>
                        ))}
                      </LinkList>
                    </Col>
                  </Row>
                </DropdownMenu>
              </Dropdown>
            </HeaderRightZone>
          </HeaderContent>
        </Header>
      </Headers>
    </div>
  );
};

export default Head;
