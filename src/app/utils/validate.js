import validator from "validator";
import u from "updeep";
import _ from "lodash";
import compileSchema from "../form/compileSchema";
import {Field, reduxForm, FormSection, change, touch, blur} from 'redux-form';

import Ajv from "ajv";

const ajv = new Ajv({
  errorDataPath: "property",
  allErrors: false,
  jsonPointers: false
});
const yamlJsonSchema = require("../yaml_validation_schema.json");
const editorJsonSchema = require("../editor_generator_schema.json");

export const trnsformSchema = values => {
  return new Promise((resolve, reject) => {
    console.log("editorJsonSchema", editorJsonSchema);
    delete yamlJsonSchema.$schema;
    delete yamlJsonSchema.id;

    const schema = compileSchema(yamlJsonSchema);
    if (!schema) reject(null);

    console.log("compiled schema", schema);
    resolve(schema);
  });
};

export const validatePubliccodeYml = values => {
  return new Promise((resolve, reject) => {
    console.log("validatePubliccodeYml", yamlJsonSchema);
    delete yamlJsonSchema.$schema;
    delete yamlJsonSchema.id;
    const schema = compileSchema(yamlJsonSchema);
    console.log("compiled schema", schema);
    const valid = ajv.validate(schema, values);
    if (valid) {
      console.log("schema is valid");
      resolve(null);
    }
    const errors = ajv.errors;
    console.log("errors", errors);
    resolve(errors);
  });
};

const strip = html => {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export const checkField = (field, obj, value, required) => {
  // console.log(`checkField=${field} type=${obj.type} widget=${obj.widget}`);
  if (required && !value) return "This property is required.";

  //TODO CHECK ARRAY OF OBJECTS AND OBJ WITH PROPS

  if (_.has(obj, 'minLength') && !validator.isLength(strip(value).trim(), {min: obj.minLength, max: undefined}))
    return "Not a valid input minimum length.";

  if (_.has(obj, 'maxLength') && !validator.isLength(strip(value).trim(), {min: undefined, max: obj.maxLength}))
    return "Not a valid input maximum length.";


  if (obj && obj.widget) {
    let widget = obj.widget;

    if (widget && widget === "editor" && validator.isEmpty(strip(value).trim()))
      return "This property is required.";

    if (widget == "url" && !validator.isURL(value)) {
      return "Not a valid Url";
    }
    if (widget == "email" && !validator.isEmail(value)) {
      return "Not a valid email";
    }

  }

  // if (obj && obj.type === "email" && value && !validator.isEmail(value)) {
  //   return "Not a valid email";
  // }

  return null;
};

export const validateRequired = (contents, elements) => {
  let errors = {};
  let required = elements.filter(obj => obj.required);

  //flatMap is not supported by few, very few major browsers
  // let skipDepRequired = elements
  //   .filter(obj => obj.requireChildrenIf)
  //   .flatMap(sdr => sdr.requireChildrenIf
  //     .map(sdri => sdri.title)); //it will extract fields with dynamic required

  let skipDepRequired = elements
    .filter(obj => obj.requireChildrenIf)
    .reduce((acc, x) =>
      acc.concat([x.requireChildrenIf], []))
    .requireChildrenIf
    .map(sdri => sdri.title); //it will extract fields with dynamic required
  

  required.map(rf => {
    let content = null;
    let field = rf.title;

    let obj = elements.find(item => item.title == field);
    if (rf.widget && rf.widget === "editor") {
      content = contents[field] ? strip(contents[field]).trim() : null;
    } else {
      content = contents[field];
    }


    //REQUIRED BLOCKS
    if (!content && !skipDepRequired.includes(field)) {
      //(obj.type == "array" && obj.items.type == "object")
      if (obj && obj.required && (obj.type == "object" || obj.type == "array")) {
        errors[field] = {_error: "Required"};
      } else {
        errors[field] = "This property is required.";
      }
    }

    //logical validation
    if (obj.requireChildrenIf) {
      Object.keys(obj.requireChildrenIf).forEach(key => {
        let el = obj.requireChildrenIf[key];

        let child = elements.find(item => item.title == el.title);
        if (child) {
          // console.log(el, child, contents[field], el.values, contents[child.title])
          if (el.values.includes(contents[field]) &&
            (!contents[child.title] || contents[child.title].length == 0)
          ) {
            child.required = true;
            if (child && (child.type == "object" || child.type == "array")) {
              errors[child.title] = {_error: "Required"};
            } else {
              errors[child.title] = "This property is required.";
            }
          } else {
            delete errors[child.title];
            child.required = false;
          }
        }
      });
    }
  });

  return errors;
};

const validateObj = (schema, values) => {
  console.log("VALIDATE OBJ", schema.title);

  const valid = ajv.validate(schema, values);
  const errors = ajv.errors;
  if (valid) {
    return null;
  }
  return errors;
};

export const validateAll = (contents, elements) => {
  if (!elements) return;
  console.log("VALIDATE ALL");

  let errors = elements.reduce((e, schema) => {
    if (schema.required && schema.required == true) {
      delete schema.required;
    }
    let field = schema.title;
    let values = contents[field];
    e[field] = validateObj(schema, values);

    return e;
  }, {});
  console.log("ERRORS", errors);
};

const cloneArray = a => {
  if (!a) return null;
  return a.slice(0);
};

const cloneObj = o => {
  return Object.assign({}, o);
};

export const validateSubTypes = (contents, elements) => {
  let errors = {};

  //validateAll(cloneObj(contents), cloneArray(elements));
  //let e = validateObj(obj, obj_values);

  Object.keys(contents).map(field => {
    let obj = elements.find(item => item.title == field);
    let obj_values = contents[field];

    //VALIDATE ARRAY OF OBJS
    if (obj) {
      if (
        obj.type === "array" &&
        obj.items.type === "object" &&
        obj.items.required &&
        obj_values
      ) {
        let requiredFields = obj.items.required;
        let values = obj_values;
        let errorList = [];
        values.forEach((member, index) => {
          let error = {};
          requiredFields.forEach(rf => {
            if (!member || !member[rf]) {
              error[rf] = "This property is required";
              errorList[index] = error;
            }
          });
        });

        if (errorList.length) {
          errors[field] = errorList;
          // } else {
          //   let e = validateObj(obj, obj_values);
        }
      } else {
        //VALIDATE SIMPLE FIELDS
        let e = checkField(field, obj, obj_values, obj.required);
        if (e) errors[field] = e;
      }
    }
  });
  return errors;
};
