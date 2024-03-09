import categories from "./categories";
import developmentStatus from "./developmentStatus";
import maintenanceTypes from "./maintenanceTypes";
import scopes from "./scopes";
import softwareTypes from "./softwareTypes";

// https://yml.publiccode.tools/schema.core.html
export default interface PublicCode {
  publiccodeYmlVersion: string;
  name: string;
  applicationSuite?: string;
  url: string;
  landingURL?: string;
  isBasedOn?: string;
  softwareVersion?: string;
  releaseDate: string; // “YYYY-MM-DD”
  logo?: string;
  platforms: Array<string>;
  categories: Array<(typeof categories)[number]>;
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

interface IntendedAudience {
  countries?: Array<string>;
  unsupportedCountries?: Array<string>;
  scope?: Array<(typeof scopes)[number]>;
}

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

interface Contractor {
  name: string;
  until: string; // “YYYY-MM-DD”
  email?: string;
  website?: string;
}

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

interface Italy {
  countryExtensionVersion: "1.0";
  conforme?: Conforme;
  piattaforme?: Piattaforme;
  riuso?: Riuso;
}

interface Conforme {
  lineeGuidaDesign?: boolean;
  modelloInteroperatibilita?: boolean;
  misureMinimeSicurezza?: boolean;
  gdpr?: boolean;
}

interface Piattaforme {
  spid?: boolean;
  cie?: boolean;
  anpr?: boolean;
  pagopa?: boolean;
  io?: boolean;
}

interface Riuso {
  codiceIPA: string;
}
