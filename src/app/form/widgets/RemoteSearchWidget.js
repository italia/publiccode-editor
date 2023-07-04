import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Info from "../../components/Info";
import { Combobox } from "react-widgets";
import validator from "validator";
import { useController, useFormContext } from "react-hook-form";
import { get } from "lodash";

const ListItem = ({ item }) => (
  <span>
    {item.description + " "}
    <br />
    <strong>ipa: </strong>
    {item.ipa}
    <strong> pec: </strong>
    {item.pec}
  </span>
);

/**
 * Data modelling
 * @param result data
 * @param item
 * @returns {{link: string, description: *, ipa: (Document.ipa|*), value: string, pec: string}}
 */
const modelData = (result) => ({
  ipa: result.ipa,
  description: result.description,
  pec: result.pec,
});

const manipulateData = (items) => {
  const res = [];
  items?.hits?.hits
    .map((result) => {
      const out = [];
      const _source = result._source;
      out.push(modelData(_source));
      return out;
    })
    .forEach((r) => {
      r.forEach((result) => {
        res.push(result);
      });
    });
  return res;
};

const getItem = (items) => {
  if (
    items?.hits?.hits &&
    Array.isArray(items.hits.hits) &&
    items.hits.hits.length > 0
  ) {
    const item = items.hits.hits[0];
    return item._source;
  }
  return "";
};

const RemoteSearchWidget = (props) => {
  const name = props.fieldName;
  const id = `field-${name}`;

  const [error, setError] = useState(null);
  const [text, setText] = useState("");
  const [initialValue, setInitialValue] = useState(false);
  const [items, setItems] = useState([]);
  const { control, formState } = useFormContext();
  const {
    field: { ref, ...inputProps },
    fieldState: { invalid },
  } = useController({
    name,
    control,
    defaultValue: props.schema.value || "",
  });
  const className = classNames(["form-group", { "has-error": invalid }]);

  useEffect(() => {
    setInitialValue(true);
    query(inputProps.value);
  }, [inputProps.value]);

  const query = (value) => {
    value = typeof value === "object" ? value.ipa : value;
    const callParams = props.schema.ajax;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const query = callParams.params(value);

    const myInit = {
      method: "POST",
      headers: myHeaders,
      mode: "cors",
      cache: "default",
      body: JSON.stringify(query),
    };

    if (!validator.isURL(callParams.url, { require_tld: false })) return false;

    const request = new Request(callParams.url, myInit);

    fetch(request)
      .then((res) => res.json())
      .then(
        (result) => {
          if (!result.hits && Array.isArray(result.hits))
            throw Error("query malformed");
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.error(error);
          setText(value);
          setError(error);
        }
      );
  };

  const handleChange = (event) => {
    const val = event.target.value;
    if (inputProps.onChange) {
      if (val == null) inputProps.onChange("");
      else inputProps.onChange(val);
    }
    setText(val);
  };

  const onChange = (val) => {
    if (val.length > 1) query(val, props.schema);
    else query("", props.schema);
    //return to editor
    if (inputProps.onChange) {
      if (val == null) inputProps.onChange("");
      else inputProps.onChange(val.ipa);
    }
    //setting initial and actual value
    setText(val);
    setInitialValue(false);
  };

  return (
    <div className={className}>
      <label className="control-label" htmlFor={id}>
        {props.label} {props.required ? "*" : ""}
      </label>

      {error ? (
        <input
          {...inputProps}
          value={text}
          ref={ref}
          id={id}
          onChange={handleChange}
          required={props.required}
          className="form-control"
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          minLength={props.minLength}
          disabled={props.disabled}
        />
      ) : (
        <Combobox
          {...inputProps}
          ref={ref}
          id={id}
          value={initialValue ? getItem(items) : text}
          onChange={onChange}
          textField={(item) =>
            typeof item === "string"
              ? item
              : item.description + " (" + item.ipa + ")"
          }
          renderListItem={ListItem}
          data={manipulateData(items)}
        />
      )}

      {invalid && (
        <span className="help-block">
          {get(formState.errors, name) && get(formState.errors, name).message}
        </span>
      )}
      <Info
        inputTitle={
          props.schema.rawTitle || props.fieldName || props.schema.title
        }
        description={props.schema.description}
      />
    </div>
  );
};

RemoteSearchWidget.propTypes = {
  schema: PropTypes.object.isRequired,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  theme: PropTypes.object,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
};

export default RemoteSearchWidget;
