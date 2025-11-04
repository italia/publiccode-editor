import categories from "../categories";
import scopes from "../scopes";
// import licenses from "../../../generated/licenses.json";
import { allLangs, allCountries } from "../../../i18n";

const developmentStatus_list = [
  "concept",
  "development",
  "beta",
  "stable",
  "obsolete",
];
const softwareType_list = [
  "standalone/backend",
  "standalone/desktop",
  "standalone/iot",
  "standalone/mobile",
  "standalone/web",
  "standalone/other",
  "addon",
  "library",
  "configurationFiles",
];

export interface Field {
  section: number;
  title: string;
  type: string;
  description?: string;
  label?: string;
  language?: boolean;
  properties?: Record<
    string,
    { title: string; label?: string; [key: string]: unknown }
  >;
  required?: boolean;
  [key: string]: unknown;
}

const fields = (): Array<Field> => {
  /*
   * minLength and maxLength parameter to constraint string input size
   */
  return [
    {
      title: "publiccodeYmlVersion",
      type: "hidden",
      section: 0,
      required: true,
    },
    {
      title: "name",
      type: "string",
      section: 0,
      required: true,
    },
    {
      title: "releaseDate",
      type: "string",
      section: 2,
      required: true,
      widget: "date",
    },
    {
      title: "url",
      type: "string",
      widget: "url",
      section: 1,
      required: true,
    },
    {
      title: "applicationSuite",
      type: "string",
      section: 0,
    },
    {
      type: "string",
      title: "landingURL",
      section: 1,
      widget: "url",
    },
    {
        type: "array",
        title: "uri",
        section: 0,
        items: {
            type: "string",
            enum: [],
        },
        widget: "combobox",
        group: "organization",
    },
    {
      title: "localisedName",
      type: "string",
      section: 0,
      group: "description",
      language: true,
    },
    {
      title: "genericName",
      type: "string",
      section: 0,
      maxLength: 35,
      required: true,
      group: "description",
      language: true,
    },
    {
      title: "shortDescription",
      type: "string",
      section: 4,
      maxLength: 150,
      group: "description",
      language: true,
      required: true,
    },
    {
      title: "longDescription",
      type: "string",
      section: 4,
      group: "description",
      language: true,
      widget: "editor",
      required: true,
      minLength: 500,
      maxLength: 10000,
      cn: "block__item--full",
    },
    {
      title: "documentation",
      type: "string",
      section: 1,
      group: "description",
      widget: "url",
      language: true,
    },
    {
      title: "apiDocumentation",
      section: 1,
      group: "description",
      type: "string",
      widget: "url",
      language: true,
    },
    {
      title: "features",
      type: "array",
      items: {
        title: "feature",
        type: "object",
        properties: {
          value: {
            type: "string",
            title: "value",
          },
        },
      },
      section: 4,
      required: true,
      language: true,
      simpleStringArray: true, //hack...
      group: "description",
    },
    {
      title: "screenshots",
      type: "array",
      items: {
        type: "string",
        title: "screenshot",
      },
      section: 5,
      group: "description",
    },
    {
      title: "videos",
      type: "array",
      items: {
        type: "string",
        title: "video",
      },
      section: 5,
      group: "description",
    },
    {
      title: "awards",
      type: "array",
      items: {
        type: "string",
        title: "award",
      },
      section: 3,
      group: "description",
    },
    {
      title: "isBasedOn",
      type: "array",
      items: {
        type: "string",
        title: "isBasedOn",
      },
      section: 2,
      widget: "url",
    },
    {
      type: "string",
      title: "softwareVersion",
      section: 2,
    },
    {
      type: "string",
      title: "logo",
      section: 5,
      fileExt: ["svg", "svgz", "png"],
    },
    {
      type: "string",
      title: "monochromeLogo",
      section: 5,
      fileExt: ["svg", "svgz", "png"],
    },
    {
      title: "developmentStatus",
      type: "string",
      enum: developmentStatus_list,
      section: 2,
      required: true,
      widget: "choice-expanded",
    },
    {
      title: "softwareType",
      type: "string",
      enum: softwareType_list,
      section: 2,
      required: true,
      widget: "choice-expanded",
    },
    {
      title: "roadmap",
      type: "string",
      section: 1,
      widget: "url",
    },
    {
      type: "array",
      title: "platforms",
      examples: ["android", "ios"],
      items: {
        type: "string",
        enum: ["web", "windows", "mac", "linux", "ios", "android"],
      },
      required: true,
      section: 2,
      widget: "tags",
    },
    {
      type: "array",
      title: "license",
      section: 3,
      items: {
        type: "string",
        enum: [],
      },
      group: "legal",
      required: true,
      widget: "combobox",
    },
    {
      type: "string",
      title: "mainCopyrightOwner",
      section: 3,
      group: "legal",
    },
    {
      type: "string",
      title: "repoOwner",
      section: 3,
      group: "legal",
      required: false,
    },
    {
      title: "authorsFile",
      type: "string",
      section: 3,
      group: "legal",
    },
    {
      title: "categories",
      type: "array",
      items: {
        type: "string",
        title: "category",
        enum: categories,
      },
      section: 6,
      required: true,
      widget: "tags",
    },
    {
      title: "scope",
      type: "array",
      items: {
        type: "string",
        title: "scope",
        enum: scopes,
      },
      section: 6,
      group: "intendedAudience",
      widget: "tags",
    },
    {
      title: "countries",
      type: "array",
      items: {
        title: "item",
        type: "object",
        dataKey: "value",
        textField: "text",
        enum: allCountries(),
      },
      section: 6,
      group: "intendedAudience",
      widget: "tags",
    },
    {
      title: "unsupportedCountries",
      type: "array",
      items: {
        title: "item",
        type: "object",
        dataKey: "value",
        textField: "text",
        enum: allCountries(),
      },
      section: 6,
      group: "intendedAudience",
      widget: "tags",
    },
    {
      title: "usedBy",
      type: "array",
      items: {
        type: "string",
      },
      section: 3,
    },
    {
      title: "inputTypes",
      type: "array",
      items: {
        type: "string",
      },
      section: 2,
    },
    {
      title: "outputTypes",
      type: "array",
      items: {
        type: "string",
      },
      section: 2,
    },
    {
      title: "localisationReady",
      type: "boolean",
      section: 6,
      required: false,
      group: "localisation",
    },
    {
      title: "availableLanguages",
      type: "array",
      items: {
        title: "item",
        type: "object",
        dataKey: "value",
        textField: "text",
        enum: allLangs(),
      },
      widget: "tags",
      section: 4,
      required: true,
      group: "localisation",
    },
    {
      title: "type",
      type: "array",
      items: {
        type: "string",
      },
      uniqueItems: true,
      required: true,
      requireChildrenIf: [
        { title: "maintenance_contacts", values: ["internal", "community"] },
        { title: "maintenance_contractors", values: ["contract"] },
      ],
      enum: ["internal", "contract", "community", "none"],
      widget: "choice-expanded",
      section: 7,
      group: "maintenance",
    },
    {
      title: "contacts",
      type: "array",
      items: {
        title: "contact",
        type: "object",
        properties: {
          name: {
            type: "string",
            title: "name",
          },
          email: {
            type: "string",
            title: "Email",
            widget: "email",
          },
          phone: {
            type: "string",
            widget: "phone",
            title: "phone",
          },
          affiliation: {
            type: "string",
            title: "affiliation",
          },
        },
        required: ["name"],
      },
      section: 7,
      group: "maintenance",
      cn: "block__item--full",
      // required: true
    },
    {
      title: "contractors",
      type: "array",
      items: {
        title: "contractor",
        type: "object",
        properties: {
          name: {
            type: "string",
            title: "name",
          },
          until: {
            type: "string",
            title: "until",
            widget: "date",
          },
          website: {
            type: "string",
            title: "website",
            widget: "url",
          },
        },
        required: ["name", "until"],
      },
      section: 7,
      group: "maintenance",
      cn: "block__item--full",
    },
    {
      title: "dependsOn",
      type: "array",
      items: {
        title: "dependency",
        type: "object",
        properties: {
          type: {
            title: "type",
            type: "array",
            items: {
              type: "string",
            },
            enum: ["open", "proprietary", "hardware"],
            uniqueItems: true,
            widget: "choice-expanded",
          },
          name: {
            title: "name",
            type: "string",
          },
          versionMin: {
            type: "string",
            title: "versionMin",
          },
          versionMax: {
            type: "string",
            title: "versionMax",
          },
          version: {
            type: "string",
            title: "version",
          },
          optional: {
            title: "optional",
            type: "boolean",
          },
        },
        required: ["name", "type"],
      },
      section: 7,
      cn: "block__item--full",
    },
  ];
};
export default fields;
