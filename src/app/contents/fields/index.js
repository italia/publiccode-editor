// import uk from "./uk";
// import us from "./us";
import it from "./it";
import fr from "./fr";
import getFields from "./generic";


const sections = [
  "name",
  "repositoryAndDocumentation",
  "softwareDetails",
  "legalAndReuse",
  "descriptionAndFeatures",
  "logoAndScreenshots",
  "purposeAndAudience",
  "maintenance"
];

const groups = [
  "summary",
  "maintenance",
  "legal",
  "intendedAudience",
  "localisation"
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
    fields: it
  },
  {
    code: "fr",
    name: "France",
    fields: fr
  }
];

export const defaultCountryCode= "it";

const available_countries = countrySpec.map(country => country.code);
const data = {
  countrySpec,
  sections,
  groups,
  available_countries
};

export const fieldsAsync = async (countryCode) => {
  return await getFields(countryCode);
};
export default data;

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
