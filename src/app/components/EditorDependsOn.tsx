import {
  Button,
  Icon,
  Input,
  Table,
  UncontrolledTooltip,
} from "design-react-kit";
import { get } from "lodash";
import { useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import PublicCode, { defaultDependency } from "../contents/publiccode";

const dependencyTypes = ["open", "proprietary", "hardware"] as const;
const stringFields = ["name", "versionMin", "versionMax", "version"] as const;

type DependencyType = (typeof dependencyTypes)[number];
type DependencyFieldName = `dependsOn.${DependencyType}`;
type DependencySubfield = (typeof stringFields)[number] | "optional";

function DescriptionTooltip({
  description,
  label,
}: {
  description: string;
  label: string;
}): JSX.Element {
  const { t } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        aria-label={`${t("editor.form.moreInfo")}: ${label}`}
        className="p-0 ms-2"
        color="link"
        icon
        innerRef={buttonRef}
        size="xs"
        type="button"
      >
        <Icon className="info-icon" icon="it-info-circle" />
      </Button>
      <UncontrolledTooltip placement="bottom" target={buttonRef}>
        {description}
      </UncontrolledTooltip>
    </>
  );
}

function DependencyFieldHeader({
  subfield,
}: {
  subfield: DependencySubfield;
}): JSX.Element {
  const { t } = useTranslation();
  const label = t(`publiccodeyml.dependsOn.${subfield}.label`);

  return (
    <th className="align-top">
      <div className="d-flex align-items-start">
        <span>
          {label}
          {subfield === "name" && " *"}
        </span>
        <DescriptionTooltip
          description={t(`publiccodeyml.dependsOn.${subfield}.description`)}
          label={label}
        />
      </div>
    </th>
  );
}

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
    <div className="form-group mt-4">
      <fieldset>
        <div>
          <legend className="editor-subsection-title">{typeLabel}</legend>
        </div>
        {fields.length === 0 ? (
          <p>
            <small>{t("editor.form.noDependencies")}</small>
          </p>
        ) : (
          <Table responsive>
            <thead>
              <tr>
                <th className="align-top">#</th>
                {stringFields.map((subfield) => (
                  <DependencyFieldHeader key={subfield} subfield={subfield} />
                ))}
                <DependencyFieldHeader subfield="optional" />
                <th></th>
              </tr>
            </thead>
            <tbody>
              {fields.map(({ id }, index) => (
                <tr key={id}>
                  <th scope="row">{index + 1}</th>
                  {stringFields.map((subfield) => {
                    const inputName =
                      `${fieldName}.${index}.${subfield}` as const;
                    const label = t(
                      `publiccodeyml.dependsOn.${subfield}.label`,
                    );
                    const { ref, ...registration } = register(inputName, {
                      setValueAs: (value: string) =>
                        subfield !== "name" && value === "" ? undefined : value,
                    });

                    return (
                      <td key={subfield}>
                        <Input
                          {...registration}
                          aria-label={`${label}, ${typeLabel}, ${index + 1}`}
                          id={inputName}
                          innerRef={ref}
                          label={true}
                          type="text"
                          valid={get(errors, inputName) && false}
                          validationText={get(errors, `${inputName}.message`)}
                        />
                      </td>
                    );
                  })}
                  <td>
                    <select
                      {...register(`${fieldName}.${index}.optional`, {
                        setValueAs: (value: string) =>
                          value === "" ? undefined : value === "true",
                      })}
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
                  </td>
                  <td>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
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
    </div>
  );
}

export default function EditorDependsOn(): JSX.Element {
  const { t } = useTranslation();
  const label = t("publiccodeyml.dependsOn.label");

  return (
    <section
      aria-labelledby="depends-on-heading"
      className="editor-section"
    >
      <div className="d-flex align-items-start justify-content-between">
        <h5 className="editor-section-title mb-0" id="depends-on-heading">
          {label}
        </h5>
        <DescriptionTooltip
          description={t("publiccodeyml.dependsOn.description")}
          label={label}
        />
      </div>
      {dependencyTypes.map((type) => (
        <DependencyList key={type} type={type} />
      ))}
    </section>
  );
}
