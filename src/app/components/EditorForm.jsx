import { DefaultTheme as Widgets } from "../form";
import renderField from "../form/renderField";
import Collapse from "rc-collapse";
import img_x from "../../assets/img/x.svg";
import img_accordion_open from "../../assets/img/accordion-open.svg";
import img_accordion_closed from "../../assets/img/accordion-closed.svg";
import { getFieldByTitle } from "../contents/data";
import { FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const renderBlockItems = (items, id, t) => {
  return items.map((item, i) => {
    // getField(item);
    let cn = item.cn ? item.cn : "block__item";
    if (item.type === "object") cn = "block__object";
    if (item.type === "hidden") cn = "";
    return (
      <div className={cn} key={`block_${id}_item_${i}`}>
        {renderField(
          item,
          item.title,
          Widgets,
          "",
          {},
          item.required === true,
          null,
          t
        )}
      </div>
    );
  });
};

const renderHeader = (props) => {
  let img_arrow = img_accordion_closed;
  if (props.activeSection[0] == props.block.index - 1) {
    img_arrow = img_accordion_open;
  }
  return (
    <span className={`clearfix ${props.hasError ? "error" : ""}`}>
      <img src={img_arrow} /> {props.block.index}.{" "}
      {props.t(`editor.sections.${props.block.title}`)}
      {props.hasError && (
        <span className="float-right error-info">
          <img src={img_x} />
        </span>
      )}
    </span>
  );
};

const renderBlocks = (
  blocks,
  activeSection,
  sectionsWithErrors,
  t
) => {
  return blocks.map((block, i) => {
    const hasError = sectionsWithErrors.indexOf(i) >= 0;
    const c = {
      showArrow: false,
      forceRender: true,
    };
    if (hasError) {
      c.headerClass = "rc-collapse-header-error";
    }
    return {
      className: `block__wrapper section_${i}`,
      id: `section_${i}`,
      key: i,
      ...c,
      label: renderHeader({ block, hasError, activeSection, t }),
      children: [
        <div className="block" key="div">
          {renderBlockItems(block.items, i, t)}
        </div>,
      ],
    };
  });
};

const EditorForm = (props) => {
  const {
    data,
    activeSection,
    allFields,
    submit,
    formMethods,
    languages,
    flatErrors,
  } = props;
  const { t } = useTranslation();

  const params = {
    accordion: true,
    defaultActiveKey: "0",
  };

  if (activeSection) {
    params.activeKey = activeSection === -1 ? "0" : activeSection;
  } else {
    params.activeKey = activeSection === 0 ? "0" : "";
  }

  let sectionsWithErrors = [];

  if (flatErrors) {
    sectionsWithErrors = flatErrors.reduce((s, e) => {
      const field = getFieldByTitle(allFields, e.key);
      if (field && s.indexOf(field.section) < 0) {
        s.push(field.section);
      }
      return s;
    }, []);
  }

  return (
    <div>
      <FormProvider {...formMethods}>
        <form onSubmit={submit}>
          {languages && (
            <Collapse
              onChange={props.onAccordion}
              {...params}
              items={renderBlocks(
                data,
                activeSection,
                sectionsWithErrors,
                t
              )}
            />
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export default EditorForm;

EditorForm.propTypes = {
  data: PropTypes.array.isRequired,
  activeSection: PropTypes.arrayOf(PropTypes.string),
  allFields: PropTypes.array.isRequired,
  submit: PropTypes.func.isRequired,
  formMethods: PropTypes.object.isRequired,
  languages: PropTypes.array.isRequired,
  flatErrors: PropTypes.array,
};
