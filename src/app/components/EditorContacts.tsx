import {
  Button,
  Icon,
  Input,
  Table,
  UncontrolledTooltip,
} from "design-react-kit";
import { get } from "lodash";
import { useController, useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import PublicCode from "../contents/publiccode";
import { useRef } from "react";

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
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="form-group">
      <fieldset className="editor-contacts">
        <div className="position-relative">
          <legend>{t(`publiccodeyml.${fieldName}.label`)}</legend>
          <Button innerRef={buttonRef} className="info-icon-wrapper">
            <Icon icon="it-info-circle" className="info-icon mb-2" />
          </Button>
          <UncontrolledTooltip placement="bottom" target={buttonRef}>
            {t(`publiccodeyml.${fieldName}.affiliation.description`)}
          </UncontrolledTooltip>
        </div>
        {field.value?.length === 0 ? (
          <p>
            <small>Nessun contatto presente</small>
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
                  {t(`publiccodeyml.${fieldName}.email.label`)}
                </th>
                <th className="align-top">
                  {t(`publiccodeyml.${fieldName}.phone.label`)}
                </th>
                <th className="align-top">
                  {t(`publiccodeyml.${fieldName}.affiliation.label`)}
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
    </div>
  );
}
