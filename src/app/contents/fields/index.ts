// import uk from "./uk";
// import us from "./us";
import it from "./it";
import getFields from "./generic";

const sections = [
  "name",
  "repository-and-documentation",
  "software-details",
  "legal-and-reuse",
  "description-and-features",
  "logo-and-screenshots",
  "purpose-and-audience",
  "maintenance",
];

const groups = [
  "summary",
  "maintenance",
  "legal",
  "intendedAudience",
  "localisation",
];

const countrySpec = [
  // {
  //   code: "uk",
  //   name: "United Kingdom",
  //   fields: uk
  // },
  // {
  //   code: "us",
  //   name: "United States",
  //   fields: us
  // },
  {
    code: "it",
    name: "italia",
    fields: it,
  },
];
const available_countries = countrySpec.map((country) => country.code);
export default {
  countrySpec,
  sections,
  groups,
  available_countries,
};

export const fieldsAsync = () => {
  return getFields();
};

/*
Name
name, applicationSuite, genericName, localizedName

Repository & Documentation
URL, landingURL, roadmap, documentation, apiDocumentation

Software Details
version, developmentStatus, releaseDate, softwareType, inputTypes, outputTypes, isBasedOn, dependsOn

Legal & Reuse
license, authors, repoOwner, mainCopyrightOwner, codiceIPA, usedBy, awards

Description & Features
description, shortDescription, features, localizationReady, availableLanguages, it/piattaforme, it/conforme

Logo & Screenshots
logo, monochromeLogo, screenshots, videos

Purpose & Audience
scope, category, countries, unsupportedCountries

Maintainance
...

*/
