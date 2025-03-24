import {
  Col,
  Collapse,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Header,
  HeaderBrand,
  HeaderContent,
  HeaderRightZone,
  Headers,
  HeaderSocialsZone,
  HeaderToggler,
  Icon,
  LinkList,
  LinkListItem,
  Nav,
  NavItem,
  NavLink,
  Row,
} from "design-react-kit";
import { useTranslation } from "react-i18next";
import { formatLanguageLabel, getSupportedLanguages } from "../../i18n";
import { useState } from "react";

const Head = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const supportedLanguages = getSupportedLanguages();
  const onClick = (value: string) => () => i18n.changeLanguage(value);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);

  return (
    <div>
      <Headers>
        <Header type="slim">
          <HeaderContent>
            <HeaderBrand responsive>
              <a
                href="https://innovazione.gov.it/dipartimento/"
                target="_blank"
              >
                {t("editor.owner")}
              </a>
              <span> + </span>
              <a href="https://www.agid.gov.it/" target="_blank">
                {t("editor.additional_owner")}
              </a>
            </HeaderBrand>
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
        <div className="it-nav-wrapper">
          <Header theme="" type="center">
            <HeaderContent>
              <HeaderBrand
                iconAlt="it code circle icon"
                iconName="it-code-circle"
              >
                <h2>{t("editor.title")}</h2>
              </HeaderBrand>
              <HeaderRightZone>
                <HeaderSocialsZone label="Seguici su">
                  <ul className="list-inline text-start social">
                    <li className="list-inline-item">
                      <a
                        aria-label="Feed"
                        href="https://developers.italia.it/it/news/feed.atom"
                        target="_blank"
                      >
                        <Icon icon="it-rss" />
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a
                        aria-label="Github"
                        href="https://github.com/italia"
                        target="_blank"
                      >
                        <Icon icon="it-github" />
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a
                        aria-label="Mastodon"
                        href="https://mastodon.uno/@developersITA"
                        target="_blank"
                      >
                        <Icon icon="it-mastodon" />
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a
                        aria-label="Twitter"
                        href="https://twitter.com/developersITA"
                        target="_blank"
                      >
                        <Icon icon="it-twitter" />
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a
                        aria-label="Medium"
                        href="https://medium.com/developers-italia"
                        target="_blank"
                      >
                        <Icon icon="it-medium" />
                      </a>
                    </li>
                  </ul>
                </HeaderSocialsZone>
              </HeaderRightZone>
            </HeaderContent>
          </Header>
          <Header theme="" type="navbar">
            <HeaderContent expand="lg">
              <HeaderToggler
                aria-controls="nav1"
                aria-expanded={isOpenCollapse}
                aria-label="Toggle navigation"
                isOpen={isOpenCollapse}
                onClick={() => setIsOpenCollapse(!isOpenCollapse)}
              >
                <Icon icon="it-burger" />
              </HeaderToggler>
              <Collapse
                header
                navbar
                isOpen={isOpenCollapse}
                onOverlayClick={() => setIsOpenCollapse(false)}
              >
                <div className="menu-wrapper">
                  <Nav navbar>
                    <NavItem>
                      <NavLink href="https://yml.publiccode.tools/">
                        <span>Aiuto?</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="https://github.com/italia/publiccode-editor">
                        <span>Codice sorgente</span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
              </Collapse>
            </HeaderContent>
          </Header>
        </div>
      </Headers>
    </div>
  );
};

export default Head;
