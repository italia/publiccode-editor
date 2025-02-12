import { Col, Container, Icon, notify, Row } from "design-react-kit";
import { set } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { FieldErrors, FieldPathByValue, FormProvider, Resolver, useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import { useTranslation } from "react-i18next";
import { RequiredDeep } from "type-fest";
import YAML from "yaml";
import licenses from "../../generated/licenses.json";
import { allLangs } from "../../i18n";
import categories from "../contents/categories";
import { DEFAULT_COUNTRY_SECTIONS } from "../contents/constants";
import * as countrySection from "../contents/countrySpecificSection";
import developmentStatus from "../contents/developmentStatus";
import maintenanceTypes from "../contents/maintenanceTypes";
import mimeTypes from "../contents/mime-types";
import platforms from "../contents/platforms";
import PublicCode, { defaultItaly, LATEST_VERSION, PublicCodeWithDeprecatedFields } from "../contents/publiccode";
import { getPubliccodeYmlVersionList } from "../contents/publiccode-yml-version";
import softwareTypes from "../contents/softwareTypes";
import fileImporter from "../importers/file.importer";
import importFromGitlab from "../importers/gitlab.importer";
import importStandard from "../importers/standard.importer";
import linter from "../linter";
import publicCodeAdapter from "../publiccode-adapter";
import { isMinorThanLatest, toSemVerObject } from "../semver";
import { useAppDispatch, useAppSelector } from "../store";
import { resetPubliccodeYmlLanguages, setPubliccodeYmlLanguages } from "../store/publiccodeYmlLanguages";
import { validator } from "../validator";
import EditorAwards from "./EditorAwards";
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
import EditorUsedBy from "./EditorUsedBy";
import EditorVideos from "./EditorVideos";
import { Footer } from "./Foot";
import Head from "./Head";
import InfoBox from "./InfoBox";
import PubliccodeYmlLanguages from "./PubliccodeYmlLanguages";
import { WarningModal } from "./WarningModal";
import { YamlModal } from "./YamlModal";

const PUBLIC_CODE_EDITOR_WARNINGS = 'PUBLIC_CODE_EDITOR_WARNINGS'

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
  console.log(values)
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
  const [isPublicCodeImported, setPublicCodeImported] = useState(false);
  const [isWarningModalVisible, setWarningModalVisibility] = useState(false);
  const [warnings, setWarnings] = useState<{ key: string; message: string; }[]>([]);

  useEffect(() => {
    const warnings = localStorage.getItem(PUBLIC_CODE_EDITOR_WARNINGS);

    if (warnings) {
      setWarnings(JSON.parse(warnings))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(PUBLIC_CODE_EDITOR_WARNINGS, JSON.stringify(warnings))
  }, [warnings])

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
  const isContractorsVisible = () => {
    const { maintenance: { type } } = getValues() as PublicCode;
    return type === 'contract'
  }
  const isContactsVisible = () => {
    const { maintenance: { type } } = getValues() as PublicCode;
    return type === 'internal' || type === 'community'
  }
  //#endregion

  //#region form definition
  const methods = useForm<PublicCode | PublicCodeWithDeprecatedFields>({
    defaultValues,
    resolver,
    mode: 'onTouched',
    reValidateMode: 'onChange'
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

  const resetMaintenance = useCallback((value: Partial<PublicCode>) => {
    const maintenanceType = (value as PublicCode).maintenance.type;

    if (maintenanceType === "none") {
      setValue('maintenance.contacts', [])
      setValue('maintenance.contractors', [])
    }

    if (maintenanceType === "community" || maintenanceType === "internal") {
      setValue('maintenance.contractors', [])
    }

    if (maintenanceType === "contract") {
      setValue('maintenance.contacts', [])
    }
  }, [setValue])

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'maintenance.type') {
        resetMaintenance(value as PublicCode);
      }
    }
    )
    return () => subscription.unsubscribe()
  }, [watch, resetMaintenance])
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
    checkPubliccodeYmlVersion(getValues() as PublicCode);
    setPublicCodeImported(false);
    setWarnings([])
  };

  const setFormDataAfterImport = async (
    fetchData: () => Promise<PublicCode | null>
  ) => {
    try {
      const publicCode = await fetchData().then(publicCode => {
        return publicCodeAdapter({ publicCode, defaultValues: defaultValues as unknown as Partial<PublicCode> })
      });

      setLanguages(publicCode);
      reset(publicCode);

      checkPubliccodeYmlVersion(publicCode);

      setPublicCodeImported(true);

      const res = await checkWarnings(publicCode)

      setWarnings(Array.from(res.warnings).map(([key, { message }]) => ({ key, message })));

      const numberOfWarnings = res.warnings.size;

      if (numberOfWarnings) {
        const body = `ci sono ${numberOfWarnings} warnings`

        const _5_SECONDS = 5 * 1 * 1000

        notify("Warnings", body, {
          dismissable: true,
          state: 'warning',
          duration: _5_SECONDS
        })
      }


    } catch (error: unknown) {
      notify('Import error', (error as Error).message, {
        dismissable: true,
        state: "error",
      })
    }
  };

  const loadFileYamlHandler = async (file: File) => {
    const fetchDataFn = () => fileImporter(file);

    await setFormDataAfterImport(fetchDataFn);
  };

  const loadRemoteYamlHandler = async (urlValue: string) => {

    try {
      const url = new URL(urlValue);

      const isGitlabRepo = url.hostname.includes('gitlab.com')

      const fetchDataFn = isGitlabRepo
        ? async () => await importFromGitlab(url)
        : async () => await importStandard(url)

      await setFormDataAfterImport(fetchDataFn);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notify(t('editor.notvalidurl'), t('editor.notvalidurl'), {
        state: 'error'
      })
    }

  };
  //#endregion

  return (
    <Container>
      <Head />
      <div className="p-4">
        <div className="d-flex flex-row">
          <div className="p-2 bd-highlight">
            <PubliccodeYmlLanguages />
          </div>
          {!!warnings.length &&
            <div className="p-2 bd-highlight" >
              <Icon icon="it-warning-circle" color="warning" title={t("editor.warnings")} onClick={() => setWarningModalVisibility(true)} />&nbsp;
            </div>
          }
        </div>
        <div className='mt-3'></div>
        <FormProvider {...methods}>
          <form>
            {isPublicCodeImported && currentPublicodeYmlVersion &&
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
                    <EditorDescriptionInput<"documentation">
                      fieldName="documentation"
                      lang={lang}
                    />
                  </Col>
                  <Col>
                    <EditorDescriptionInput<"apiDocumentation">
                      fieldName="apiDocumentation"
                      lang={lang}
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
                  <Col>
                    <EditorVideos lang={lang} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <EditorAwards lang={lang} />
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
            </Row>
            <Row xs="1" md="1">
              <Col>
                <EditorRadio<"maintenance.type">
                  fieldName="maintenance.type"
                  data={maintenanceTypes}
                  required
                />
              </Col>
              {isContractorsVisible() &&
                <Col>
                  <EditorContractors />
                </Col>}
              {isContactsVisible() &&
                <Col>
                  <EditorContacts />
                </Col>
              }
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
          yamlLoaded={isPublicCodeImported}
        />
        <InfoBox />
        <YamlModal
          yaml={YAML.stringify(linter(getValues() as PublicCode))}
          display={isYamlModalVisible}
          toggle={() => setYamlModalVisibility(!isYamlModalVisible)}
        />
        <WarningModal
          display={isWarningModalVisible}
          toggle={() => setWarningModalVisibility(!isWarningModalVisible)}
          warnings={warnings}
        />
      </div>
    </Container >
  );
}
