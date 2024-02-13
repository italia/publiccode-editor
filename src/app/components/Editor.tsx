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
import { FormGroup, FormText, Label } from "design-react-kit";
import { validator } from "../validator";
import { set } from "lodash";
import PublicCode from "../contents/publiccode";
import EditorInput from "./EditorInput";
import developmentStatus from "../contents/developmentStatus";

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
                  />
                </div>
              ))}
              <EditorInput fieldName="url" required />
              <Input
                type="date"
                {...register("releaseDate", {
                  valueAsDate: true,
                })}
                label={`${t("publiccodeyml.releaseDate.label")} *`}
                infoText={t("publiccodeyml.releaseDate.description")}
              />

              <fieldset>
                <legend>{`${t(
                  "publiccodeyml.developmentStatus.label"
                )} *`}</legend>
                {developmentStatus.map((key) => (
                  <FormGroup check key={key}>
                    <Input
                      {...register("developmentStatus")}
                      type="radio"
                      id={`developmentStatus-${key}`}
                      value={key}
                    />
                    <Label check htmlFor={`developmentStatus-${key}`}>
                      {key}
                    </Label>
                  </FormGroup>
                ))}
              </fieldset>
              <fieldset>
                <legend>{`${t(
                  "publiccodeyml.localisation.localisationReady.label"
                )} *`}</legend>
                <div>
                  <FormGroup check inline>
                    <Input
                      {...register("localisation.localisationReady")}
                      type="radio"
                      id={`localisation.localisationReady-true`}
                      value={"true"}
                    />
                    <Label
                      check
                      htmlFor={`localisation.localisationReady-true`}
                    >
                      true
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input
                      {...register("localisation.localisationReady")}
                      type="radio"
                      id={`localisation.localisationReady-false`}
                      value={"false"}
                    />
                    <Label
                      check
                      htmlFor={`localisation.localisationReady-false`}
                    >
                      false
                    </Label>
                  </FormGroup>
                </div>
                <FormText color="">
                  {t(
                    "publiccodeyml.localisation.localisationReady.description"
                  )}
                </FormText>
              </fieldset>
              {/*
          <FormGroup check>
        <Input {...register('localisation.localisationReady')} id='localisation-localisationReady' type='checkbox' />
        <Label for='localisation-localisationReady' check>
        {`${t("publiccodeyml.localisation.localisationReady.label")} *`}
        </Label>
      </FormGroup>
        */}
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
