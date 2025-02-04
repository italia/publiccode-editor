import { DEFAULT_VALUE_PUBLICCODE_YML, DEFAULT_VALUE_RELEASE_DATE } from './constants.js';
import YamlFileProxy from "./yaml-file-proxy.js";

function update(yamlFileProxy, keyPath) {
    const data = yamlFileProxy.read()

    const currentDate = new Date().toISOString().split('T')[0];

    if (keyPath === DEFAULT_VALUE_RELEASE_DATE) {
        data[DEFAULT_VALUE_RELEASE_DATE] = currentDate
    } else {
        // Navigate to the correct keyPath
        const keys = keyPath.split('.');
        const keysLength = keys.length
        let current = data;

        for (let i = 0; i < keysLength - 1; i++) {
            current = current[keys[i]];
        }

        if (current) {
            current[keys[keys.length - 1]] = currentDate;
        } else {
            keys.reduce((acc, key, index) => {
                const isLast = index === keys.length - 1;
                if (isLast) {
                    acc[key] = currentDate; // set the current date
                } else {
                    acc[key] = acc[key] || {}; // Create an object if it not exists
                }
                return acc[key];
            }, data);
        }
    }

    yamlFileProxy.write(data)
}

// Extract command line arguments
const [, , filePathArg, keyPathArg] = process.argv;

// Asking for help?
if (filePathArg === '--help') {
    console.warn('\nUsage: node updateYaml.js <filePath> <keyPath>\n');
    console.warn(`\t<filePath>: path to publiccode.yml. default value: ${DEFAULT_VALUE_PUBLICCODE_YML}`);
    console.warn(`\t<keyPath>: path to release date property. default value: ${DEFAULT_VALUE_RELEASE_DATE}\n`);
    process.exit(0);
}

if (!filePathArg) console.warn(`filePath is not defined. using the defaultvalue: ${DEFAULT_VALUE_PUBLICCODE_YML}`);
const filePath = filePathArg ?? DEFAULT_VALUE_PUBLICCODE_YML;
if (!keyPathArg) console.warn(`keyPath is not defined. using the defaultvalue: ${DEFAULT_VALUE_RELEASE_DATE}`);
const keyPath = keyPathArg ?? DEFAULT_VALUE_RELEASE_DATE;

update(new YamlFileProxy(filePath), keyPath);
console.log(`${filePath} updated: ${keyPath} is set with the current date`);
