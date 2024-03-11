import { useController, useFormContext } from "react-hook-form";
import PublicCode from "../contents/publiccode";
import { useTranslation } from "react-i18next";
import { get } from "lodash";
import { useState } from "react";
import { Button, Icon, Input, InputGroup } from "design-react-kit";

interface Props {
  lang: string;
}

export default function EditorFeatures({ lang }: Props): JSX.Element {
  const { control } = useFormContext<PublicCode>();
  const {
    field: { onChange, value },
    formState: { errors },
  } = useController<PublicCode>({
    control,
    name: `description.${lang}.features`,
    shouldUnregister: true,
  });
  const { t } = useTranslation();
  const features: string[] = value ? (value as string[]) : [];
  const [currFeat, setCurrFeat] = useState<string>("");

  const label = t(`publiccodeyml.description.features.label`);
  const description = t(`publiccodeyml.description.features.description`);
  const errorMessage = get(errors, `description.${lang}.features.message`);

  const addFeature = () => {
    onChange([...features, currFeat.trim()]);
    setCurrFeat("");
  };

  const removeFeature = (feat: string) => {
    onChange(features.filter((elem) => elem !== feat));
  };

  return (
    <div className="form-group">
      <label
        className="active"
        htmlFor={`description.${lang}.features`}
      >{`${label} *`}</label>
      <ul className="list-group list-group-flush">
        {features.map((feat) => (
          <li
            className="list-group-item d-flex justify-content-between align-items-center"
            key={feat}
          >
            {feat}
            <Button
              color="link"
              icon
              onClick={() => removeFeature(feat)}
              size="xs"
            >
              <Icon icon="it-delete" size="sm" title="Remove feature" />
            </Button>
          </li>
        ))}
      </ul>
      <InputGroup>
        <Input
          value={currFeat}
          onChange={({ target }) => setCurrFeat(target.value)}
        />
        <div className="input-group-append">
          <Button
            color="primary"
            disabled={currFeat.trim() === ""}
            onClick={addFeature}
          >
            Add feature
          </Button>
        </div>
      </InputGroup>

      <small className="form-text">{description}</small>
      {errorMessage && (
        <div className="form-feedback just-validate-error-label">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
