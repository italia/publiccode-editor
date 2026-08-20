import { Button, Icon, Table, UncontrolledTooltip } from "design-react-kit";
import { get } from "lodash";
import { useRef } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Combobox } from "react-widgets";
import PublicCode, {
  defaultSupport,
  supportsAliases,
} from "../contents/publiccode";

const fieldName = "supports" as const;

export default function EditorSupports(): JSX.Element {
  const { t } = useTranslation();

  const { control } = useFormContext<PublicCode, typeof fieldName>();
  const { append, fields, remove } = useFieldArray<
    PublicCode,
    typeof fieldName
  >({
    control,
    name: fieldName,
  });

  const label = t(`publiccodeyml.${fieldName}.label`);
  const description = t(`publiccodeyml.${fieldName}.description`);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="mb-0">
      <div className="position-relative">
        <label className="description-label active">{label}</label>
        <Button
          type="button"
          innerRef={buttonRef}
          className="info-icon-wrapper"
          aria-label={`${t("editor.form.moreInfo")}: ${label}`}
        >
          <Icon icon="it-info-circle" className="info-icon mb-2" />
        </Button>
        <UncontrolledTooltip placement="bottom" target={buttonRef}>
          {description}
        </UncontrolledTooltip>
      </div>
      <div className="ms-2">
        {fields.length === 0 ? (
          <p>
            <small>{t("editor.noSupports")}</small>
          </p>
        ) : (
          // NOTE: not `responsive`: its overflow container would clip the
          // Combobox dropdown popup.
          <Table>
            <thead>
              <tr>
                <th className="align-top">#</th>
                <th className="align-top">
                  {t(`publiccodeyml.${fieldName}.id.label`)} *
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {fields.map(({ id }, index) => (
                <tr key={id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <Controller
                      control={control}
                      name={`${fieldName}.${index}.id`}
                      render={({ field, formState: { errors } }) => (
                        <>
                          <Combobox
                            data={[...supportsAliases]}
                            dataKey="value"
                            textField="text"
                            value={field.value ?? ""}
                            onChange={(value) =>
                              field.onChange(
                                typeof value === "string"
                                  ? value
                                  : value.value,
                              )
                            }
                            onBlur={field.onBlur}
                            hideEmptyPopup
                            placeholder={t(
                              `publiccodeyml.${fieldName}.id.placeholder`,
                            )}
                            inputProps={{
                              "aria-label": t(
                                `publiccodeyml.${fieldName}.id.label`,
                              ),
                            }}
                          />
                          {get(
                            errors,
                            `${fieldName}.${index}.id.message`,
                          ) && (
                            <div className="form-feedback just-validate-error-label">
                              {get(errors, `${fieldName}.${index}.id.message`)}
                            </div>
                          )}
                        </>
                      )}
                    />
                  </td>
                  <td>
                    <Button
                      color="link"
                      icon
                      onClick={() => remove(index)}
                      size="xs"
                    >
                      <Icon
                        icon="it-delete"
                        size="sm"
                        title={t("editor.form.remove")}
                      />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Button
          color="primary"
          onClick={() => append({ ...defaultSupport })}
        >
          {t("editor.form.addnew")}
        </Button>
      </div>
    </div>
  );
}
