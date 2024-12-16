import { Button, Icon, Input, InputGroup } from "design-react-kit";
import { get } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PublicCode from "../contents/publiccode";
import flattenObject from "../flatten-object-to-record";

interface Props {
  lang: string;
}

export default function EditorFeatures({ lang }: Props): JSX.Element {
  const fieldName = `description.${lang}.features` as keyof PublicCode;

  const { control } = useFormContext<PublicCode>();
  const {
    field,
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

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const errorsRecord = flattenObject(errors as Record<string, { type: string; message: string }>);
    const keys = Object.keys(errorsRecord);
    const isFirstError = keys && keys.length && keys[0] === fieldName

    if (isFirstError) {
      inputRef.current?.focus()
    }

  }, [errors, fieldName, inputRef])


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
          {...field}
          value={currFeat}
          onChange={({ target }) => setCurrFeat(target.value)}
          innerRef={inputRef}
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
