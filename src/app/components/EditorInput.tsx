import { FieldPath, useFormContext } from "react-hook-form";
import Input from "./Input";
import { useTranslation } from "react-i18next";
import PublicCode from "../contents/publiccode";
import { get, replace } from "lodash";
import { displayName } from "../../i18n";
import { TextArea } from "design-react-kit";

type Props = {
  fieldName: FieldPath<PublicCode>;
  lang?: string;
  required?: boolean;
  textarea?: boolean;
};

export default function EditorInput({
  fieldName,
  lang,
  required,
  textarea,
}: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<PublicCode>();
  const { t } = useTranslation();

  const translationPath = lang
    ? `publiccodeyml.${replace(fieldName, `.${lang}.`, ".")}`
    : `publiccodeyml.${fieldName}`;

  const extraLangInfo = lang
    ? ` (in ${displayName(lang, undefined, "language")})`
    : "";

  const Tag = textarea ? TextArea : Input;

  return (
    <Tag
      {...register(fieldName, { shouldUnregister: Boolean(fieldName) })}
      label={`${t(`${translationPath}.label`)}${extraLangInfo}${
        required ? " *" : ""
      }`}
      infoText={t(`${translationPath}.description`)}
      valid={get(errors, fieldName) && false}
      validationText={get(errors, `${fieldName}.message`) as string}
      rows={textarea ? 3 : undefined}
    />
  );
}
