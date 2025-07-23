import { Button, Icon, Input, Table } from "design-react-kit";
import { get } from "lodash";
import { useController, useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import PublicCode from "../contents/publiccode";

const fieldName = "maintenance.contractors";
const subfields = ["name", "until", "email", "website"] as const;
const setValueAsUndefinedFields = new Set(["email", "website"]);

export default function EditorContractors(): JSX.Element {
  const { control, register } = useFormContext<PublicCode, typeof fieldName>();
  const { append, fields, remove } = useFieldArray<
    PublicCode,
    typeof fieldName
  >({
    control,
    name: fieldName,
  });
  const {
    field,
    formState: { errors },
  } = useController<PublicCode, typeof fieldName>({
    control,
    name: fieldName,
  });
  const { t } = useTranslation();

  return (
    <div className="form-group">
      <fieldset>
        <div className="position-relative">
          <legend>{t(`publiccodeyml.${fieldName}.label`)}</legend>
        </div>
        {field.value?.length === 0 ? (
          <p>
            <small>{t("editor.form.noContractors")}</small>
          </p>
        ) : (
          <Table responsive>
            <thead>
              <tr>
                <th className="align-top">#</th>
                <th className="align-top">
                  {t(`publiccodeyml.${fieldName}.name.label`)} *
                </th>
                <th className="align-top">
                  {t(`publiccodeyml.${fieldName}.until.label`)} *
                </th>
                <th className="align-top">
                  {t(`publiccodeyml.${fieldName}.email.label`)}
                </th>
                <th>{t(`publiccodeyml.${fieldName}.website.label`)}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {fields.map(({ id }, index) => (
                <tr key={id}>
                  <th scope="row">{index + 1}</th>
                  {subfields.map((subfield) => {
                    const { ref, ...reg } = register(
                      `${fieldName}.${index}.${subfield}`,
                      {
                        setValueAs: (value: string | Date) => setValueAsUndefinedFields.has(subfield) && value === "" ? undefined : value
                      }
                    );

                    return (
                      <td key={subfield}>
                        <Input
                          {...reg}
                          innerRef={ref}
                          type={subfield === "until" ? "date" : "text"}
                          valid={
                            get(errors, `${fieldName}.${index}.${subfield}`) &&
                            false
                          }
                          validationText={get(
                            errors,
                            `${fieldName}.${index}.${subfield}.message`
                          )}
                        />
                      </td>
                    );
                  })}
                  <td>
                    <Button
                      color="link"
                      icon
                      onClick={() => remove(index)}
                      size="xs"
                    >
                      <Icon icon="it-delete" size="sm" title="Remove feature" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Button
          color="primary"
          onClick={() =>
            append({ name: "", until: "", email: "", website: "" })
          }
        >
          {t("editor.form.addnew")}
        </Button>
      </fieldset>
    </div>
  );
}
