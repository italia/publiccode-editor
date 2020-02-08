import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { initialize, submit, SubmissionError } from "redux-form";
import { notify } from "../store/notifications";
import { setVersions } from "../store/cache";
import { APP_FORM } from "../contents/constants";
import {
  getData,
  SUMMARY
} from "../contents/data";
import jsyaml from "../../../node_modules/js-yaml/dist/js-yaml.js";

import _ from "lodash";
import moment from "moment";

import Head from "./head";
import Foot from "./foot";
import EditorForm from "./editorForm";
import InfoBox from "./InfoBox";

import LanguageSwitcher from "./languageSwitcher";
import Sidebar from "./sidebar";

import * as ft from "../utils/transform";
import * as fv from "../utils/validate";

import { staticFieldsJson, staticFieldsYaml } from "../contents/staticFields";
import { postDataForValidation } from "../utils/calls";

const mapStateToProps = state => {
  return {
    notifications: state.notifications,
    cache: state.cache,
    form: state.form,
    yamlLoaded: state.yamlLoaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    initialize: (name, data) => dispatch(initialize(name, data)),
    submit: name => dispatch(submit(name)),
    notify: data => dispatch(notify(data)),
    setVersions: data => dispatch(setVersions(data))
  };
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: null,
      yaml: null,
      loading: false,
      languages: [],
      values: {},
      currentValues: {},
      currentLanguage: null,
      country: null,
      blocks: null,
      elements: null,
      activeSection: 0,
      allFields: null,
      lastGen: null,
      yamlLoaded: false
    };
    this.onLoadingRemote = this.props.onLoadingRemote.bind(this);
  }

  initBootstrap() {
    // $('[data-toggle="tooltip"]').tooltip();
    // $('[data-toggle="popover"]').popover();
    // $('[data-toggle="collapse"]').collapse();
    // eslint-disable-next-line no-undef
    $('[data-toggle="dropdown"]').dropdown();
  }

  async componentDidMount() {
    await this.initData();
    this.switchLang("it");
    this.switchCountry("it");
  }

  async initData(country = null) {
    //has state
    console.log("initData");
    let { elements, blocks, allFields } = await getData(country);
    this.setState({ elements, blocks, country, allFields });
    this.initBootstrap();
  }

  parseYml(yaml) {
    //HAS STATE
    this.setState({ loading: true });
    let obj = null;
    try {
      obj = jsyaml.load(yaml);
      // let errors =   fv.validatePubliccodeYml(obj);
      // if (errors) alert(errors);
    } catch (e) {
      alert("Error loading yaml");
      return;
    }
    if (!obj) {
      alert("Error loading yaml");
      return;
    }
    //TODO VALIDATE WITH SCHEMA
    let { languages, values, country } = ft.transformBack(obj);

    // let currentValues = null;
    let currentLanguage = languages ? languages[0] : null;
    // if (currentLanguage) currentValues = values[currentLanguage];

    //UPDATE STATE
    console.log('update state');
    this.setState({
      yaml,
      languages,
      values,
      country,
      loading: false,
      yamlLoaded: true
    });
    //RESET FORM
    this.switchLang(currentLanguage);
    if (country) this.switchCountry(country);
  }

  // eslint-disable-next-line no-unused-vars
  generate(formValues) {
    let lastGen = moment();
    this.setState({ loading: true, lastGen });
    //has state
    let { values, country, elements } = this.state;
    //values[currentLanguage] = formValues;
    let obj = ft.transform(values, country, elements);

    // let errors = await fv.validatePubliccodeYml(obj);
    // if (errors) alert(errors);

    //SET  TIMESTAMP
    this.showResults(obj);
  }



  validateExt(response) {
    let r = response.json();
    if (response.ok) {
      return r;
    } else {
      //status for validation error
      if (response.status == 422) {
        return r.then(() => {
          console.log('validation not ok');
          throw new SubmissionError(r);
        });
      } else {
        //other response failure, try to use internal validator then.
        console.error('some network failure occured');
        throw new Error('generic erorr')
      }
    }
  }

  /**
   * 
   * @param {form data} formValues 
   */
  validateAndGenerate(formValues) {
    let lastGen = moment();
    // let errors = {};

    this.setState({ loading: true, lastGen });
    this.props.onLoadingRemote(true);
    //has state
    let { values, country, elements, languages } = this.state;
    let currentLanguage = languages ? languages[0] : null;

    // console.log(formValues, values);

    values[currentLanguage] = formValues;
    let obj = ft.transform(values, country, elements);

    this.fakeLoading();
    // console.log(obj);

    //  using 
    //  Object.assign(obj, staticFieldsJson)
    //  something weird occur.
    //  needs to investigate further
    obj['publiccodeYmlVersion'] = '0.2';

    return postDataForValidation(obj)
      .then(this.validateExt)
      .then(v => {
        //  everything fine
        // console.log(v);

        this.setState({ loading: false });
        this.props.onLoadingRemote(false);
        // removing empty object
        // which caused a object {} in yaml results
        return this.showResults(this.removeEmpty(v));
      })
      .catch(e => {
        if (e instanceof SubmissionError) {
          return e.errors.then(r => {
            let errorObj = {};
            r.map(x => {
              //replacing all string with * language
              let key = x.Key.replace(/\/\*\//gi, '_');

              //replacing separator section from field
              key = key.replace(/\//gi, '_'); //replace / with _

              //BUG
              //removing language
              //this issue is well known: editor do not validate multi language
              //pc since its fields are not named following a lang sintax
              key = key.replace(/_it_/gi, '_'); //replace _it_ with _

              //description appear when a language is not set
              //avoided for the moment
              if (key != 'description')
                errorObj[key] = x.Reason;
            });
            // console.log(errorObj);

            //errors are now taken from state, see line 507 for details
            // this.props.form[APP_FORM].submitErrors = errorObj

            //errors are in state now
            //but in sidebar are rendered from form.submitErrors
            //state there is not updated
            this.setState({
              errors: errorObj,
              loading: false
            })
            this.props.onLoadingRemote(false);

            throw new SubmissionError(errorObj);
          })
        } else {
          //generic error use internal validator
          console.error('Generic error with remote validation, using local instead', e);

          //BUG
          //not working at the moment
          //need to figure out why _error subkeys
          //cause a crash
          //this will cause a wrong validation for subkeys
          let errorObj = this.validate(formValues);
          let err = {};
          Object.keys(errorObj).forEach(x => {
            if (!errorObj[x]._error)
              err[x] = errorObj[x];
          });
          console.log(err);

          this.setState({
            loading: false
          })
          this.props.onLoadingRemote(false);

          if (Object.keys(err).length === 0 && err.constructor === Object) {
            this.showResults(obj);
          } else {
            this.setState({
              errors: err
            })
            throw new SubmissionError(err);
          }
        }
      });
  }

  removeEmpty(obj) {
    // looking forward to replace with bind()
    const that = this;
    Object.keys(obj).forEach(function(key) {
      (Object.keys(obj[key]).length === 0 && obj[key].constructor === Object) && delete obj[key] ||
      (obj[key] && typeof obj[key] === 'object') && that.removeEmpty(obj[key])
    });
    return obj;
  }

  showResults(values) {
    //has state
    try {
      let mergedValue = Object.assign(staticFieldsJson, values);
      let tmpYaml = jsyaml.dump(mergedValue);
      let yaml = staticFieldsYaml + tmpYaml;
      this.setState({ yaml, loading: false });
    } catch (e) {
      console.error(e);
    }
  }

  submitFeedback() {
    //has state
    const title = "";
    const millis = 3000;
    const { form } = this.props;
    let { yaml, yamlLoaded } = this.state;
    let type = "success";
    let msg = "Success";
    
    //was syncErrors
    if (form[APP_FORM].submitErrors) {
      type = "error";
      msg = "There are some errors";
      yaml = null;
    } else {
      yamlLoaded = false;
    }


    this.props.notify({ type, title, msg, millis });
    //this.scrollToError(errors)
    this.setState({ yaml, yamlLoaded });
  }

  fakeLoading() {
    //has state
    setTimeout(() => {
      this.setState({ loading: false });
    }, 1000);
  }

  validate(contents) {
    //has state
    let errors = {};
    let { values, currentLanguage, elements } = this.state;

    //CHECK REQUIRED FIELDS
    let required = fv.validateRequired(contents, elements);
    //VALIDATE TYPES AND SUBOBJECT
    let objs_n_arrays = fv.validateSubTypes(contents, elements);
    errors = Object.assign(required, objs_n_arrays);
    console.log(contents, errors);


    //UPDATE STATE
    values[currentLanguage] = contents;
    this.setState({
      currentValues: contents,
      values,
      loading: true,
      error: null
    });
    this.fakeLoading();
    return errors;
  }

  async reset() {
    //has state
    this.props.initialize(APP_FORM, null);
    this.setState({
      search: null,
      yaml: null,
      loading: false,
      languages: [],
      values: {},
      currentValues: {},
      currentLanguage: null,
      country: null,
      error: null,
      blocks: null,
      elements: null,
      collapse: false,
      activeSection: null
    });
    this.props.notify({ type: "info", msg: "Reset" });
    await this.initData();
  }

  renderFoot() {
    //c
    let props = {
      reset: this.reset.bind(this),
      submitFeedback: this.submitFeedback.bind(this),
      yamlLoaded: this.state.yamlLoaded
    };
    return <Foot {...props} />;
  }

  renderSidebar() {
    //c with state
    let { yaml, loading, values, allFields } = this.state;
    let props = {
      yaml,
      loading,
      values,
      allFields,
      onLoadingRemote: this.onLoadingRemote,
      onLoad: this.parseYml.bind(this),
      onReset: this.reset.bind(this)
    };
    return <Sidebar {...props} />;
  }

  langSwitcher() {
    //c with state
    let { languages, currentLanguage, search } = this.state;
    let props = {
      languages,
      currentLanguage,
      search,
      switchLang: this.switchLang.bind(this),
      removeLang: this.removeLang.bind(this),
      onSearch: this.onSearch.bind(this)
    };
    return <LanguageSwitcher {...props} />;
  }

  removeLang(lng) {
    if (!confirm(`Are you sure you want to remove '${lng}'?`)) {
        return;
    }

    //has state
    let { values, languages, currentValues, currentLanguage } = this.state;
    //remove contents of lang
    delete values[lng];
    //remove  lang from list
    languages.splice(languages.indexOf(lng), 1);
    //manage state to move on other key
    let k0 = Object.keys(values) ? Object.keys(values)[0] : null;
    currentLanguage = k0 ? k0 : null;
    if (!currentLanguage) {
      currentLanguage = languages ? languages[0] : null;
    }
    currentValues = currentLanguage
      ? Object.assign({}, values[currentLanguage])
      : null;
    this.setState({ values, languages, currentValues, currentLanguage });
    this.props.initialize(APP_FORM, currentValues ? currentValues : {});
  }

  onSearch(search) {
    this.setState({
      search
    });
  }

  switchLang(lng) {
    //has state
    let { values, languages, currentValues, currentLanguage } = this.state;
    if (!lng || lng === currentLanguage) return;

    //save current language data
    if (currentLanguage)
      values[currentLanguage] = Object.assign({}, currentValues);

    if (languages.indexOf(lng) > -1) {
      // load previous lang data
      currentValues = Object.assign({}, values[lng]);
    } else {
      //clone current data and  then add language
      languages.push(lng);
      currentValues = {};
      if (currentLanguage && values[currentLanguage]) {
        let clonedValues = _.omitBy(values[currentLanguage], (value, key) => {
          return _.startsWith(key, SUMMARY + "_");
        });
        currentValues = Object.assign({}, clonedValues);
      }
    }
    //move to current lang
    currentLanguage = lng;

    let search = null;
    let activeSection = -1;
    if (languages && languages.length == 1) {
      activeSection = 0;
    }
    //update state
    this.setState({
      values,
      languages,
      currentValues,
      currentLanguage,
      search,
      activeSection
    });

    this.props.initialize(APP_FORM, currentValues);
  }

  async switchCountry(country) {
    //has state
    let { currentValues } = this.state;
    await this.initData(country);
    this.props.initialize(APP_FORM, currentValues);
  }

  onAccordion(activeSection) {
    //has state

    let offset = activeSection * 56;
    let currentScroll = document.getElementById(`content__main`).scrollTop;
    let diff = currentScroll - offset;

    if (diff > 0) {
      console.info("diff", diff);
      document.getElementById(`content__main`).scrollTop = offset;
    } else {
      console.warn("inviewport");
    }
    this.setState({ activeSection: activeSection });
  }

  render() {
    let {
      currentLanguage,
      blocks,
      activeSection,
      country,
      allFields,
      lastGen,
      errors
    } = this.state;

    // let errors = null;
    // let submitFailed = false;
    let { form } = this.props;

    if (form && form[APP_FORM]) {
      //errors are in state now
      // errors =
      //   form[APP_FORM] && form[APP_FORM].submitErrors
      //     ? form[APP_FORM].submitErrors
      //     : null;
    }

    return (
      <Fragment>
        <div className="content">
          <Head lastGen={lastGen} />
          {this.langSwitcher()}
          <div className="content__main" id="content__main">
            {currentLanguage &&
              blocks && (
                <EditorForm
                  activeSection={activeSection}
                  onAccordion={this.onAccordion.bind(this)}
                  // onSubmit={this.generate.bind(this)}
                  onSubmit={this.validateAndGenerate.bind(this)}
                  data={blocks}
                  // validate={this.validate.bind(this)}
                  country={country}
                  switchCountry={this.switchCountry.bind(this)}
                  errors={errors}
                  allFields={allFields}
                />
              )}
          </div>
          {currentLanguage && this.renderFoot()}
          <InfoBox />
        </div>
        {this.renderSidebar()}
      </Fragment>
    );
  }
}

export default Index;
