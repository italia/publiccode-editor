import pj from "../../package.json" with { type: "json" };
import { DEFAULT_VALUE_PUBLICCODE_YML, DEFAULT_VALUE_SOFTWARE_VERSION } from "./constants.js";
import YamlFileProxy from "./yaml-file-proxy.js";

function update(softwareVersion, filePath) {
    const publicCodeYml = new YamlFileProxy(filePath)

    const data = publicCodeYml.read();

    data[DEFAULT_VALUE_SOFTWARE_VERSION] = softwareVersion

    publicCodeYml.write(data)
}

// Extract command line arguments
const [, , softwareVersionArg, filePathArg] = process.argv;

// Asking for help?
if (softwareVersionArg === '--help') {
    console.warn('\nUsage: node updatePubliccodeVersion.js <softwareVersion> <filePath>\n');
    console.warn(`\t<softwareVersion>: softwareVersion value in publiccode.yml. default value is taken from package.json}`);
    console.warn(`\t<filePath>: path to publiccode.yml. default value: ${DEFAULT_VALUE_PUBLICCODE_YML}`);
    process.exit(0);
}

const softwareVersion = softwareVersionArg ?? pj.version;

const filePath = filePathArg ?? DEFAULT_VALUE_PUBLICCODE_YML;

update(softwareVersion, filePath);
console.log(`${filePath} updated: softwareVersion is set to ${softwareVersion}`);
