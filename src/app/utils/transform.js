import {
  SUMMARY,
  GROUPS,
  AVAILABLE_COUNTRIES
} from "../contents/data";

import _ from "lodash";
import u from "updeep";
import cleanDeep from "clean-deep";
import { set } from "lodash";

const extractGroup = (items, group) => {
  let field_names = Object.keys(items);
  let filtered = field_names.filter(item => item.startsWith(group));
  let obj = filtered.reduce((acc, name) => {
    let key = name.split("_")[1];
    let value = items[name];
    acc[key] = value;
    return acc;
  }, {});
  return obj;
};

export const getGrouped = data => {
  let result = _
    .chain(data)
    .groupBy("group")
    .map((values, group) => ({ values, group }))
    .value();
  return result;
};

export const flatGroup = (data, group) => {
  if (!data[group]) return null;
  let g = Object.assign({}, data[group]);
  delete data[group];
  let flatten = Object.keys(g).reduce((obj, key) => {
    obj[`${group}_${key}`] = g[key];
    return obj;
  }, {});
  return Object.assign(flatten, data);
};

export const parseSummary = data => {
  if (!data[SUMMARY]) return null;
  // let languages = Object.keys(data[SUMMARY]);
  // let currentLanguage = languages[0];
};

export const getSummary = values => {
  if (!values) return;
  let obj = extractGroup(values, SUMMARY + "_");
  return obj;
};

export const cleanupGroup = (data, group) => {
  //f
  return _.omitBy(data, (value, key) => {
    return _.startsWith(key, `${group}_`);
  });
};

export const transformDepensOn = obj => {
  let map = {};
  if (obj.dependsOn) {
    obj.dependsOn.map(dp => {
      let cloned = Object.assign({}, dp);
      delete cloned.type;

      if (!map[dp.type]) map[dp.type] = [];
      map[dp.type].push(cloned);
    });
    obj.dependsOn = map;
  }
  return obj;
};

const importDepensOn = obj => {
  // let map = [];
  if (obj.dependsOn) {
    let types = Object.keys(obj.dependsOn);
    let map = types.reduce((a, type) => {
      let items = obj.dependsOn[type].map(i => {
        i.type = type;
        return i;
      });
      return [...a, ...items];
    }, []);
    obj.dependsOn = map;
  }
  return obj;
};

export const transformBack = obj => {
  //spit dependsOn child to array with types
  obj = importDepensOn(obj);

  //TRANSFORM DATA BACK:
  let groups = GROUPS.slice(0);

  let index = groups.indexOf(SUMMARY);
  if (index !== -1) groups.splice(index, 1);
  //- for each country check if data
  let country = null;
  AVAILABLE_COUNTRIES.forEach(cc => {
    if (obj[cc]) {
      groups.push(cc);
      country = cc;
    }
  });
  //- for each group get keys and read with prefix
  groups.map(group => {
    if (obj[group]) {
      Object.keys(obj[group]).forEach(k => {
        obj[`${group}_${k}`] = obj[group][k];
      });
      delete obj[group];
    }
  });
  //- get SUMMARY keys to detect langs
  let values = {};
  let languages = [];
  if (obj[SUMMARY]) {
    Object.keys(obj[SUMMARY]).map(language_key => {
      languages.push(language_key);
      values[language_key] = {};
      let lng = obj[SUMMARY][language_key];
      //for each language, get fields prefix with SUMMARY group
      Object.keys(lng).map(key => {
        values[language_key][`${SUMMARY}_${key}`] = lng[key];
      });
    });
  }
  delete obj[SUMMARY];

  //merge values per each language
  if (languages) {
    languages.forEach(lang => {
      values[lang] = u(obj, values[lang]);
    });
  } else {
    values = Object.assign({}, obj);
  }
  //TODO Remove fields not in list
  return { languages, values, country };
};

// eslint-disable-next-line no-unused-vars
const cleanupFields = (element, obj) => {
  let availableKeys = Object.keys(element);
  Object.keys(obj).forEach(k => {
    if (availableKeys.indexOf(k) == 0 || typeof obj[k] != element[k].type) {
      delete obj[k];
    }
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      obj[k] = transformBooleanValues(element[k], Object.assign({}, obj[k]));
    }
  });
  return obj;
};

const getElement = (elements, k) => {
  let e;
  if (typeof elements === "object" && !Array.isArray(elements)) {
    if (elements.title != 'dependsOn')
      e = elements.properties[k];
    else {
      elements = transformDepensOn(elements);
    }
  }
  else
    e = elements.find(v => { return v.title == k });
  return e;
}

const transformBooleanValues = (obj, elements) => {
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const e = elements.find(v => { return v.title == k });
      obj[k] = transformBooleanValues(Object.assign({}, obj[k]), e);
    } else if (
      !Array.isArray(obj[k]) &&
      (obj[k] == true ||
        obj[k] == false ||
        obj[k] == "true" ||
        obj[k] == "false")
    ) {
      if (getElement(elements, k).type == 'boolean') {
        if (obj[k] == true || obj[k] == "true") obj[k] = true;
        else obj[k] = false;
      }
    }
  });
  return obj;
};

export const transformLocalized = (values) => {
  const out = {};
  Object.keys(values).reduce((a, b) => {
    const key = b.replace(/_/gi, ".");
    a[key] = values[b];
    set(out, key, values[b]);
    return a;
  }, {})
  return out;
}

export const transform = (values, country, elements) => {
  let langs = Object.keys(values);

  //GET SUMMARY BEFORE MERGE
  let summary = langs.reduce((obj, lng) => {
    obj[lng] = getSummary(values[lng], lng);
    return obj;
  }, {});

  //MERGE ALL
  let merge = langs.reduce((acc, lng) => {
    return u(values[lng], acc);
  }, {});

  //GROUP FIELDS
  let obj = Object.assign({}, merge);
  obj = cleanupGroup(obj, SUMMARY);

  //DEPENS ON strip type and reorganize in subtype objects
  obj = transformDepensOn(obj);

  let groups = GROUPS.slice(0);
  if (country) {
    groups = [...groups, country];
  }
  delete groups[SUMMARY];

  //TRANSFORM  TRUE IN YES
  obj = transformBooleanValues(Object.assign({}, obj), elements);

  //REPLACE GROUPS
  groups.forEach(group => {
    let sub = extractGroup(obj, group);
    if (sub) {
      obj = cleanupGroup(obj, group);
      obj[group] = sub;
    }
  });

  //REPLACE SUMMARY
  obj[SUMMARY] = summary;
  return cleanDeep(obj);
};
