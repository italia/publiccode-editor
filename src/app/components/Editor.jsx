import { Fragment, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Head from "./Head";
import { PubliccodeYmlLanguages } from "./PubliccodeYmlLanguages";
import { useAppDispatch, useAppSelector } from "../store";
import EditorForm from "./EditorForm";
import InfoBox from "./InfoBox";
import { useEditor } from "../hooks/useEditor";
import { Footer } from "./Foot";
import { useForm } from "react-hook-form";
import { notify } from "design-react-kit";
import { validate } from "../utils/validate";
import {
  AUTOSAVE_TIMEOUT,
  defaultCountry as currentCountry,
  DEFAULT_BRANCH,
} from "../contents/constants";
import { YamlModal } from "./YamlModal";
import { useTranslation } from "react-i18next";
import { staticFieldsJson, staticFieldsYaml } from "../contents/staticFields";
import jsyaml from "js-yaml";
import { getDefaultBranch, getRemotePubliccode } from "../utils/calls";
import {
  convertSimpleStringArray,
  dirtyValues,
  extractLanguages,
  toFlatPropertyMap,
  transformSimpleStringArrays,
} from "../utils/transform";
import { setPubliccodeYmlLanguages, resetPubliccodeYmlLanguages } from "../store/publiccodeYmlLanguages";
import useDebounce from "../hooks/useDebounce";

export const Editor = (props) => {
  const lastGen = new Date();

  const dispatch = useAppDispatch();
  const languages = useAppSelector((state) => state.language.languages);

  const [isYamlUploaded, setIsYamlUploaded] = useState(false);
  const [yaml, setYaml] = useState(null);
  const [yamlString, setYamlString] = useState("");
  const [flatErrors, setFlatErrors] = useState(null);
  const [activeSection, setActiveSection] = useState(["0"]);
  const [isYamlModalVisible, setYamlModalVisibility] = useState(false);
  const [defaultBranch, setDefaultBranch] = useState(DEFAULT_BRANCH);

  const { t } = useTranslation();
  const formMethods = useForm();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [elements, blocks, allFields] = useEditor(currentCountry, languages);

  const {
    handleSubmit,
    errors,
    reset,
    clearErrors,
    setError,
    formState,
    getValues,
    setValue,
    register,
    watch,
  } = formMethods;
  const urlWatched = useDebounce(watch("url"), 1000);

  // handle uploaded data
  useEffect(() => {
    // get data back in form (upload)
    yaml &&
      Promise.all([reset({}, { dirtyFields: true })]).then(() => {
        props.setLoading(true);
        setDirtyAllFields();
        props.setLoading(false);
      });
  }, [yaml, languages]);

  // set default values and load data from localstorage if any
  useEffect(() => {
    //all required checkbox and preset values should be set here
    setValue("localisation.localisationReady", false, { shouldDirty: true });
    setValue("publiccodeYmlVersion", "0.2", { shouldDirty: true });

    // loading from localStorage
    setYaml(JSON.parse(localStorage.getItem("publiccode-editor")));
  }, [allFields]);

  // autosave
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const data = dirtyValues(formState.dirtyFields, getValues());
      console.log(
        `autosaving data to localStorage every ${
          AUTOSAVE_TIMEOUT / 1000
        } seconds`,
        formState.isDirty
      );
      const yamlSimplified = transformSimpleStringArrays(data, allFields);
      localStorage.setItem("publiccode-editor", JSON.stringify(yamlSimplified));
    }, AUTOSAVE_TIMEOUT);
    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [allFields]);

  useEffect(async () => {
    try {
      const url = new URL(urlWatched).toString();
      const gdb = await getDefaultBranch(url.toString());
      const { branch } = gdb;
      setDefaultBranch(branch);
    } catch (error) {
      console.log("url not valid");
    }
  }, [urlWatched]);

  const onAccordion = (activeSection) => {
    let offset = activeSection * 56;
    let currentScroll = document.getElementById(`content__main`).scrollTop;
    let diff = currentScroll - offset;

    if (diff > 0) {
      document.getElementById(`content__main`).scrollTop = offset;
    } else {
      console.warn("inviewport");
    }
    setActiveSection(activeSection);
  };

  const submitFeedback = () => {
    if (errors) {
      console.log("errors:", errors);
      notify(t("editor.genericerror"), { state: "error" });
    } else {
      notify(t("editor.success"), { state: "success" });
    }
  };

  const setDirtyAllFields = () => {
    if (yaml) {
      // setting boolean required fields to dirty
      setValue("localisation.localisationReady", false, { shouldDirty: true });
      const flattenedObj = toFlatPropertyMap(yaml);
      const convertedSimpleStringArray = convertSimpleStringArray(
        flattenedObj,
        allFields
      );
      Object.keys(convertedSimpleStringArray).map((x) => {
        register(x);
        setValue(x, convertedSimpleStringArray[x], { shouldDirty: true });
      });
    }
  };

  const parseYML = (yaml) => {
    let data = null;
    try {
      data = jsyaml.load(yaml);
    } catch (e) {
      notify(t("editor.errors.yamlloading"), { state: "error" });
      throw new Error(t("editor.errors.yamlloading"));
    }
    if (!data) {
      notify(t("editor.errors.yamlloading"), { state: "error" });
      return;
    }
    dispatch(setPubliccodeYmlLanguages(extractLanguages(data)));
    return data;
  };

  const loadRemoteYaml = async (value) => {
    // ask confirmation to overwrite form
    // then reset actual form
    setIsYamlUploaded(true);
    props.setLoading(true);

    const response = await getRemotePubliccode(value);
    const yaml = parseYML(response);
    localStorage.setItem("publiccode-editor", JSON.stringify(yaml));
    setYaml(yaml);

    props.setLoading(false);
  };

  const renderFoot = () => {
    const props = {
      reset: handleReset,
      submitFeedback: submitFeedback,
      submit: submit,
      trigger: triggerValidation,
      yamlLoaded: isYamlUploaded,
      languages: languages,
      loadRemoteYaml,
    };
    return <Footer {...props} />;
  };

  const handleReset = () => {
    notify("Reset", { state: "info" });
    localStorage.setItem("publiccode-editor", "{}");
    reset({}, { dirtyFields: true });
    setYaml(null);
    clearErrors();
    setFlatErrors(null);
    dispatch(resetPubliccodeYmlLanguages());
  };

  const handleValidationErrors = useCallback((validator) => {
    if (validator.isValid === undefined) {
      // error thrown
      console.log(validator);
      props.setLoading(false);
      notify("Error", { description: validator, state: "error" });
      return;
    }
    if (validator.isValid) {
      setYamlModalVisibility(true);
    } else {
      console.log(validator);
      setFlatErrors(validator.errors);
      validator.errors.map((x) => {
        setError(x.key, {
          message: x.description,
          type: "manual",
        });
      });
    }
    props.setLoading(false);
  });

  const setResults = (values) => {
    try {
      const mergedValue = Object.assign(staticFieldsJson, values);
      const tmpYaml = jsyaml.safeDump(mergedValue, { forceStyleLiteral: true });
      const yamlString = staticFieldsYaml + tmpYaml;
      values && setYamlString(yamlString);
    } catch (e) {
      throw new Error(e);
    }
  };

  const handleYamlChange = (data) => {
    setResults(data);
  };

  const triggerValidation = () => {
    props.setLoading(true);
    clearErrors();
    validate(
      getValues(),
      allFields,
      formState.dirtyFields,
      languages,
      handleValidationErrors,
      handleYamlChange,
      defaultBranch
    );
    setIsYamlUploaded(false);
  };

  const onError = (data) => {
    console.log("error submitting", data);
  };

  const onSubmit = () => {
    triggerValidation();
  };

  const submit = handleSubmit(onSubmit, onError);

  return (
    <Fragment>
      <div className="content">
        <Head lastGen={lastGen} />
        <PubliccodeYmlLanguages />
        <div className="content__main" id="content__main">
          {blocks && allFields && (
            <EditorForm
              activeSection={activeSection}
              onAccordion={onAccordion}
              submit={submit}
              formMethods={formMethods}
              data={blocks}
              country={currentCountry}
              allFields={allFields}
              languages={languages}
              flatErrors={flatErrors}
            />
          )}
        </div>
        {blocks && renderFoot()}
        <InfoBox />
        <YamlModal
          yaml={yamlString}
          display={isYamlModalVisible}
          toggle={() => setYamlModalVisibility(!isYamlModalVisible)}
        />
      </div>
    </Fragment>
  );
};

Editor.propTypes = {
  setLoading: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
