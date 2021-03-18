import _ from "lodash";
import data, { fieldsAsync } from "./fields";

const { sections, groups, available_countries, countrySpec } = data;

//export groups;
export const SUMMARY = "description";
export const DEPENDSON = "dependsOn";

export const GROUPS = groups;
export const SECTIONS = sections;
export const AVAILABLE_COUNTRIES = available_countries;

export const getData = async (countryCode = null, languages) => {
  const fields = await fieldsAsync();
  const countryFields = getCountryElements(countryCode);
  const allRawFields = getAllFields(fields, countryFields);
  const allFields = generateLangFields(allRawFields, languages);
  const blocks = generateBlocks(allFields);
  const elements = generateElements(blocks);
  const obj = { blocks, elements, allFields };
  return obj;
};

export const getFieldByTitle = (allFields, title) => {
  // flatten one properties level, see #87
  const out = allFields.reduce((acc, ele) => {
    if (ele.properties) {
      Object.values(ele.properties).forEach((value) => {
        acc.push({
          ...ele,
          title: `${ele.title}_${value.title}`,
          label: `${ele.label} ${value.label}`,
        });
      });
    } else {
      acc.push(ele);
    }
    return acc;
  }, []);

  return out.find((field) => field.title === title);
};

export const getLabel = (allFields, title) => {
  let field = getFieldByTitle(allFields, title);
  if (field) {
    return field.label ? field.label : field.title;
  }
  return null;
};

const generateLangFields = (allFields, languages) => {
  const notLang = allFields.filter(x => !x.language);
  const lang = allFields.filter(x => x.language);
  const out = [];
  lang.map(x => {
    languages.map((l) => {
      if (!x.title.includes(`${l}_`)) {
        out.push({...x, title: `${l}_${x.title}`, lang: l});
      }
    })
  });
  return out.concat(notLang);
};

const generateBlocks = (allFields) => {
  return sections.map((s, i) => {
    let fields = allFields.filter((obj) => obj.section === i);

    fields = _.partition(fields, (obj) => obj.prepend).flat();

    const items = fields.map((i) => {
      const prefix = i.group ? `${i.group}_` : "";
      if (!i.title.includes(prefix)) i.title = `${prefix}${i.title}`;
      return i;
    });
    return {
      title: s,
      index: i + 1,
      items,
    };
  });
};

export const removeAdditional = (allFields, obj) => {
  let validKeys = allFields.map((f) => f.title);
  Object.keys(obj).forEach((key) => validKeys.includes(key) || delete obj[key]);
  return obj;
};

const generateElements = (blocks) => {
  return blocks.reduce((merge, block) => {
    merge = [...merge, ...block.items];
    return merge;
  }, []);
};

const getCountryElements = (countryCode = null) => {
  let country = countrySpec.find((c) => c.code == countryCode);
  if (country) return country.fields;
  return null;
};

const getAllFields = (generic, countryFields = null) => {
  if (countryFields) return [...generic, ...countryFields];
  return generic;
};

// eslint-disable-next-line no-unused-vars
const flatAll = (allFields) => {
  console.log("flatAll", allFields);
  return allFields.reduce((list, f) => {
    let items = flatField(f);
    return [...list, ...items];
  }, []);
};

const flatField = (field) => {
  console.log("flatField", field.title, field.type);
  let items = [];
  if (field.type === "object") {
    items = flatObject(field);
  } else if (field.type === "array") {
    items = flatArray(field);
  } else {
    items.push(field);
  }
  return items;
};

const flatArray = (field) => {
  console.log("flatArray", field.title, field.type);
  return field.items.reduce((list, f) => {
    let items = flatField(f);
    return [...list, ...items];
  }, []);
};

const flatObject = (field) => {
  console.log("flatObject", field.title, field.type);
  return field.properties.reduce((list, f) => {
    let items = flatField(f);
    return [...list, ...items];
  }, []);
};
