import { Button, Icon, Input, Table } from "design-react-kit";
import { get } from "lodash";
import { useController, useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import PublicCode, {
  FundingOrganisation,
  defaultFundingOrganisation,
} from "../contents/publiccode";

const fieldName = "fundedBy" as const;
const subfields = ["name", "uri"] as const satisfies Readonly<
  Array<keyof FundingOrganisation>
>;

export default function EditorFundedBy(): JSX.Element {
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
    <div className="mb-0">
      <div className="position-relative">
        <label className="description-label active">
          {t(`publiccodeyml.${fieldName}.label`)}
        </label>
      </div>
      <div className="ms-2">
        {field.value?.length === 0 ? (
          <p>
            <small>{t("editor.form.noFunders")}</small>
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
                  {t(`publiccodeyml.${fieldName}.uri.label`)}
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
                          type={subfield === "uri" ? "url" : "text"}
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
                      <Icon icon="it-delete" size="sm" title="Remove funder" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Button
          color="secondary"
          outline
          onClick={() => append({ ...defaultFundingOrganisation })}
        >
          {t("editor.form.addnew")}
        </Button>
      </div>
    </div>
  );
}
