import { FieldErrors, FieldPathByValue, FormProvider, Resolver, useForm } from "react-hook-form";
import PubliccodeYmlLanguages from "./PubliccodeYmlLanguages";

import { Col, Container, notify, Row } from "design-react-kit";
import { set } from "lodash";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import YAML from "yaml";
import licenses from "../../generated/licenses.json";
import { allLangs } from "../../i18n";
import categories from "../contents/categories";
import { DEFAULT_COUNTRY_SECTIONS } from "../contents/constants";
import * as countrySection from "../contents/countrySpecificSection";
import developmentStatus from "../contents/developmentStatus";
import maintenanceTypes from "../contents/maintenanceTypes";
import platforms from "../contents/platforms";
import PublicCode, { defaultItaly, LATEST_VERSION, PublicCodeWithDeprecatedFields } from "../contents/publiccode";
import softwareTypes from "../contents/softwareTypes";
import linter from "../linter";
import { useAppDispatch, useAppSelector } from "../store";
import { validator } from "../validator";
import EditorBoolean from "./EditorBoolean";
import EditorContacts from "./EditorContacts";
import EditorContractors from "./EditorContractors";
import EditorDate from "./EditorDate";
import EditorDescriptionInput from "./EditorDescriptionInput";
import EditorFeatures from "./EditorFeatures";
import EditorInput from "./EditorInput";
import EditorMultiselect from "./EditorMultiselect";
import EditorRadio from "./EditorRadio";
import EditorScreenshots from "./EditorScreenshots";
import EditorSelect from "./EditorSelect";
import { Footer } from "./Foot";
import Head from "./Head";
import InfoBox from "./InfoBox";
import { YamlModal } from "./YamlModal";

import useFormPersist from "react-hook-form-persist";
import { RequiredDeep } from "type-fest";
import mimeTypes from "../contents/mime-types";
import { getPubliccodeYmlVersionList } from "../contents/publiccode-yml-version";
import { isMinorThanLatest, toSemVerObject } from "../semver";
import { resetPubliccodeYmlLanguages, setPubliccodeYmlLanguages } from "../store/publiccodeYmlLanguages";
import yamlSerializer from "../yaml-serializer";
import { removeDuplicate } from "../yaml-upload";
import EditorUsedBy from "./EditorUsedBy";

const validatorFn = async (values: PublicCode) => await validator({ publiccode: JSON.stringify(values), baseURL: values.url });

const checkWarnings = async (values: PublicCode) => {
  const res = await validatorFn(values);
  const warnings = new Map<string, { type: string; message: string }>();

  for (const { key, description } of res.warnings) {
    warnings.set(key, {
      type: "warning",
      message: description,
    });
  }

  return { warnings };
};

const resolver: Resolver<PublicCode | PublicCodeWithDeprecatedFields> = async (values) => {
  const res = await validatorFn(values as PublicCode);

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
  publiccodeYmlVersion: LATEST_VERSION,
  legal: {},
  localisation: { availableLanguages: [] },
  maintenance: { contacts: [], contractors: [] },
  platforms: [],
  categories: [],
  description: {},
  it: defaultItaly,
};

export default function Editor() {
  //#region Common
  const dispatch = useAppDispatch();
  //#endregion

  //#region UI
  const { t } = useTranslation();
  const languages = useAppSelector((state) => state.language.languages);
  const configCountrySections = countrySection.parse(DEFAULT_COUNTRY_SECTIONS);
  const [currentPublicodeYmlVersion, setCurrentPubliccodeYmlVersion] = useState('');
  const [isYamlModalVisible, setYamlModalVisibility] = useState(false);

  const getNestedValue = (obj: PublicCodeWithDeprecatedFields, path: string) => {
    return path.split('.').reduce((acc, key) => (acc as never)?.[key], obj);
  }

  type PublicCodeDeprecatedField = FieldPathByValue<RequiredDeep<PublicCodeWithDeprecatedFields>, string | Array<string>>

  const isDeprecatedFieldVisible = (fieldName: PublicCodeDeprecatedField) => {
    const values = getValues() as PublicCodeWithDeprecatedFields;

    if (!values) {
      return false
    }

    const fieldValue = getNestedValue(values, fieldName);//values[fieldName]

    if (fieldValue === null || fieldValue === undefined) {
      return false
    }

    return true
  }
  //#endregion

  //#region form definition
  const methods = useForm<PublicCode | PublicCodeWithDeprecatedFields>({
    defaultValues,
    resolver,
  });
  const { getValues, handleSubmit, watch, setValue, reset } = methods;

  const setLanguages = useCallback((publicCode: PublicCode) => {
    dispatch(setPubliccodeYmlLanguages(Object.keys(publicCode.description)));
  }, [dispatch])

  const checkPubliccodeYmlVersion = useCallback((publicCode: PublicCode) => {
    const { publiccodeYmlVersion } = publicCode

    if (isMinorThanLatest(toSemVerObject(publiccodeYmlVersion))) {
      setCurrentPubliccodeYmlVersion(publiccodeYmlVersion)
    } else {
      setCurrentPubliccodeYmlVersion('')
    }
  }, [])

  useFormPersist("form-values", {
    watch,
    setValue,
    onDataRestored: useCallback((pc: PublicCode) => {
      setLanguages(pc);
      checkPubliccodeYmlVersion(pc);
    }, [setLanguages, checkPubliccodeYmlVersion]),
    storage: window?.localStorage, // default window.sessionStorage
    exclude: [],
  });
  //#endregion

  //#region form action handlers
  const submitHandler = handleSubmit(
    async () => {
      setYamlModalVisibility(true);
    },
    (e: FieldErrors<PublicCode>) => {
      notify(
        t("editor.form.validate.notification_title"),
        t("editor.form.validate.notification_text"),
        {
          dismissable: true,
          state: "error",
        }
      );
      console.error("Errors:", e);
    }
  );

  const resetFormHandler = () => {
    dispatch(resetPubliccodeYmlLanguages());
    reset({ ...defaultValues });
  };

  const setFormDataAfterImport = async (
    fetchData: () => Promise<PublicCode | null>
  ) => {
    const publicCode = await fetchData();

    if (publicCode) {
      const values = { ...defaultValues, ...publicCode } as PublicCode;

      if (publicCode.usedBy) {
        values.usedBy = removeDuplicate(publicCode.usedBy)
      }

      setLanguages(publicCode);
      reset(values);

      checkPubliccodeYmlVersion(publicCode);

      const res = await checkWarnings(values)

      if (res.warnings.size) {
        const body = Array
          .from(res.warnings)
          .reduce((p, [key, { message }]) => p + `${key}: ${message}`, '')

        const _1_MINUTE = 60 * 1 * 1000

        notify("Warnings", body, {
          dismissable: true,
          state: 'warning',
          duration: _1_MINUTE
        })
      }
    }
  };

  const loadFileYamlHandler = async (file: File) => {
    const fetchDataFn = () => yamlSerializer(file.stream());

    await setFormDataAfterImport(fetchDataFn);
  };

  const loadRemoteYamlHandler = async (url: string) => {
    const fetchDataFn = () =>
      fetch(url)
        .then((res) => res.body)
        .then((res) => res && yamlSerializer(res));

    await setFormDataAfterImport(fetchDataFn);
  };
  //#endregion

  return (
    <Container>
      <Head />
      <div className="p-4">
        <PubliccodeYmlLanguages />
        <div className='mt-3'></div>
        <FormProvider {...methods}>
          <form>
            {currentPublicodeYmlVersion &&
              <Row xs="1" md="1">
                <Col>
                  <EditorSelect<"publiccodeYmlVersion">
                    fieldName="publiccodeYmlVersion"
                    data={getPubliccodeYmlVersionList(currentPublicodeYmlVersion)}
                    required
                  />
                </Col>
              </Row>
            }
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
                  {isDeprecatedFieldVisible((`description.${lang}.genericName` as never)) &&
                    <Col md={{ size: 12 }} xxl={{ size: 12 }}>
                      <EditorDescriptionInput<"genericName">
                        fieldName="genericName"
                        lang={lang}
                        deprecated
                      />
                    </Col>
                  }
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
                  <Col>
                    <EditorScreenshots lang={lang} />
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
                <EditorInput<"url"> fieldName="url" required />
              </Col>
              <Col>
                <EditorInput<"landingURL"> fieldName="landingURL" />
              </Col>
              <Col>
                <EditorInput<"isBasedOn"> fieldName="isBasedOn" />
              </Col>
              <Col>
                <EditorInput<"softwareVersion"> fieldName="softwareVersion" />
              </Col>
              <Col>
                <EditorDate<"releaseDate"> fieldName="releaseDate" />
              </Col>
              <Col>
                <EditorRadio<"developmentStatus">
                  fieldName="developmentStatus"
                  data={developmentStatus}
                  required
                />
              </Col>
              {isDeprecatedFieldVisible('inputTypes') && <Col md={{ size: 12 }} xxl={{ size: 12 }}>
                <EditorMultiselect<"inputTypes">
                  fieldName="inputTypes"
                  data={Object.keys(mimeTypes).map(o => ({ text: o, value: o }))}
                />
              </Col>}
              {isDeprecatedFieldVisible('outputTypes') && <Col md={{ size: 12 }} xxl={{ size: 12 }}>
                <EditorMultiselect<"outputTypes">
                  fieldName="outputTypes"
                  data={Object.keys(mimeTypes).map(o => ({ text: o, value: o }))}
                />
              </Col>}
              {isDeprecatedFieldVisible('monochromeLogo') &&
                <Col md={{ size: 12 }} xxl={{ size: 12 }}>
                  <EditorInput<"monochromeLogo"> fieldName="monochromeLogo" deprecated />
                </Col>
              }
              <Col>
                <EditorInput<"logo"> fieldName="logo" />
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
                <EditorUsedBy />
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
              {isDeprecatedFieldVisible("legal.authorsFile") &&
                <Col md={{ size: 12 }} xxl={{ size: 12 }}>
                  <EditorInput<"legal.authorsFile"> fieldName="legal.authorsFile" deprecated />
                </Col>
              }
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
                <EditorContacts />
                <EditorContractors />
              </Col>
            </Row>
            <hr />
            {countrySection.isVisible(configCountrySections, "italy") && (
              <Row>
                <h2>{t("countrySpecificSection.italy")}</h2>
                <Col>
                  <EditorInput<"name"> fieldName='name' required />
                </Col>
                <Col>
                  <EditorInput<"applicationSuite"> fieldName='applicationSuite' />
                </Col>
              </Row>
            )
            }
          </form >
        </FormProvider >
        <Footer
          reset={() => resetFormHandler()}
          submit={() => undefined}
          loadRemoteYaml={(url) => loadRemoteYamlHandler(url)}
          loadFileYaml={(file) => loadFileYamlHandler(file)}
          trigger={() => submitHandler()}
          languages={languages}
          yamlLoaded
        />
        <InfoBox />
        <YamlModal
          yaml={YAML.stringify(linter(getValues() as PublicCode))}
          display={isYamlModalVisible}
          toggle={() => setYamlModalVisibility(!isYamlModalVisible)}
        />
      </div>
    </Container >
  );
}
