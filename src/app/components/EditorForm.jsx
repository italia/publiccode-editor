import { DefaultTheme as Widgets } from "../form";
import renderField from "../form/renderField";
import CountrySwitcher from "./CountrySwitcher";
import Collapse, { Panel } from "rc-collapse";
import img_x from "../../asset/img/x.svg";
import img_accordion_open from "../../asset/img/accordion-open.svg";
import img_accordion_closed from "../../asset/img/accordion-closed.svg";
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
        {renderField(item, item.title, Widgets, "", {}, item.required === true, null, t)}
      </div>
    );
  });
};

const renderHeader = (props) => {
  let img_arrow = img_accordion_closed;
  if (props.activeSection == props.block.index - 1) {
    img_arrow = img_accordion_open;
  }
  return (
    <span className={`clearfix ${props.hasError ? "error" : ""}`}>
      <img src={img_arrow} /> {props.block.index}. {props.t(`editor.sections.${props.block.title}`)}
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
  countryProps,
  sectionsWithErrors,
  t
) => {
  return blocks.map((block, i) => {
    const last = blocks.length === i + 1;
    const hasError = sectionsWithErrors.indexOf(i) >= 0;
    const c = {
      showArrow: false,
      forceRender: true,
    };
    if (hasError) {
      c.headerClass = "rc-collapse-header-error";
    }
    return (
      <Panel
        className={`block__wrapper section_${i}`}
        id={`section_${i}`}
        key={i}
        {...c}
        header={renderHeader({ block, hasError, activeSection, t })}
      >
        {last && <CountrySwitcher {...countryProps} />}
        <div className="block">{renderBlockItems(block.items, i, t)}</div>
      </Panel>
    );
  });
};

const EditorForm = (props) => {
  const {
    data,
    activeSection,
    country,
    switchCountry,
    allFields,
    submit,
    formMethods,
    languages,
    flatErrors,
  } = props;
  const { t } = useTranslation();

  const countryProps = { country, switchCountry };

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
          {languages && languages.length > 0 ? (
            <Collapse onChange={props.onAccordion} {...params}>
              {renderBlocks(
                data,
                activeSection,
                countryProps,
                sectionsWithErrors,
                t
              )}
            </Collapse>
          ) : (
            <div>{t("editor.nolanguage")}</div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export default EditorForm;

EditorForm.propTypes = {
  data: PropTypes.array.isRequired,
  activeSection: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  country: PropTypes.string.isRequired,
  // switchCountry: PropTypes.func.isRequired,
  allFields: PropTypes.array.isRequired,
  submit: PropTypes.func.isRequired,
  formMethods: PropTypes.object.isRequired,
  languages: PropTypes.array.isRequired,
  flatErrors: PropTypes.array,
};
