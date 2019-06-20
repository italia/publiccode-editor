import * as val from '../app/utils/validate';
import {
  getData
} from "../app/contents/data";
import jsyaml from "../../node_modules/js-yaml/dist/js-yaml.js";
import * as ft from "../app/utils/transform";

const contents = {
  categories: ["applicant-tracking"],
  dependsOn: [{
    name: "MySQL, NFC",
    type: "open"
  }],
  description_features: ["boh, una"],
  description_genericName: "Test generic name",
  description_longDescription: "Ciao ciao ciao ciao↵↵- prova 1↵- prova 2↵- prova 3↵↵​↵↵ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ↵↵ciao ciao ↵↵ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ↵↵ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ↵",
  description_shortDescription: "short desc",
  developmentStatus: "concept",
  intendedAudience_countries: ["ab"],
  intendedAudience_scope: ["employment"],
  intendedAudience_unsupportedCountries: ["aa"],
  it_conforme: {
    gdpr: true
  },
  it_countryExtensionVersion: "0.2",
  it_piattaforme: {
    cie: true,
    spid: true
  },
  it_riuso: {
    codiceIPA: "cmdr-001"
  },
  legal_authorsFile: "io",
  legal_license: "AFL-1.1",
  legal_mainCopyrightOwner: "me",
  legal_repoOwner: "you",
  localisation_availableLanguages: ["en", "es", "it"],
  localisation_localisationReady: "false",
  logo: "img/a.svg",
  maintenance_contacts: [{
    name: "tet2",
    phone: "06459808",
    email: "asdas@as.it",
    affiliation: "none"
  }],
  maintenance_type: "internal",
  monochromeLogo: "img/b.png",
  name: "Test",
  platforms: ["windows"],
  publiccodeYmlVersion: "0.2",
  releaseDate: "2019-04-08",
  softwareType: "addon",
  url: "https://google.it",
}

const yaml = `# This repository adheres to the publiccode.yml standard by including this 
# metadata file that makes public software easily discoverable.
# More info at https://github.com/italia/publiccode.yml

publiccodeYmlVersion: '0.2'
name: Test
releaseDate: '2019-04-08'
url: 'https://google.it'
developmentStatus: concept
softwareType: addon
platforms:
  - windows
categories:
  - applicant-tracking
dependsOn:
  open:
    - name: 'MySQL, NFC'
logo: img/a.svg
monochromeLogo: img/b.png
maintenance:
  type: internal
  contacts:
    - name: tet2
      phone: 06459808
      email: asdas@asdas.it
      affiliation: none
legal:
  license: AFL-1.1
  mainCopyrightOwner: me
  repoOwner: you
  authorsFile: io
intendedAudience:
  scope:
    - employment
  countries:
    - ab
  unsupportedCountries:
    - aa
localisation:
  localisationReady: true
  availableLanguages:
    - en
    - es
    - it
it:
  countryExtensionVersion: '0.2'
  piattaforme:
    cie: true
    spid: true
  riuso:
    codiceIPA: cmdr-001
  conforme:
    gdpr: true
description:
  it:
    genericName: Test generic name
    shortDescription: short desc
    longDescription: >
      Ciao ciao ciao ciao


      - prova 1

      - prova 2

      - prova 3


    
      ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao 


      ciao ciao 


      ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao
      ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao 


      ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao
      ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao
      ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao
      ciao ciao ciao ciao ciao ciao ciao ciao ciao 
    features:
      - 'boh, una'
`;
const yml = "\n\t\r";
test('yml parser', () => {
  expect(jsyaml.load(yaml)).not.toBeNull();
});

test('yml parser', () => {
  expect(jsyaml.load(yml)).toBeNull();
});

test('validate json data', () => {
  let errors = {};
  expect.assertions(1);
  return getData('it').then((res) => {
    //CHECK REQUIRED FIELDS
    let required = val.validateRequired(contents, res.elements);
    //VALIDATE TYPES AND SUBOBJECT
    let objs_n_arrays = val.validateSubTypes(contents, res.elements);
    errors = Object.assign(required, objs_n_arrays);
    // console.log(errors)
    expect(errors).toEqual({});
  });
});

describe('test yaml data', () => {
  const json = jsyaml.load(yaml);
  let { languages, values, country } = ft.transformBack(json);

  test('transformed yaml data', () => {
    expect(languages.length).toBe(1);
    expect(languages[0]).toBe('it');
    expect(country).toBe('it');
  });
  test('check structure transformed yaml data', () => {
    expect(typeof values).toBe('object');
  });
});

test('validate yaml data', () => {
  const json = jsyaml.load(yaml);
  let errors = {};
  expect.assertions(1);
  return getData('it').then((res) => {
    //transform data
    let { languages, values, country } = ft.transformBack(json);
    // console.log(values[country], languages, country)
    //CHECK REQUIRED FIELDS
    let required = val.validateRequired(values[country], res.elements);
    //VALIDATE TYPES AND SUBOBJECT
    let objs_n_arrays = val.validateSubTypes(values[country], res.elements);
    errors = Object.assign(required, objs_n_arrays);
    // console.log(errors)
    expect(errors).toEqual({});
  });
});
