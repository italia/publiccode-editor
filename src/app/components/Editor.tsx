import PubliccodeYmlLanguages from "./PubliccodeYmlLanguages";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import Input from "./Input";

import Head from "./Head";
import { useAppSelector } from "../store";
import { YamlModal } from "./YamlModal";
import InfoBox from "./InfoBox";
import { useState } from "react";
import { Footer } from "./Foot";
import { useTranslation } from "react-i18next";
import { validator } from "../validator";
import { set } from "lodash";
import PublicCode from "../contents/publiccode";
import EditorInput from "./EditorInput";
import developmentStatus from "../contents/developmentStatus";
import EditorBoolean from "./EditorBoolean";
import EditorMultiselect from "./EditorMultiselect";
import categories from "../contents/categories";
import platforms from "../contents/platforms";
import EditorRadio from "./EditorRadio";
import softwareTypes from "../contents/softwareTypes";
import maintenanceTypes from "../contents/maintenanceTypes";
import EditorSelect from "./EditorSelect";
import licenses from "../../generated/licenses.json";

const resolver: Resolver<PublicCode> = async (values) => {
  const res = await validator(JSON.stringify(values), "main");

  if (res.errors.length === 0)
    return {
      values,
      errors: {},
    };

  const errors: Record<string, { type: string; message: string }> = {};

  for (const { key, description } of res.errors) {
    set(errors, key, {
      type: "error",
      message: description,
    });
  }

  return { values: {}, errors };
};

const defaultValues = {
  publiccodeYmlVersion: "0.3",
};

export default function Editor() {
  const methods = useForm<PublicCode>({
    defaultValues,
    resolver,
  });
  const { handleSubmit, register } = methods;

  const languages = useAppSelector((state) => state.language.languages);

  const { t } = useTranslation();

  const [isYamlModalVisible, setYamlModalVisibility] = useState(false);

  const submit = handleSubmit(
    async (values) => console.log("Values:", values),
    (errors) => console.log("Errors:", errors)
  );

  return (
    <>
      <div className="content">
        {/* <Head lastGen={lastGen} /> */}
        <Head />
        <PubliccodeYmlLanguages />
        <div className="content__main" id="content__main">
          <FormProvider {...methods}>
            <form>
              <EditorInput fieldName="name" required />
              <EditorInput fieldName="applicationSuite" />
              {languages.map((lang) => (
                <div key={`description.${lang}`}>
                  <EditorInput
                    fieldName={`description.${lang}.genericName`}
                    lang={lang}
                  />
                  <EditorInput
                    fieldName={`description.${lang}.localisedName`}
                    lang={lang}
                  />
                  <EditorInput
                    fieldName={`description.${lang}.shortDescription`}
                    lang={lang}
                    required
                  />
                  <EditorInput
                    fieldName={`description.${lang}.longDescription`}
                    lang={lang}
                    required
                    textarea
                  />
                </div>
              ))}
              <EditorInput fieldName="url" required />
              <Input
                type="date"
                {...register("releaseDate")}
                label={`${t("publiccodeyml.releaseDate.label")} *`}
                infoText={t("publiccodeyml.releaseDate.description")}
              />

              <EditorRadio<"developmentStatus">
                fieldName="developmentStatus"
                data={developmentStatus}
                required
              />
              <EditorBoolean<"localisation.localisationReady">
                fieldName="localisation.localisationReady"
                required
              />
              <EditorMultiselect<"categories">
                fieldName="categories"
                data={categories}
                required
                filter="contains"
              />
              <EditorMultiselect<"platforms">
                fieldName="platforms"
                data={platforms}
                required
                filter="contains"
              />
              <EditorRadio<"softwareType">
                fieldName="softwareType"
                data={softwareTypes}
                required
              />
              <EditorRadio<"maintenance.type">
                fieldName="maintenance.type"
                data={maintenanceTypes}
                required
              />
              <EditorSelect<"legal.license">
                fieldName="legal.license"
                data={licenses}
                required
                filter={(item, word) =>
                  item.text.toLowerCase().includes(word.toLocaleLowerCase()) ||
                  item.value.toLowerCase().includes(word.toLocaleLowerCase())
                }
              />
            </form>
          </FormProvider>
        </div>
        <Footer
          reset={() => undefined}
          submit={() => undefined}
          loadRemoteYaml={() => undefined}
          trigger={submit}
          languages={languages}
          yamlLoaded
        />
        <InfoBox />
        <YamlModal
          //   yaml={yamlString}
          display={isYamlModalVisible}
          toggle={() => setYamlModalVisibility(!isYamlModalVisible)}
        />
      </div>
    </>
  );
}
