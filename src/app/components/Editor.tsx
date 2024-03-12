import PubliccodeYmlLanguages from "./PubliccodeYmlLanguages";
import { FormProvider, Resolver, useForm } from "react-hook-form";

import Head from "./Head";
import { useAppSelector } from "../store";
import { YamlModal } from "./YamlModal";
import InfoBox from "./InfoBox";
import { useState } from "react";
import { Footer } from "./Foot";
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
import { allLangs } from "../../i18n";
import EditorDescriptionInput from "./EditorDescriptionInput";
import EditorFeatures from "./EditorFeatures";
import EditorDate from "./EditorDate";
import YAML from "yaml";
import { Col, Container, Row } from "design-react-kit";

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
  const { getValues, handleSubmit } = methods;

  const languages = useAppSelector((state) => state.language.languages);

  const [isYamlModalVisible, setYamlModalVisibility] = useState(false);

  const submit = handleSubmit(
    async (values) => console.log("Values:", values),
    (errors) => console.log("Errors:", errors)
  );

  return (
    <Container>
      <Head />
      <PubliccodeYmlLanguages />
      <FormProvider {...methods}>
        <form>
          <Row xs="1" md="2">
            <Col>
              <EditorInput<"name"> fieldName="name" required />
            </Col>
            <Col>
              <EditorInput<"applicationSuite"> fieldName="applicationSuite" />
            </Col>
          </Row>
          {languages.map((lang) => (
            <div key={`description.${lang}`}>
              <Row xs="1" md="2">
                <Col>
                  <EditorDescriptionInput<"genericName">
                    fieldName="genericName"
                    lang={lang}
                  />
                </Col>
                <Col>
                  <EditorDescriptionInput<"localisedName">
                    fieldName="localisedName"
                    lang={lang}
                  />
                </Col>
                <Col>
                  <EditorDescriptionInput<"shortDescription">
                    fieldName="shortDescription"
                    lang={lang}
                    required
                  />
                </Col>
                <Col>
                  <EditorFeatures lang={lang} />
                </Col>
              </Row>
              <Row>
                <EditorDescriptionInput<"longDescription">
                  fieldName="longDescription"
                  lang={lang}
                  required
                  textarea
                />
              </Row>
            </div>
          ))}
          <Row xs="1" md="2">
            <Col>
              <EditorInput fieldName="url" required />
            </Col>
            <Col>
              <EditorDate<"releaseDate"> fieldName="releaseDate" required />
            </Col>
            <Col>
              <EditorRadio<"developmentStatus">
                fieldName="developmentStatus"
                data={developmentStatus}
                required
              />
            </Col>
            <Col>
              <EditorBoolean<"localisation.localisationReady">
                fieldName="localisation.localisationReady"
                required
              />
            </Col>
            <Col>
              <EditorMultiselect<"localisation.availableLanguages">
                fieldName="localisation.availableLanguages"
                data={allLangs().map(({ text, value }) => ({
                  text: text || "",
                  value,
                }))}
                required
              />
            </Col>
            <Col>
              <EditorMultiselect<"categories">
                fieldName="categories"
                data={categories.map((e) => ({ text: e, value: e }))}
                required
                filter="contains"
              />
            </Col>
            <Col>
              <EditorMultiselect<"platforms">
                fieldName="platforms"
                data={platforms.map((e) => ({ text: e, value: e }))}
                required
                filter="contains"
              />
            </Col>
            <Col>
              <EditorSelect<"legal.license">
                fieldName="legal.license"
                data={licenses}
                required
                filter={(item, word) =>
                  item.text.toLowerCase().includes(word.toLocaleLowerCase()) ||
                  item.value.toLowerCase().includes(word.toLocaleLowerCase())
                }
              />
            </Col>
            <Col>
              <EditorRadio<"softwareType">
                fieldName="softwareType"
                data={softwareTypes}
                required
              />
            </Col>
            <Col>
              <EditorRadio<"maintenance.type">
                fieldName="maintenance.type"
                data={maintenanceTypes}
                required
              />
            </Col>
          </Row>
        </form>
      </FormProvider>
      <Footer
        reset={() => undefined}
        submit={() => undefined}
        loadRemoteYaml={() => undefined}
        trigger={() => {
          submit();
          setYamlModalVisibility(true);
        }}
        languages={languages}
        yamlLoaded
      />
      <InfoBox />
      <YamlModal
        yaml={YAML.stringify(getValues())}
        display={isYamlModalVisible}
        toggle={() => setYamlModalVisibility(!isYamlModalVisible)}
      />
    </Container>
  );
}
