import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import RichTextEditor from "react-rte";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";
import { get } from "lodash";

const EditorWidget = (props) => {
  const name = props.fieldName;
  const id = `field-${name}`;
  const { control, formState } = useFormContext();
  const {
    field: { ref, ...inputProps },
    fieldState: { invalid },
  } = useController({
    name,
    control,
    defaultValue: props.schema.value || props.defaultValue || "",
  });
  const className = classNames(["form-group", { "has-error": invalid }]);
  const [count, setCount] = useState(0);
  const [richValue, setRichValue] = useState(RichTextEditor.createEmptyValue());
  const [text, setText] = useState(inputProps.value);

  useEffect(() => {
    if (inputProps.value !== text) {
      setText(inputProps.value);
      setRichValue(
        RichTextEditor.createValueFromString(inputProps?.value, "markdown")
      );
    }
    setCount(inputProps.value.trim().length);
  }, [inputProps.value]);

  const onChange = (val) => {
    setRichValue(val);
    const r = val.toString("markdown");
    setText(r);
    inputProps.onChange(r);
  };

  return (
    <div className={className}>
      <label className="control-label" htmlFor={id}>
        {props.label} {props.schema.language ? `(${props.schema.lang})` : ""}{" "}
        {props.required ? "*" : ""}
      </label>
      <div className="editor__wrapper">
        <RichTextEditor
          {...inputProps}
          className="editor__component"
          toolbarClassName="editor__toolbar"
          editorClassName="editor__content"
          value={richValue}
          ref={ref}
          pristine={props.pristine}
          initial={props.initial}
          id={id}
          required={props.required}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          onChange={onChange}
        />
      </div>
      {invalid && (
        <span className="help-block">
          {get(formState.errors, name) && get(formState.errors, name).message}
        </span>
      )}
      {props.maxLength && (
        <Info description={count + "/" + props.maxLength + " chars used"} />
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

EditorWidget.propTypes = {
  schema: PropTypes.object.isRequired,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  theme: PropTypes.object,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
};

export default EditorWidget;
