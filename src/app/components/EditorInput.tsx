import { FieldPath, useFormContext } from "react-hook-form";
import Input from "./Input";
import { useTranslation } from "react-i18next";
import PublicCode from "../contents/publiccode";
import { get, replace } from "lodash";
import { displayName } from "../../i18n";

type Props = {
  fieldName: FieldPath<PublicCode>;
  lang?: string;
  required?: boolean;
};

export default function EditorInput({ fieldName, lang, required }: Props) {
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

  return (
    <Input
      {...register(fieldName, { shouldUnregister: Boolean(fieldName) })}
      label={`${t(`${translationPath}.label`)}${extraLangInfo}${
        required ? " *" : ""
      }`}
      infoText={t(`${translationPath}.description`)}
      valid={get(errors, fieldName) && false}
      validationText={get(errors, `${fieldName}.message`) as string}
    />
  );
}
