import { Icon } from "design-react-kit";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
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
    <div>
      <h3>
        <Icon
          icon='it-warning-circle'
          color='warning'
          title={t("editor.warnings")}
        />
        &nbsp;{t("editor.warnings")}
      </h3>
      <div className='it-list-wrapper'>
        {warnings.length ? (
          <ul className='it-list'>
            <li>
              {warnings.map(({ key, message }) => (
                <li key={key}>
                  <div className='list-item'>
                    <div className='it-right-zone'>
                      <div>
                        <h4 className='text m-0'>{key}</h4>
                        <p className='small m-0'>{message}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </li>
          </ul>
        ) : (
          <p>Non ci sono warning</p>
        )}
      </div>
    </div>
  );
};

export default WarningBox;
