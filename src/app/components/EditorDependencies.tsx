import { Button, Icon, Input } from "design-react-kit";
import { get } from "lodash";
import { useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import PublicCode, { defaultDependency } from "../contents/publiccode";

const dependencyTypes = ["open", "proprietary", "hardware"] as const;
const stringFields = ["name", "versionMin", "versionMax", "version"] as const;

type DependencyType = (typeof dependencyTypes)[number];
type DependencyFieldName = `dependsOn.${DependencyType}`;

function DependencyList({ type }: { type: DependencyType }): JSX.Element {
  const fieldName = `dependsOn.${type}` as DependencyFieldName;
  const {
    control,
    formState: { errors },
    register,
    setFocus,
  } = useFormContext<PublicCode>();
  const { append, fields, remove } = useFieldArray<
    PublicCode,
    DependencyFieldName
  >({
    control,
    name: fieldName,
  });
  const { t } = useTranslation();
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const typeLabel = t(`publiccodeyml.dependsOn.${type}.label`);

  const removeDependency = (index: number) => {
    const remainingItems = fields.length - 1;
    remove(index);

    window.requestAnimationFrame(() => {
      if (remainingItems === 0) {
        addButtonRef.current?.focus();
        return;
      }

      const nextIndex = Math.min(index, remainingItems - 1);
      setFocus(`${fieldName}.${nextIndex}.name`);
    });
  };

  return (
    <fieldset className="mt-4">
      <legend className="h6">{typeLabel}</legend>
      {fields.map(({ id }, index) => (
        <fieldset className="border rounded p-3 mb-3" key={id}>
          <legend className="h6 w-auto px-2">
            {typeLabel} {index + 1}
          </legend>
          <div className="row g-3">
            {stringFields.map((subfield) => {
              const inputName = `${fieldName}.${index}.${subfield}` as const;
              const label = t(`publiccodeyml.dependsOn.${subfield}.label`);
              const description = t(
                `publiccodeyml.dependsOn.${subfield}.description`,
              );
              const { ref, ...registration } = register(inputName, {
                setValueAs: (value: string) =>
                  subfield !== "name" && value === "" ? undefined : value,
              });

              return (
                <div
                  className={subfield === "name" ? "col-12" : "col-md-6"}
                  key={subfield}
                >
                  <label
                    className="description-label active"
                    htmlFor={inputName}
                  >
                    {label}
                    {subfield === "name" && " *"}
                  </label>
                  <small
                    className="d-block mb-2"
                    id={`${inputName}-description`}
                  >
                    {description}
                  </small>
                  <Input
                    {...registration}
                    aria-describedby={`${inputName}-description`}
                    aria-label={`${label}, ${typeLabel}, ${index + 1}`}
                    id={inputName}
                    innerRef={ref}
                    label={true}
                    type="text"
                    valid={get(errors, inputName) && false}
                    validationText={get(errors, `${inputName}.message`)}
                  />
                </div>
              );
            })}
            <div className="col-md-6">
              <label
                className="description-label active"
                htmlFor={`${fieldName}.${index}.optional`}
              >
                {t("publiccodeyml.dependsOn.optional.label")}
              </label>
              <small
                className="d-block mb-2"
                id={`${fieldName}.${index}.optional-description`}
              >
                {t("publiccodeyml.dependsOn.optional.description")}
              </small>
              <select
                {...register(`${fieldName}.${index}.optional`, {
                  setValueAs: (value: string) =>
                    value === "" ? undefined : value === "true",
                })}
                aria-describedby={`${fieldName}.${index}.optional-description`}
                aria-label={`${t(
                  "publiccodeyml.dependsOn.optional.label",
                )}, ${typeLabel}, ${index + 1}`}
                className="form-select"
                id={`${fieldName}.${index}.optional`}
              >
                <option value="">{t("editor.form.unset")}</option>
                <option value="true">{t("editor.form.true")}</option>
                <option value="false">{t("editor.form.false")}</option>
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <Button
              aria-label={t("editor.form.removeDependency", {
                number: index + 1,
                type: typeLabel,
              })}
              color="link"
              icon
              onClick={() => removeDependency(index)}
              size="xs"
              type="button"
            >
              <Icon icon="it-delete" size="sm" />
            </Button>
          </div>
        </fieldset>
      ))}
      <Button
        aria-label={`${t("editor.form.addnew")}: ${typeLabel}`}
        color="primary"
        innerRef={addButtonRef}
        onClick={() =>
          append(
            { ...defaultDependency },
            {
              focusName: `${fieldName}.${fields.length}.name`,
              shouldFocus: true,
            },
          )
        }
        type="button"
      >
        {t("editor.form.addnew")}
      </Button>
    </fieldset>
  );
}

export default function EditorDependencies(): JSX.Element {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="depends-on-heading"
      className="mt-4 border border-start-0 border-end-0 py-4"
    >
      <h5 id="depends-on-heading">{t("publiccodeyml.dependsOn.label")}</h5>
      <p>{t("publiccodeyml.dependsOn.description")}</p>
      {dependencyTypes.map((type) => (
        <DependencyList key={type} type={type} />
      ))}
    </section>
  );
}
