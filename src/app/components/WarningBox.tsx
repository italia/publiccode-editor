import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Icon,
} from "design-react-kit";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
const PUBLIC_CODE_EDITOR_WARNINGS = "PUBLIC_CODE_EDITOR_WARNINGS";

export type Warning = {
  key: string;
  message: string;
};

type WarningBoxProps = {
  warnings: Warning[];
  setWarnings: (data: unknown) => void;
};

const WarningBox = (props: WarningBoxProps): JSX.Element => {
  const { t } = useTranslation();
  const { warnings, setWarnings } = props;

  const [collapseElementOpen, setCollapseElementOpen] = useState("");

  useEffect(() => {
    const warnings = localStorage.getItem(PUBLIC_CODE_EDITOR_WARNINGS);
    if (warnings) {
      setWarnings(JSON.parse(warnings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PUBLIC_CODE_EDITOR_WARNINGS, JSON.stringify(warnings));
  }, [warnings]);

  return (
    <Accordion className="warning-box">
      <AccordionItem>
        <AccordionHeader
          active={collapseElementOpen === "1"}
          onToggle={() =>
            setCollapseElementOpen(collapseElementOpen !== "1" ? "1" : "")
          }
        >
          <Icon
            icon="it-warning-circle"
            color="warning"
            title={t("editor.warnings")}
          />
          &nbsp;{t("editor.warnings")}
        </AccordionHeader>
        <AccordionBody
          active={collapseElementOpen === "1"}
          className="it-list-wrapper"
        >
          {warnings.length ? (
            <ul className="it-list">
              {warnings.map(({ key, message }) => (
                <li key={key}>
                  <div className="list-item">
                    <div className="it-right-zone">
                      <div>
                        <h4 className="text m-0">{key}</h4>
                        <p className="small m-0">{message}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Non ci sono warning</p>
          )}
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
};

export default WarningBox;
