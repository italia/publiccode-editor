import {
  clone,
  cloneDeep,
  isArray,
  isEmpty,
  isObjectLike,
  isUndefined,
  mapValues,
} from "lodash";
import PublicCode, {
  Contact,
  Contractor,
  Dependency,
  Description,
  IntendedAudience,
  Italy,
} from "./contents/publiccode";

// PublicCode keys sorted as in the specs
export const publicCodeKeys = [
  "publiccodeYmlVersion",
  "name",
  "applicationSuite",
  "url",
  "landingURL",
  "isBasedOn",
  "softwareVersion",
  "releaseDate",
  "logo",
  "platforms",
  "categories",
  "usedBy",
  "roadmap",
  "developmentStatus",
  "softwareType",
  "intendedAudience",
  "description",
  "legal",
  "maintenance",
  "localisation",
  "dependsOn",
  "it",
] as const;

function sortDescription({
  genericName,
  localisedName,
  shortDescription,
  longDescription,
  documentation,
  apiDocumentation,
  features,
  screenshots,
  videos,
  awards,
}: Description): Description {
  return {
    genericName,
    localisedName,
    shortDescription,
    longDescription,
    documentation,
    apiDocumentation,
    features: features ? [...features] : undefined,
    screenshots: screenshots ? [...screenshots] : undefined,
    videos: videos ? [...videos] : undefined,
    awards: awards ? [...awards] : undefined,
  };
}

function sortIntendedAudience({
  countries,
  unsupportedCountries,
  scope,
}: IntendedAudience) {
  return { countries, unsupportedCountries, scope };
}

function sortContact({ name, email, phone, affiliation }: Contact) {
  return { name, email, phone, affiliation };
}

function sortContractor({ name, until, email, website }: Contractor) {
  return { name, until, email, website };
}

function sortDependency({
  name,
  versionMin,
  versionMax,
  version,
  optional,
}: Dependency) {
  return { name, versionMin, versionMax, version, optional };
}

export default function linter({
  publiccodeYmlVersion,
  name,
  applicationSuite,
  url,
  landingURL,
  isBasedOn,
  softwareVersion,
  releaseDate,
  logo,
  platforms,
  categories,
  usedBy,
  roadmap,
  developmentStatus,
  softwareType,
  intendedAudience,
  description,
  legal: { license, mainCopyrightOwner, repoOwner, authorsFile },
  maintenance: { type, contractors, contacts },
  localisation: { localisationReady, availableLanguages },
  dependsOn,
  it,
}: PublicCode): PublicCode {
  const sortedPC: PublicCode = {
    publiccodeYmlVersion,
    name,
    applicationSuite,
    url,
    landingURL,
    isBasedOn,
    softwareVersion,
    releaseDate,
    logo,
    platforms: clone(platforms),
    categories: clone(categories),
    usedBy: clone(usedBy),
    roadmap,
    developmentStatus,
    softwareType,
    intendedAudience: intendedAudience
      ? sortIntendedAudience(intendedAudience)
      : undefined,
    description: mapValues(description, sortDescription),
    legal: { license, mainCopyrightOwner, repoOwner, authorsFile },
    maintenance: {
      type,
      contractors: contractors?.map(sortContractor),
      contacts: contacts?.map(sortContact),
    },
    localisation: {
      localisationReady,
      availableLanguages: clone(availableLanguages),
    },
    dependsOn: dependsOn
      ? mapValues(dependsOn, (v) => (v ? v.map(sortDependency) : undefined))
      : undefined,
    it,
  };

  return removeEmpty(cloneDeep(sortedPC));
}

function removeEmpty<T>(obj: T): T {
  if (typeof obj !== "object") return obj;

  const ret = obj;

  for (const key in ret) {
    const val = removeEmpty(ret[key]);
    if (
      ((isArray(val) || isObjectLike(val)) && isEmpty(val)) ||
      isUndefined(val)
    ) {
      delete ret[key];
    }
  }

  return ret;
}

function lintItaly({ conforme, piattaforme, riuso }: Italy) {
  return {
    countryExtensionVersion: "1.0",
    conforme: conforme ? {} : undefined,
    piattaforme,
    riuso,
  };
}
