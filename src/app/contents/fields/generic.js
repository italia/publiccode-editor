import categories from "../categories";
import scopes from "../scopes";
import licenses from "../licenses";
import langs from "../langs";
import countries from "../countries";

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

const fields = async () => {
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

  /*
   * minLength and maxLength parameter to constraint string input size
   */
  return [
    {
      title: "name",
      label: "Name of the software",
      type: "string",
      description:
        "This key contains the name of the software. It contains the (short) public name of the product, which can be localised in the specific localisation section. It should be the name most people usually refer to the software. In case the software has both an internal 'code' name and a commercial name, use the commercial name.",
      section: 0,
      required: true
    },
  ];
};
export default fields;
