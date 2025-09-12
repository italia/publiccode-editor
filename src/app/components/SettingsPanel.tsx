import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Icon,
  LinkList,
  LinkListItem,
} from "design-react-kit";
import { useTranslation } from "react-i18next";
import { formatLanguageLabel, getSupportedLanguages } from "../../i18n";
import { useCountryStore } from "../lib/store";

export default function SettingsPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  const { t, i18n } = useTranslation();
  const supportedLanguages = getSupportedLanguages();
  const { countrySections, setCountrySections } = useCountryStore();
  const countryOptions: ("all" | "none" | "italy")[] = ["all", "none", "italy"];
  const currentCountry = countrySections?.[0] ?? "none";

  return (
    <div className={`settings-panel ${isOpen ? "show" : ""}`}>
      <div className="settings-panel__overlay" onClick={onClose}></div>
      <div className="settings-panel__content shadow-lg">
        <h3 className="mt-4 mb-5">{t("editor.settings.title")}</h3>
        <Button className="position-absolute top-0 end-0" onClick={onClose}>
          <Icon size="lg" icon="it-close" />
        </Button>
        <Dropdown className="me-3">
          <DropdownToggle caret color="primary">
            {t("editor.settings.language")}
          </DropdownToggle>
          <DropdownMenu>
            <LinkList>
              {supportedLanguages.map((l) => (
                <LinkListItem
                  key={l}
                  large={false}
                  inDropdown
                  onClick={() => i18n.changeLanguage(l)}
                  style={{
                    cursor: "pointer",
                    color: "black",
                  }}
                >
                  {formatLanguageLabel(l)}
                </LinkListItem>
              ))}
            </LinkList>
          </DropdownMenu>
        </Dropdown>
        <div className="mt-4">
          <h5 className="mb-3">{t("editor.settings.countrySections")}</h5>
          <Dropdown className="me-3">
            <DropdownToggle caret color="primary">
              {t(`editor.settings.countryOptions.${currentCountry}`)}
            </DropdownToggle>
          <DropdownMenu>
            <LinkList>
              {countryOptions.map((opt) => (
                <LinkListItem
                  key={opt}
                  large={false}
                  inDropdown
                  onClick={() => setCountrySections([opt])}
                  style={{
                    cursor: "pointer",
                    color: "black",
                  }}
                >
                  {t(`editor.settings.countryOptions.${opt}`)}
                </LinkListItem>
              ))}
            </LinkList>
          </DropdownMenu>
        </Dropdown>
        </div>
      </div>
    </div>
  );
}
