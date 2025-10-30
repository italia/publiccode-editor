import { clone, cloneDeep, isEqual, mapValues } from "lodash";
import categories, { TCategory } from "../contents/categories";
import PublicCode, {
  Description,
  Italy,
  defaultConforme,
  defaultContact,
  defaultContractor,
  defaultDependency,
  defaultIntendedAudience,
  defaultItaly,
  defaultPiattaforme,
  defaultRiuso,
} from "../contents/publiccode";
import { removeEmpty } from "./remove-empty";

function validateCategories(categoriesArray: string[]): string[] {
  return categoriesArray.filter((category) =>
    categories.includes(category as TCategory),
  );
}

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
    categories: categories
      ? (validateCategories(categories) as (typeof categories)[number][])
      : undefined,
    usedBy: clone(usedBy),
    roadmap,
    developmentStatus,
    softwareType,
    intendedAudience: intendedAudience
      ? sortAs(defaultIntendedAudience, intendedAudience)
      : undefined,
    description: mapValues(description, sortDescription),
    legal: { license, mainCopyrightOwner, repoOwner, authorsFile },
    maintenance: {
      type,
      contractors: contractors?.map((c) => sortAs(defaultContractor, c)),
      contacts: contacts?.map((c) => sortAs(defaultContact, c)),
    },
    localisation: {
      localisationReady,
      availableLanguages: clone(availableLanguages),
    },
    dependsOn: dependsOn
      ? mapValues(dependsOn, (v) =>
          v ? v.map((d) => sortAs(defaultDependency, d)) : undefined,
        )
      : undefined,
    it:
      it === undefined || isEqual(removeEmpty(it), defaultItaly)
        ? undefined
        : lintItaly(it),
  };

  return removeEmpty(sortedPC);
}

function lintItaly({
  countryExtensionVersion,
  conforme,
  piattaforme,
  riuso,
}: Italy): Italy {
  return {
    countryExtensionVersion,
    conforme: conforme ? sortAs(defaultConforme, conforme) : undefined,
    piattaforme: piattaforme
      ? sortAs(defaultPiattaforme, piattaforme)
      : undefined,
    riuso: riuso ? sortAs(defaultRiuso, riuso) : undefined,
  };
}

function sortAs<T>(template: T, obj: T): T {
  const ret = cloneDeep(template);
  for (const key in template) {
    ret[key] = obj[key];
  }
  return ret;
}
