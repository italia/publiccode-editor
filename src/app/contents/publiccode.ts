import categories from "./categories";
import developmentStatus from "./developmentStatus";
import maintenanceTypes from "./maintenanceTypes";
import scopes from "./scopes";
import softwareTypes from "./softwareTypes";

export const LATEST_VERSION = "0.5.0";
export const IT_COUNTRY_EXTENSION_VERSION = "1.0";

// https://yml.publiccode.tools/schema.core.html
export default interface PublicCode {
  publiccodeYmlVersion: string;
  name: string;
  applicationSuite?: string;
  url: string;
  landingURL?: string;
  isBasedOn?: string;
  softwareVersion?: string;
  releaseDate?: string; // “YYYY-MM-DD”
  logo?: string;
  platforms: Array<string>;
  categories?: Array<(typeof categories)[number]>;
  organisation?: Organisation;
  fundedBy?: Array<FundingOrganisation>;
  usedBy?: Array<string>;
  roadmap?: string;
  developmentStatus: (typeof developmentStatus)[number];
  softwareType: (typeof softwareTypes)[number];
  intendedAudience?: IntendedAudience;
  description: Record<string, Description>;
  legal: Legal;
  maintenance: Maintenance;
  localisation: Localisation;
  dependsOn?: DependsOn;
  it?: Italy;
}

export interface PublicCodeWithDeprecatedFields {
  monochromeLogo: string;
  legal: Pick<Legal, "authorsFile" | "repoOwner">;
  inputTypes?: Array<string>;
  outputTypes?: Array<string>;
  description: Record<string, Pick<Description, "genericName">>;
}

interface IntendedAudience {
  countries?: Array<string>;
  unsupportedCountries?: Array<string>;
  scope?: Array<(typeof scopes)[number]>;
}

export const defaultIntendedAudience: IntendedAudience = {
  countries: undefined,
  unsupportedCountries: undefined,
  scope: undefined,
};

export interface Description {
  genericName?: string;
  localisedName?: string;
  shortDescription: string; // max 150 chars
  longDescription: string; // min 150 chars, max 10000 chars, mandatory for at least one language
  documentation?: string;
  apiDocumentation?: string;
  features?: Array<string>; // mandatory for at least one language
  screenshots?: Array<string>;
  videos?: Array<string>;
  awards?: Array<string>;
}

interface Legal {
  license: string; // SPDX
  mainCopyrightOwner?: string;
  repoOwner?: string;
  authorsFile?: string;
}

interface Maintenance {
  type: (typeof maintenanceTypes)[number];
  contractors?: Array<Contractor>;
  contacts?: Array<Contact>;
}

interface Contact {
  name: string;
  email?: string;
  phone?: string;
  affiliation?: string;
}

export const defaultContact: Contact = {
  name: "",
  email: undefined,
  phone: undefined,
  affiliation: undefined,
};

interface Contractor {
  name: string;
  until: string; // “YYYY-MM-DD”
  email?: string;
  website?: string;
}

export const defaultContractor: Contractor = {
  name: "",
  until: "",
  email: undefined,
  website: undefined,
};

interface Localisation {
  localisationReady: boolean;
  availableLanguages: Array<string>;
}

interface DependsOn {
  open?: Array<Dependency>;
  proprietary?: Array<Dependency>;
  hardware?: Array<Dependency>;
}

interface Dependency {
  name: string;
  versionMin?: string;
  versionMax?: string;
  version?: string;
  optional?: boolean;
}

export const defaultDependency: Dependency = {
  name: "",
  versionMin: undefined,
  versionMax: undefined,
  version: undefined,
  optional: undefined,
};

export interface Italy {
  countryExtensionVersion: "1.0";
  conforme?: Conforme;
  piattaforme?: Piattaforme;
  riuso?: Riuso;
}

export const defaultItaly: Italy = {
  countryExtensionVersion: "1.0",
};

interface Conforme {
  lineeGuidaDesign?: boolean;
  modelloInteroperabilita?: boolean;
  misureMinimeSicurezza?: boolean;
  gdpr?: boolean;
}

export const defaultConforme: Conforme = {
  lineeGuidaDesign: undefined,
  modelloInteroperabilita: undefined,
  misureMinimeSicurezza: undefined,
  gdpr: undefined,
};

interface Piattaforme {
  spid?: boolean;
  cie?: boolean;
  anpr?: boolean;
  pagopa?: boolean;
  io?: boolean;
}

export const defaultPiattaforme: Piattaforme = {
  spid: undefined,
  cie: undefined,
  anpr: undefined,
  pagopa: undefined,
  io: undefined,
};

interface Riuso {
  codiceIPA: string;
}

export const defaultRiuso: Riuso = { codiceIPA: "" };

export const publicCodeDummyObjectFactory = () =>
  ({
    publiccodeYmlVersion: LATEST_VERSION,
    name: "",
    applicationSuite: "",
    url: "",
    landingURL: "",
    isBasedOn: "",
    softwareVersion: "",
    releaseDate: "",
    logo: "",
    platforms: [],
    categories: undefined,
    organisation: undefined,
    fundedBy: [],
    usedBy: [],
    roadmap: "",
    developmentStatus: "stable",
    softwareType: "library",
    intendedAudience: {},
    description: {},
    legal: { license: "" },
    maintenance: { contacts: [], contractors: [], type: "none" },
    localisation: { availableLanguages: [], localisationReady: false },
    dependsOn: {},
    it: defaultItaly,
  }) satisfies PublicCode;

export interface Organisation {
  uri: string;
}

export type { Organisation as TOrganisation };

export interface FundingOrganisation {
  name: string;
  uri?: string;
}

export const defaultFundingOrganisation: FundingOrganisation = {
  name: "",
  uri: undefined,
};
