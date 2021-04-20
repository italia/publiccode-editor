import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import RichTextEditor from "react-rte";
import Info from "../../components/Info";
import { useController, useFormContext } from "react-hook-form";
import { get } from "lodash";

const emptyVal = RichTextEditor.createEmptyValue();

class MyEditor extends Component {
  constructor(props) {
    super(props);
    //let value = this.props.value  ? RichTextEditor.createValueFromString(this.props.value, "html") : emptyVal;
    let text = emptyVal;
    if (this.props.value) {
      text = RichTextEditor.createValueFromString(this.props.value, "markdown");
    }
    this.state = {
      text,
      count: 0,
      reset: false,
    };
    this.onChange = this.onChange.bind(this);
  }

  strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  onChange(val) {
    if (this.props.onChange) {
      if (val === null) this.props.onChange("");
      else this.props.onChange(val.toString("markdown"));
    }
    this.setState({ text: val, count: val.toString("markdown").trim().length });
  }

  componentWillReceiveProps(next) {
    if (!next.value) {
      this.setState({ text: emptyVal, reset: true });
    } else {
      if (next.pristine && next.initial) {
        let next_html = RichTextEditor.createValueFromString(
          next.initial,
          "markdown"
        );
        this.setState({ text: next_html });
      } else {
        let next_html = RichTextEditor.createValueFromString(
          next.value,
          "markdown"
        );
        this.setState({ text: next_html });
      }
    }
  }

  render() {
    return (
      <div>
        <RichTextEditor
          className="editor__component"
          toolbarClassName="editor__toolbar"
          editorClassName="editor__content"
          value={this.state.text}
          onChange={this.onChange}
        />
        {this.props.maxLength && (
          <Info
            description={
              this.state.count + "/" + this.props.maxLength + " chars used"
            }
          />
        )}
      </div>
    );
  }
}

const EditorWidget = (props) => {
  const name = props.fieldName;
  const id = `field-${name}`;
  const { control, formState } = useFormContext();
  const {
    field: { ref, ...inputProps },
    meta: { invalid },
  } = useController({
    name,
    control,
    defaultValue: props.schema.value || "",
  });
  const className = classNames(["form-group", { "has-error": invalid }]);

  return (
    <div className={className}>
      <label className="control-label" htmlFor={id}>
        {props.label} {props.schema.language ? `(${props.schema.lang})` : ""}{" "}
        {props.required ? "*" : ""}
      </label>
      <div className="editor__wrapper">
        <MyEditor
          {...inputProps}
          ref={ref}
          pristine={props.pristine}
          initial={props.initial}
          id={id}
          required={props.required}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
        />
      </div>
      {invalid && (
        <span className="help-block">
          {get(formState.errors, name) && get(formState.errors, name).message}
        </span>
      )}
      {props.schema.description && (
        <Info
          inputTitle={
            props.schema.rawTitle || props.fieldName || props.schema.title
          }
          title={props.schema.label ? props.schema.label : name}
          description={props.schema.description}
        />
      )}
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
