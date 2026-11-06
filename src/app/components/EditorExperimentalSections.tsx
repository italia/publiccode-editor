import { useTranslation } from "react-i18next";
import { LATEST_VERSION } from "../contents/publiccode";
import { sectionsForm } from "../lib/sections";
import type {
  CountryExtension,
  FormField,
} from "../../vendor/publiccode-schema/src";
import EditorBoolean from "./EditorBoolean";
import EditorDate from "./EditorDate";
import EditorInput from "./EditorInput";
import EditorSection from "./EditorSection";
import EditorSelect from "./EditorSelect";

type Props = {
  packages: CountryExtension[];
  version?: string;
};

// The experimental sections of country packages (lib/sections.ts), built
// from their form schema with the editor's field components. Field names are
// the YAML paths (nld.example), translations are the package's own.
export default function EditorExperimentalSections({
  packages,
  version,
}: Props): JSX.Element {
  const { t } = useTranslation();

  return (
    <>
      {packages.map((pkg) => {
        const form = sectionsForm(pkg, version || LATEST_VERSION);

        return form.groups
          .filter((g) => g.experimental && g.section)
          .map((g) => (
            <EditorSection key={g.id} title={t(g.i18n)}>
              <div className="alert alert-warning" role="alert">
                {t("countrySpecificSection.experimental")}
              </div>
              <Fields fields={form.fields} parent={g.section as string} />
            </EditorSection>
          ));
      })}
    </>
  );
}

function Fields({
  fields,
  parent,
}: {
  fields: FormField[];
  parent: string;
}): JSX.Element {
  const { t } = useTranslation();

  return (
    <>
      {fields
        .filter((f) => f.parent === parent)
        .map((f) => {
          // Typed against PublicCode, which doesn't know these sections.
          const name = f.path as never;
          const common = {
            required: f.required,
            deprecated: Boolean(f.deprecated),
          };

          switch (f.widget) {
            case "fieldset":
              return (
                <div className="mt-4" key={f.path}>
                  <h5 className="editor-subsection-title">
                    {t(`${f.i18n}.label`)}
                  </h5>
                  <Fields fields={fields} parent={f.path} />
                </div>
              );
            case "boolean":
              return (
                <EditorBoolean key={f.path} fieldName={name} {...common} />
              );
            case "select":
            case "radio":
              return (
                <div className="form-group" key={f.path}>
                  <EditorSelect
                    fieldName={name}
                    required={f.required}
                    data={(f.options ?? []).map((o) => ({
                      value: o.value,
                      text: o.label ?? o.value,
                    }))}
                  />
                </div>
              );
            case "date":
              return (
                <EditorDate
                  key={f.path}
                  fieldName={name}
                  required={f.required}
                />
              );
            case "text":
            case "url":
            case "email":
            case "textarea":
            case "markdown":
              return (
                <EditorInput
                  key={f.path}
                  fieldName={name}
                  textarea={f.widget === "textarea" || f.widget === "markdown"}
                  {...common}
                />
              );
            case "hidden":
              return null;
            default:
              // Lists and lists of objects need a component of their own.
              console.warn(`${f.path}: widget "${f.widget}" isn't supported`);
              return null;
          }
        })}
    </>
  );
}
