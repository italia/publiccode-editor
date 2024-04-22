import { Button, Icon, Input, Table } from "design-react-kit";
import { get } from "lodash";
import { useController, useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import PublicCode from "../contents/publiccode";

const fieldName = "maintenance.contacts";
const subfields = ["name", "email", "phone", "affiliation"] as const;

export default function EditorContacts(): JSX.Element {
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
    <fieldset>
      <legend>{t(`publiccodeyml.${fieldName}.label`)}</legend>
      {field.value?.length === 0 ? null : (
        <Table responsive>
          <thead>
            <tr>
              <th className="align-top">#</th>
              <th className="align-top">
                {t(`publiccodeyml.${fieldName}.name.label`)}
              </th>
              <th className="align-top">
                {t(`publiccodeyml.${fieldName}.email.label`)}
              </th>
              <th className="align-top">
                {t(`publiccodeyml.${fieldName}.phone.label`)}
              </th>
              <th>
                <div>{t(`publiccodeyml.${fieldName}.affiliation.label`)}</div>
                <small>
                  {t(`publiccodeyml.${fieldName}.affiliation.description`)}
                </small>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {fields.map(({ id }, index) => (
              <tr key={id}>
                <th scope="row">{index + 1}</th>
                {subfields.map((subfield) => {
                  const { ref, ...reg } = register(
                    `${fieldName}.${index}.${subfield}`
                  );

                  return (
                    <td key={subfield}>
                      <Input
                        {...reg}
                        innerRef={ref}
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
          append({ name: "", email: "", phone: "", affiliation: "" })
        }
      >
        {t("editor.form.addnew")}
      </Button>
    </fieldset>
  );
}
