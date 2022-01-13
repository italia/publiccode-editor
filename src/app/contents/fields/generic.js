import categories from "../categories";
import scopes from "../scopes";
import licenses from "../licenses";
import langs from "../langs";
import countries from "../countries";
import { createT } from "../../i18n";

const developmentStatus_list = [
  "concept",
  "development",
  "beta",
  "stable",
  "obsolete"
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
  "configurationFiles"
];

let versions = null;

const fields = async (countryCode) => {
  if (!versions) {
    // console.log("get versions");
    try {
      //disabled get remote versions from repository
      // versions = await getReleases(versionsUrl);
      versions = ["development", "0.1"];
    } catch (e) {
      versions = ["development", "0.1"];
    }
  } else {
    versions = await Promise.resolve(versions);
  }

  const genField = title => {

    const { t } = createT(countryCode);

    return {
      title,
      ...Object.fromEntries(
        ["label", "description"]
          .map(name => [name, t(`field-${title}-${name}`)])
      )
    };

  };

  /*
   * minLength and maxLength parameter to constraint string input size
   */
  return [
    {
      ...genField("name"),
      type: "string",
      section: 0,
      required: true
    },
    {
      ...genField("releaseDate"),
      type: "string",
      section: 2,
      required: true,
      widget: "date"
    },
    {
      ...genField("url"),
      type: "string",
      widget: "url",
      section: 1,
      required: true
    },
    {
      ...genField("applicationSuite"),
      type: "string",
      section: 0
    },
    {
      ...genField("landingURL"),
      type: "string",
      section: 1,
      widget: "url"
    },
    {
      ...genField("localisedName"),
      type: "string",
      section: 0,
      group: "description"
    },
    {
      ...genField("genericName"),
      type: "string",
      section: 0,
      maxLength: 35,
      required: true,
      group: "description"
    },
    {
      ...genField("shortDescription"),
      type: "string",
      section: 4,
      maxLength: 150,
      group: "description",
      required: true
    },
    {
      ...genField("longDescription"),
      type: "string",
      section: 4,
      group: "description",
      widget: "editor",
      required: true,
      minLength: 500,
      maxLength: 10000,
      cn: "block__item--full"
    },
    {
      ...genField("documentation"),
      type: "string",
      section: 1,
      group: "description",
      widget: 'url'
    },
    {
      ...genField("apiDocumentation"),
      section: 1,
      group: "description",
      type: "string",
      widget: 'url'
    },
    {
      ...genField("features"),
      type: "array",
      items: {
        type: "string",
        title: "feature",
        maxLength: 100,
      },
      section: 4,
      required: true,
      group: "description"
    },
    {
      ...genField("screenshots"),
      type: "array",
      items: {
        type: "string",
        title: "screenshot"
      },
      section: 5,
      group: "description"
    },
    {
      ...genField("videos"),
      type: "array",
      items: {
        type: "string",
        title: "video"
      },
      section: 5,
      group: "description"
    },
    {
      ...genField("awards"),
      type: "array",
      items: {
        type: "string",
        title: "award"
      },
      section: 3,
      group: "description"
    },
    {
      ...genField("isBasedOn"),
      type: "array",
      items: {
        type: "string",
        title: "isBasedOn"
      },
      section: 2,
      widget: "url"
    },

    {
      ...genField("softwareVersion"),
      type: "string",
      section: 2
    },
    {
      ...genField("logo"),
      type: "string",
      section: 5,
      fileExt: ['svg', 'svgz', 'png']
    },
    {
      ...genField("monochromeLogo"),
      type: "string",
      section: 5,
      fileExt: ['svg', 'svgz', 'png']
    },
    {
      ...genField("developmentStatus"),
      type: "string",
      enum: developmentStatus_list,
      section: 2,
      required: true,
      widget: "choice-expanded"
    },
    {
      ...genField("softwareType"),
      type: "string",
      enum: softwareType_list,
      section: 2,
      required: true,
      widget: "choice-expanded"
    },
    {
      ...genField("roadmap"),
      type: "string",
      section: 1,
      widget: "url"
    },
    {
      ...genField("platforms"),
      type: "array",
      examples: ["android", "ios"],
      items: {
        type: "string",
        enum: ["web", "windows", "mac", "linux", "ios", "android"]
      },
      required: true,
      section: 2,
      widget: "tags"
    },
    {
      ...genField("license"),
      type: "array",
      section: 3,
      items: {
        type: "string",
        enum: licenses
      },
      group: "legal",
      required: true,
      widget: "combobox"
    },
    {
      ...genField("mainCopyrightOwner"),
      type: "string",
      section: 3,
      group: "legal"
    },
    {
      ...genField("repoOwner"),
      section: 3,
      type: "string",
      group: "legal",
      required: false
    },
    {
      ...genField("authorsFile"),
      type: "string",
      section: 3,
      group: "legal"
    },
    {
      ...genField("categories"),
      type: "array",
      items: {
        type: "string",
        title: "category",
        enum: categories
      },
      section: 6,
      required: true,
      widget: "tags"
    },
    {
      ...genField("scope"),
      type: "array",
      items: {
        type: "string",
        title: "scope",
        enum: scopes,
      },
      section: 6,
      group: "intendedAudience",
      widget: "tags"
    },
    {
      ...genField("countries"),
      type: "array",
      items: {
        title: "item",
        type: "string",
        enum: countries
      },
      section: 6,
      group: "intendedAudience",
      widget: "tags"
    },
    {
      ...genField("unsupportedCountries"),
      type: "array",
      items: {
        title: "item",
        type: "string",
        enum: countries
      },
      section: 6,
      group: "intendedAudience",
      widget: "tags"
    },
    {
      ...genField("usedBy"),
      type: "array",
      items: {
        type: "string"
      },
      section: 3
    },

    {
      ...genField("inputTypes"),
      type: "array",
      items: {
        type: "string"
      },
      section: 2
    },
    {
      ...genField("outputTypes"),
      type: "array",
      items: {
        type: "string"
      },
      section: 2
    },
    {
      ...genField("localisationReady"),
      type: "boolean",
      section: 6,
      required: true,
      group: "localisation"
    },
    {
      ...genField("availableLanguages"),
      type: "array",
      items: {
        title: "item",
        type: "string",
        enum: langs
      },
      widget: "tags",
      section: 4,
      required: true,
      group: "localisation"
    },
    {
      ...genField("type"),
      type: "array",
      items: {
        type: "string"
      },
      uniqueItems: true,
      required: true,
      requireChildrenIf: [
        { title: "maintenance_contacts", values: ["internal", "community"] },
        { title: "maintenance_contractors", values: ["contract"] }
      ],
      enum: ["internal", "contract", "community", "none"],
      widget: "choice-expanded",
      section: 7,
      group: "maintenance"
    },
    {
      ...genField("contacts"),
      type: "array",
      items: {
        title: "contact",
        label: "Contact",
        description:
          "This key contains an explicit affiliation information for the technical contact. In case of multiple maintainers, this can be used to create a relation between each technical contact and each maintainer entity. It can contain for instance a company name, an association name, etc.",
        type: "object",
        properties: {
          name: {
            type: "string",
            title: "name",
            label: "Name",
            description:
              " mandatory - This key contains the full name of one of the technical contacts. It must be a real person; do NOT populate this key with generic contact information, company departments, associations, etc."
          },
          email: {
            type: "string",
            title: "Email",
            label: "Email",
            widget: "email",
            description:
              "This key contains the e-mail address of the technical contact. It must be an email address of where the technical contact can be directly reached; do NOT populate this key with mailing-lists or generic contact points like info@acme.inc. "
          },
          phone: {
            type: "string",
            widget: "phone",
            title: "phone",
            label: "Phone",
            description: "Phone number (with international prefix)"
          },
          affiliation: {
            type: "string",
            title: "affiliation",
            label: "Affiliation",
            description:
              "This key contains an explicit affiliation information for the technical contact. In case of multiple maintainers, this can be used to create a relation between each technical contact and each maintainer entity. It can contain for instance a company name, an association name, etc."
          }
        },
        required: ["name"]
      },
      section: 7,
      group: "maintenance",
      cn: "block__item--full",
      // required: true
    },
    {
      ...genField("contractors"),
      title: "contractors",
      label: "Contractors",
      description:
        "This key describes the entity or entities, if any, that are currently contracted for maintaining the software. They can be companies, organizations, or other collective names.",
      type: "array",
      items: {
        title: "contractor",
        label: "Contractor",
        description:
          "This key contains an explicit affiliation information for the technical contact. In case of multiple maintainers, this can be used to create a relation between each technical contact and each maintainer entity. It can contain for instance a company name, an association name, etc.",
        type: "object",
        properties: {
          name: {
            type: "string",
            title: "name",
            label: "Name",
            description:
              "mandatory - The name of the contractor, whether it's a company or a physical person."
          },
          until: {
            type: "string",
            title: "until",
            label: "Until",
            description:
              " mandatory - This is a date (YYYY-MM-DD). This key must contain the date at which the maintenance is going to end. In case of community maintenance, the value should not be more than 2 years in the future, and thus will need to be regularly updated as the community continues working on the project.",
            widget: "date"
          },
          website: {
            type: "string",
            title: "website",
            label: "website",
            description:
              "This key points to the maintainer website. It can either point to the main institutional website, or to a more project-specific page or website.",
            widget: "url"
          }
        },
        required: ["name", "until"]
      },
      section: 7,
      group: "maintenance",
      cn: "block__item--full"
    },

    {
      ...genField("dependsOn"),
      type: "array",
      items: {
        title: "dependency",
        label: "Dependency",
        description:
          "A dependency is a complex object. The properties are the following:",
        type: "object",
        properties: {
          type: {
            title: "type",
            label: "Type",
            type: "array",
            items: {
              type: "string"
            },
            enum: ["open", "proprietary", "hardware"],
            uniqueItems: true,
            widget: "choice-expanded"
          },
          name: {
            title: "name",
            label: "Name",
            type: "string",
            description:
              "mandatory - The name of the dependency (e.g. MySQL, NFC Reader)"
          },
          versionMin: {
            type: "string",
            title: "versionMin",
            label: "Version Range Min",
            description: "the first compatible version"
          },
          versionMax: {
            type: "string",
            title: "versionMax",
            label: "Version Range Max",
            description: "the latest compatible version"
          },
          version: {
            type: "string",
            title: "version",
            label: "Exact Version",
            description:
              "the only major version for which the software is compatible. It assumes compatibility with all patches and bugfixes later applied to this version."
          },
          optional: {
            title: "optional",
            label: "Optional",
            type: "boolean",
            description: "whether the dependency is optional or mandatory"
          }
        },
        required: ["name", "type"]
      },
      section: 7,
      cn: "block__item--full"
    }
  ];
};
export default fields;
