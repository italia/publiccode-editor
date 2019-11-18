import validator from "validator";
import _ from "lodash";
import compileSchema from "../form/compileSchema";


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
    delete yamlJsonSchema.$schema;
    delete yamlJsonSchema.id;

    const schema = compileSchema(yamlJsonSchema);
    if (!schema) reject(null);

    resolve(schema);
  });
};

export const validatePubliccodeYml = values => {

// eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    delete yamlJsonSchema.$schema;
    delete yamlJsonSchema.id;
    const schema = compileSchema(yamlJsonSchema);

    const valid = ajv.validate(schema, values);
    if (valid) {
      resolve(null);
    }
    const errors = ajv.errors;
    resolve(errors);
  });
};

const strip = html => {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export const checkField = (field, obj, value, required) => {
  if (required && !value) return "This property is required.";

  //TODO CHECK ARRAY OF OBJECTS AND OBJ WITH PROPS

  if (_.has(obj, 'minLength') && !validator.isLength(strip(value).trim(), {min: obj.minLength, max: undefined}))
    return "Not a valid input minimum length.";

  if (_.has(obj, 'maxLength') && !validator.isLength(strip(value).trim(), {min: undefined, max: obj.maxLength}))
    return "Not a valid input maximum length.";

  if (_.has(obj, 'fileExt') && Array.isArray(obj.fileExt)) {
    let extMatch = 0;
    obj.fileExt.forEach(ext => {
      if(value.toLowerCase().split('.').pop() == ext.toLowerCase())
        extMatch++;
    });
    if (extMatch == 0)
      return `Not a valid extension, allowed only: ${obj.fileExt}`;
  }

  if (obj && obj.widget) {
    let widget = obj.widget;

    if (widget && widget === "editor" && validator.isEmpty(strip(value).trim()))
      return "This property is required.";

    if (widget == "url" && !validator.isURL(value, {require_protocol: true})) {
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
  const valid = ajv.validate(schema, values);
  const errors = ajv.errors;
  if (valid) {
    return null;
  }
  return errors;
};

export const validateAll = (contents, elements) => {
  if (!elements) return;

  let errors = elements.reduce((e, schema) => {
    if (schema.required && schema.required == true) {
      delete schema.required;
    }
    let field = schema.title;
    let values = contents[field];
    e[field] = validateObj(schema, values);

    return e;
  }, {});
};

// eslint-disable-next-line no-unused-vars
const cloneArray = a => {
  if (!a) return null;
  return a.slice(0);
};

// eslint-disable-next-line no-unused-vars
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
