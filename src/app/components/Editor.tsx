import { List, ListItem, notify } from "design-react-kit";
import { set } from "lodash";
import { useCallback, useEffect } from "react";
import {
  FieldErrors,
  FieldPathByValue,
  FormProvider,
  Resolver,
  useForm,
} from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import { useTranslation } from "react-i18next";
import { RequiredDeep } from "type-fest";
import licenses from "../../generated/licenses.json";
import { allLangs, displayName } from "../../i18n";
import categories from "../contents/categories";
import { DEFAULT_COUNTRY_SECTIONS } from "../contents/constants";
import * as countrySection from "../contents/countrySpecificSection";
import developmentStatus from "../contents/developmentStatus";
import maintenanceTypes from "../contents/maintenanceTypes";
import mimeTypes from "../contents/mime-types";
import platforms from "../contents/platforms";
import PublicCode, {
  defaultItaly,
  LATEST_VERSION,
  PublicCodeWithDeprecatedFields,
} from "../contents/publiccode";
import { getPubliccodeYmlVersionList } from "../contents/publiccode-yml-version";
import softwareTypes from "../contents/softwareTypes";
import fileImporter from "../importers/file.importer";
import importFromGitlab from "../importers/gitlab.importer";
import importStandard from "../importers/standard.importer";
import {
  CountrySection,
  useCountryStore,
  useLanguagesStore,
  useWarningStore,
  useYamlStore,
} from "../lib/store";
import { getYaml } from "../lib/utils";
import publicCodeAdapter from "../publiccode-adapter";
import { toSemVerObject } from "../semver";
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
import EditorToolbar from "./EditorToolbar";
import EditorUsedBy from "./EditorUsedBy";
import EditorVideos from "./EditorVideos";
import PubliccodeYmlLanguages from "./PubliccodeYmlLanguages";
import { yamlLoadEventBus } from "./UploadPanel";
// import EditorMDInput from "./EditorMDInput";

const validatorFn = async (values: PublicCode) => {
  try {
    const results = await validator({
      publiccode: JSON.stringify(values),
      baseURL: values.url,
    });

    return results;
  } catch {
    console.log("error  validating");
  }
};

const checkWarnings = async (values: PublicCode) => {
  const res = await validatorFn(values);
  const warnings = new Map<string, { type: string; message: string }>();

  let counter = 0;

  for (const { key, description } of res?.warnings || []) {
    //if no key is provided, create a unique one
    const warningKey = !key
      ? `Generic Warning ${++counter}`
      : key

    warnings.set(warningKey, {
      type: "warning",
      message: description,
    });
  }

  return { warnings };
};

const resolver: Resolver<PublicCode | PublicCodeWithDeprecatedFields> = async (
  values
) => {
  console.log(values);

  // return { values, errors: {} }; //@TODO REMOVE:  USED TO IGNORE VALIDATIONS

  const res = await validatorFn(values as PublicCode);

  if (res?.errors.length === 0)
    return {
      values,
      errors: {},
    };

  const errors: Record<string, { type: string; message: string }> = {};

  let counter = 0;

  for (const { key, description } of res?.errors || []) {
    const errorKey = !key
      ? `GenericError${++counter}`
      : key
    set(errors, errorKey, {
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
  maintenance: { contacts: undefined, contractors: undefined },
  platforms: [],
  categories: [],
  description: {},
  it: defaultItaly,
};

const isNotTheSameVersion = (version1: string, version2: string) => {
  const v1 = toSemVerObject(version1);
  const v2 = toSemVerObject(version2);

  return (
    v1.major !== v2.major || v1.minor !== v2.minor || v1.patch !== v2.patch
  );
};

export default function Editor() {
  //#region UI
  const { t } = useTranslation();
  const { countrySections } = useCountryStore();
  const { resetWarnings, setWarnings } = useWarningStore();
  const {
    publiccodeYmlVersion,
    setPubliccodeYmlVersion,
    setYaml,
    resetYaml,
    isPublicCodeImported,
    setIsPublicCodeImported,
    yaml,
  } = useYamlStore();
  const { languages, setLanguages, resetLanguages } = useLanguagesStore();
  const { setCountrySections } = useCountryStore();

  const getNestedValue = (
    obj: PublicCodeWithDeprecatedFields,
    path: string
  ) => {
    return path.split(".").reduce((acc, key) => (acc as never)?.[key], obj);
  };

  type PublicCodeDeprecatedField = FieldPathByValue<
    RequiredDeep<PublicCodeWithDeprecatedFields>,
    string | Array<string>
  >;

  const isDeprecatedFieldVisible = (fieldName: PublicCodeDeprecatedField) => {
    const values = getValues() as PublicCodeWithDeprecatedFields;
    if (!values) {
      return false;
    }
    const fieldValue = getNestedValue(values, fieldName); //values[fieldName]
    if (fieldValue === null || fieldValue === undefined) {
      return false;
    }
    return true;
  };
  const isContractorsVisible = () => {
    const {
      maintenance: { type },
    } = getValues() as PublicCode;
    return type === "contract";
  };
  const isContactsVisible = () => {
    const {
      maintenance: { type },
    } = getValues() as PublicCode;
    return type === "internal" || type === "community";
  };
  //#endregion

  //#region form definition
  const methods = useForm<PublicCode | PublicCodeWithDeprecatedFields>({
    defaultValues,
    resolver,
    mode: "onTouched",
    reValidateMode: "onChange",
  });
  const { getValues, handleSubmit, watch, setValue, reset } = methods;

  const checkPubliccodeYmlVersion = useCallback((publicCode: PublicCode) => {
    const { publiccodeYmlVersion } = publicCode;
    setPubliccodeYmlVersion(publiccodeYmlVersion);
  }, []);

  useFormPersist("form-values", {
    watch,
    setValue,
    onDataRestored: useCallback(
      (pc: PublicCode) => {
        setLanguages(Object.keys(pc?.description));
        checkPubliccodeYmlVersion(pc);
      },
      [setLanguages]
    ),
    storage: window?.localStorage, // default window.sessionStorage
    exclude: [],
  });

  const resetMaintenance = useCallback(
    (value: Partial<PublicCode>) => {
      const maintenanceType = (value as PublicCode).maintenance.type;

      if (maintenanceType === "none") {
        setValue("maintenance.contacts", undefined);
        setValue("maintenance.contractors", undefined);
      }

      if (maintenanceType === "community" || maintenanceType === "internal") {
        setValue("maintenance.contractors", undefined);
      }

      if (maintenanceType === "contract") {
        setValue("maintenance.contacts", undefined);
      }
    },
    [setValue]
  );

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "maintenance.type") {
        resetMaintenance(value as PublicCode);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, resetMaintenance]);
  //#endregion

  //#region form action handlers
  const submitHandler = handleSubmit(
    async (data) => {
      if (data) {
        setFormDataAfterImport(async () => data as PublicCode);
        notify(
          t("editor.form.validate.success.title"),
          t("editor.form.validate.success.text"),
          {
            dismissable: true,
            state: "success",
          }
        );
      }
    },
    (e: FieldErrors<PublicCode>) => {
      const genericErrors = Object.entries(e)
        .filter(([key]) => key.startsWith("GenericError"));

      const body = genericErrors.length
        ? (<List className="it-list">
          {genericErrors.map(([key, value]) => (
            <ListItem key={key}>
              <span className="text">{(value as { message: string }).message}</span>
            </ListItem>
          ))}
        </List>)
        : t("editor.form.validate.error.text")

      notify(
        t("editor.form.validate.error.title"),
        body,
        {
          dismissable: true,
          state: "error",
        }
      );
      console.error("Errors:", e);
    }
  );

  const resetFormHandler = () => {
    resetYaml();
    resetLanguages();
    reset({ ...defaultValues });
    resetWarnings();
    setCountrySections([
      DEFAULT_COUNTRY_SECTIONS.split(",")[0] as CountrySection,
    ]);
  };

  const setFormDataAfterImport = async (
    fetchData: () => Promise<PublicCode | null>
  ) => {
    try {
      const publicCode = await fetchData().then((publicCode) => {
        return publicCodeAdapter({
          publicCode,
          defaultValues: defaultValues as unknown as Partial<PublicCode>,
        });
      });

      setLanguages(Object.keys(publicCode.description));

      if (publicCode.it) {
        setCountrySections(["italy"]);
      }

      const yaml = getYaml(publicCode);

      if (yaml) {
        setYaml(yaml);
        reset(publicCode);
      }

      checkPubliccodeYmlVersion(publicCode);
      setIsPublicCodeImported(true);

      const res = await checkWarnings(publicCode);
      setWarnings(
        Array.from(res.warnings).map(([key, { message }]) => ({ key, message }))
      );
    } catch (error: unknown) {
      notify("Import error", (error as Error).message, {
        dismissable: true,
        state: "error",
      });
    }
  };

  const loadFileYamlHandler = async (file: File) => {
    const fetchDataFn = () => fileImporter(file);

    await setFormDataAfterImport(fetchDataFn);
  };

  const loadRemoteYamlHandler = async (event: {
    url: string;
    source: "gitlab" | "other";
  }) => {
    try {
      console.log("loadRemoteYamlHandler", event);
      const fetchDataFn =
        event.source === "gitlab"
          ? async () => await importFromGitlab(new URL(event.url))
          : async () => await importStandard(new URL(event.url));

      await setFormDataAfterImport(fetchDataFn);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notify(t("editor.notvalidurl"), t("editor.notvalidurl"), {
        state: "error",
      });
    }
  };
  //#endregion

  useEffect(() => {
    yamlLoadEventBus.on("loadRemoteYaml", loadRemoteYamlHandler);
    yamlLoadEventBus.on("loadFileYaml", loadFileYamlHandler);

    return () => {
      yamlLoadEventBus.off("loadRemoteYaml", loadRemoteYamlHandler);
      yamlLoadEventBus.off("loadFileYaml", loadFileYamlHandler);
    };
  }, []);

  return (
    <div className="content__editor-wrapper">
      <div className="container content__main pt-5">
        <FormProvider {...methods}>
          <form onSubmit={submitHandler}>
            {isPublicCodeImported &&
              publiccodeYmlVersion &&
              isNotTheSameVersion(publiccodeYmlVersion, LATEST_VERSION) && (
                <div>
                  <span>
                    <EditorSelect<"publiccodeYmlVersion">
                      fieldName="publiccodeYmlVersion"
                      data={getPubliccodeYmlVersionList(publiccodeYmlVersion)}
                      required
                    />
                  </span>
                </div>
              )}
            <div>
              <span>
                <EditorInput<"name"> fieldName="name" required />
              </span>
              <span>
                <EditorInput<"applicationSuite"> fieldName="applicationSuite" />
              </span>
            </div>
            <div className="p-2 bd-highlight">
              <PubliccodeYmlLanguages />
            </div>
            {languages
              .map((lang) => (
                <div
                  className="languages"
                  key={`publiccodeyml.description.${lang}`}
                >
                  <div className="p-2 fw-bold mb-4">
                    {t(`publiccodeyml.description.title`)} (in{" "}
                    {displayName(lang, undefined, "language")})
                  </div>
                  <div>
                    {isDeprecatedFieldVisible(
                      `description.${lang}.genericName` as never
                    ) && (
                        <span>
                          <EditorDescriptionInput<"genericName">
                            fieldName="genericName"
                            lang={lang}
                            deprecated
                          />
                        </span>
                      )}
                    <div className="mt-5">
                      <EditorDescriptionInput<"localisedName">
                        fieldName="localisedName"
                        lang={lang}
                      />
                    </div>
                    <span>
                      <EditorDescriptionInput<"shortDescription">
                        fieldName="shortDescription"
                        lang={lang}
                        required
                      />
                    </span>
                    <span>
                      <EditorDescriptionInput<"documentation">
                        fieldName="documentation"
                        lang={lang}
                      />
                    </span>
                    <span>
                      <EditorDescriptionInput<"apiDocumentation">
                        fieldName="apiDocumentation"
                        lang={lang}
                      />
                    </span>
                    <span>
                      <EditorFeatures lang={lang} />
                    </span>
                    <span>
                      <EditorScreenshots lang={lang} />
                    </span>
                  </div>
                  <div>
                    <span>
                      <EditorVideos lang={lang} />
                    </span>
                  </div>
                  <div>
                    <span>
                      <EditorAwards lang={lang} />
                    </span>
                  </div>
                  <div>
                    <EditorDescriptionInput<"longDescription">
                      fieldName="longDescription"
                      lang={lang}
                      required
                      textarea
                    />
                    {/* <EditorMDInput<"longDescription">
                      fieldName='longDescription'
                      lang={lang}
                      required
                    /> */}
                  </div>
                </div>
              ))
              .reverse()}
            <div>
              <span>
                <EditorInput<"url"> fieldName="url" required />
              </span>
              <span>
                <EditorInput<"landingURL"> fieldName="landingURL" />
              </span>
              <span>
                <EditorInput<"isBasedOn"> fieldName="isBasedOn" />
              </span>
              <span>
                <EditorInput<"softwareVersion"> fieldName="softwareVersion" />
              </span>
              <span>
                <EditorDate<"releaseDate"> fieldName="releaseDate" />
              </span>
              <span>
                <EditorRadio<"developmentStatus">
                  fieldName="developmentStatus"
                  data={developmentStatus}
                  required
                />
              </span>
              {isDeprecatedFieldVisible("inputTypes") && (
                <span>
                  <EditorMultiselect<"inputTypes">
                    fieldName="inputTypes"
                    data={Object.keys(mimeTypes).map((o) => ({
                      text: o,
                      value: o,
                    }))}
                  />
                </span>
              )}
              {isDeprecatedFieldVisible("outputTypes") && (
                <span>
                  <EditorMultiselect<"outputTypes">
                    fieldName="outputTypes"
                    data={Object.keys(mimeTypes).map((o) => ({
                      text: o,
                      value: o,
                    }))}
                  />
                </span>
              )}
              {isDeprecatedFieldVisible("monochromeLogo") && (
                <span>
                  <EditorInput<"monochromeLogo">
                    fieldName="monochromeLogo"
                    deprecated
                  />
                </span>
              )}
              <div className="mt-5">
                <EditorInput<"logo"> fieldName="logo" />
              </div>
              <span>
                <EditorBoolean<"localisation.localisationReady">
                  fieldName="localisation.localisationReady"
                  required
                />
              </span>
              <div className="mt-5">
                <EditorMultiselect<"localisation.availableLanguages">
                  fieldName="localisation.availableLanguages"
                  data={allLangs().map(({ text, value }) => ({
                    text: text || "",
                    value,
                  }))}
                  required
                />
              </div>
              <span>
                <EditorMultiselect<"categories">
                  fieldName="categories"
                  data={categories.map((e) => ({ text: e, value: e }))}
                  required
                  filter="contains"
                />
              </span>
              <span>
                <EditorMultiselect<"platforms">
                  fieldName="platforms"
                  data={platforms.map((e) => ({ text: e, value: e }))}
                  required
                  filter="contains"
                />
              </span>
              <span>
                <EditorUsedBy />
              </span>
              <span>
                <EditorSelect<"legal.license">
                  fieldName="legal.license"
                  data={licenses}
                  required
                  filter={(item, word) =>
                    item.text
                      .toLowerCase()
                      .includes(word.toLocaleLowerCase()) ||
                    item.value.toLowerCase().includes(word.toLocaleLowerCase())
                  }
                />
              </span>
              {isDeprecatedFieldVisible("legal.authorsFile") && (
                <span>
                  <EditorInput<"legal.authorsFile">
                    fieldName="legal.authorsFile"
                    deprecated
                  />
                </span>
              )}
              <span>
                <EditorRadio<"softwareType">
                  fieldName="softwareType"
                  data={softwareTypes}
                  required
                />
              </span>
              <span>
                <EditorRadio<"maintenance.type">
                  fieldName="maintenance.type"
                  data={maintenanceTypes}
                  required
                />
              </span>
              {isContractorsVisible() && (
                <span>
                  <EditorContractors />
                </span>
              )}
              {isContactsVisible() && (
                <span>
                  <EditorContacts key={yaml} />
                </span>
              )}
            </div>
            {countrySection.isVisible(countrySections, "italy") && (
              <>
                <hr />
                <div>
                  <div>
                    <h4>{t("countrySpecificSection.italy")}</h4>
                  </div>
                  <div className="mt-5">
                    <div className="form-group">
                      <EditorSelect<"it.countryExtensionVersion">
                        fieldName="it.countryExtensionVersion"
                        data={[{ text: "1.0", value: "1.0" }]}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5>{t("publiccodeyml.it.conforme.label")}</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <EditorBoolean<"it.conforme.lineeGuidaDesign"> fieldName="it.conforme.lineeGuidaDesign" />
                      </div>
                      <div className="col-md-6">
                        <EditorBoolean<"it.conforme.modelloInteroperabilita"> fieldName="it.conforme.modelloInteroperabilita" />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <EditorBoolean<"it.conforme.misureMinimeSicurezza"> fieldName="it.conforme.misureMinimeSicurezza" />
                      </div>
                      <div className="col-md-6">
                        <EditorBoolean<"it.conforme.gdpr"> fieldName="it.conforme.gdpr" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5>{t("publiccodeyml.it.piattaforme.label")}</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <EditorBoolean<"it.piattaforme.spid"> fieldName="it.piattaforme.spid" />
                      </div>
                      <div className="col-md-6">
                        <EditorBoolean<"it.piattaforme.cie"> fieldName="it.piattaforme.cie" />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <EditorBoolean<"it.piattaforme.anpr"> fieldName="it.piattaforme.anpr" />
                      </div>
                      <div className="col-md-6">
                        <EditorBoolean<"it.piattaforme.pagopa"> fieldName="it.piattaforme.pagopa" />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <EditorBoolean<"it.piattaforme.io"> fieldName="it.piattaforme.io" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5>{t("publiccodeyml.it.riuso.label")}</h5>
                    <div>
                      <EditorInput<"it.riuso.codiceIPA"> fieldName="it.riuso.codiceIPA" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </form>
        </FormProvider>
      </div>
      <EditorToolbar
        reset={() => resetFormHandler()}
        trigger={() => submitHandler()}
        languages={languages}
        yamlLoaded={isPublicCodeImported}
      />
    </div>
  );
}
