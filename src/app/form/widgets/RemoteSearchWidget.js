import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Field } from "redux-form";
import Info from "../../components/Info";
import { Combobox } from "react-widgets";
import validator from "validator";

class RSComponent extends Component {
  _localProps;

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      text: '',
      initialValue: false,
      reset: false,
      items: []
    };
    this.convertProps(props);
    this.onChange = this.onChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  convertProps(props) {
    //converting props array in obj
    const data = props.children.find(v => {
      return typeof v === 'object'
    });
    this._localProps = data;
  }

  query(value) {
    value = typeof value === 'object' ?
      value.ipa : value;
    const callParams = this._localProps.schema.ajax;
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const query = callParams.params(value);

    const myInit = {
      method: 'POST',
      headers: myHeaders,
      mode: 'cors',
      cache: 'default',
      body: JSON.stringify(query)
    };

    if (!validator.isURL(callParams.url, { require_tld: false }))
      return false;

    const request = new Request(
      callParams.url, myInit
    );

    fetch(request)
      .then(res => res.json())
      .then(
        (result) => {
          if (!result.hits && Array.isArray(result.hits)) throw Error('query malformed');
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.error(error)
          this.setState({
            text: value,
            isLoaded: true,
            error
          });
        }
      );
  }

  handleChange(event) {
    const val = event.target.value;
    console.log(val, event)
    if (this._localProps.input.onChange) {
      if (val == null) this._localProps.input.onChange("");
      else this._localProps.input.onChange(val);
    }
    this.setState({ text: val });
  }

  onChange(val) {
    if (val.length > 1)
      this.query(val);
    else
      this.query('');
    //return to editor
    if (this._localProps.input.onChange) {
      if (val == null) this._localProps.input.onChange("");
      else this._localProps.input.onChange(val.ipa);
    }
    //setting initial and actual value
    this.setState({ text: val, initialValue: false });
  }

  componentDidMount() {
    this.setState({ initialValue: true });
    this.query(this._localProps.input.value);
  }

	/**
	 * Data modelling
	 * @param result data
	 * @param item
	 * @returns {{link: string, description: *, ipa: (Document.ipa|*), value: string, pec: string}}
	 */
  modelData(result) {
    return {
      ipa: result.ipa,
      description: result.description,
      pec: result.pec
    };
  }

  manipulateData(items) {
    let res = [];
    let t = this;
    items.hits.hits
      .map((result) => {
        let out = [];
        let _source = result._source;
        out.push(t.modelData(_source));
        return out;
      })
      .forEach((r) => {
        r.forEach((result) => {
          res.push(result)
        });
      });
    return res;
  }

  getItem(items) {
    if (Array.isArray(items.hits.hits) && items.hits.hits.length > 0) {
      const item = items.hits.hits[0];
      return item._source;
    }
    return '';
  }

  render() {
    const { error, isLoaded, items, text, initialValue } = this.state;
    let ListItem = ({ item }) => (
      <span>
        {item.description + " "}
        <br />
        <strong>ipa: </strong>{item.ipa}
        <strong> pec: </strong>{item.pec}
      </span>
    );


    if ((error) || (!isLoaded)) {
      //fallback if network toward elastic has problems
      const field = this._localProps;
      return (
        <input
          value={text}
          onChange={this.handleChange}
          required={field.required}
          className="form-control"
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          minLength={field.minLength}
          disabled={field.schema.disabled}
        />
      );
    } else {
      return (
        <Combobox
          value={initialValue ? this.getItem(items) : text}
          onChange={this.onChange}
          textField={item => typeof item === 'string' ?
            item : item.description + ' (' + item.ipa + ')'}
          itemComponent={ListItem}
          data={this.manipulateData(items)}
        />
      );
    }
  }
}


const renderInput = field => {
  const className = classNames([
    "form-group", "riuso-box",
    { "has-error": field.meta.touched && field.meta.error }
  ]);
  return (
    <div className={className}>
      <label className="control-label" htmlFor={"field-" + field.name}>
        {field.label} {field.required ? "*" : ""}
      </label>

      <RSComponent>
        {...field}
        id={"field-" + field.fieldName}
        required={field.required}
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        minLength={field.minLength}
        disabled={field.disabled}

      </RSComponent>

      {field.meta.touched &&
        field.meta.error && (
          <span className="help-block">{field.meta.error}</span>
        )}
      {field.description && (
        <Info
          title={field.label ? field.label : field.name}
          description={field.description}
        />
      )}
    </div>
  );
};

const RemoteSearchWidget = props => {
  return (
    <Field
      component={renderInput}
      label={props.label}
      name={props.fieldName}
      required={props.required}
      disabled={props.disabled}
      id={"field-" + props.fieldName}
      placeholder={props.schema.default}
      description={props.schema.description}
      {...props}
    />
  );
};

RemoteSearchWidget.propTypes = {
  schema: PropTypes.object.isRequired,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  theme: PropTypes.object,
  multiple: PropTypes.bool,
  required: PropTypes.bool
};


export default RemoteSearchWidget;
