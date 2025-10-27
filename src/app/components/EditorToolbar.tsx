import { Button } from "design-react-kit";
import { useTranslation } from "react-i18next";

interface Props {
  trigger: () => void;
  reset: () => void;
  languages: Array<string>;
  yamlLoaded: boolean;
}

const EditorToolbar = (props: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="content__toolbar border-top">
      <div className="gap-2 d-flex justify-content-center mx-auto col-md-6">
        <Button
          onClick={() => props.reset()}
          disabled={!props.languages || props.languages.length === 0}
          className="content__toolbar-reset-button"
        >
          {t("editor.form.reset.button")}
        </Button>
        <Button
          color="primary"
          disabled={!props.languages || props.languages.length === 0}
          onClick={props.trigger}
          className="content__toolbar-primary-button"
        >
          {props.yamlLoaded
            ? t("editor.form.validate.button")
            : t("editor.form.generate")}
        </Button>
      </div>
    </div>
  );
};

export default EditorToolbar;
