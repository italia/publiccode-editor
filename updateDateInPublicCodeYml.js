// const fs = require('fs');
// const yaml = require('yaml');

import fs from "node:fs";
import yaml from "yaml";

const DEFAULT_VALUE_PUBLICCODE_YML = 'publiccode.yml'
const DEFAULT_VALUE_RELEASE_DATE = 'releaseDate'

class YamlFileProxy {
    #filePath;

    constructor(filePath) {
        this.#filePath = filePath;
    }

    read() {
        const fileContents = fs.readFileSync(this.#filePath, 'utf8');
        return yaml.parse(fileContents);
    }

    write(data) {
        const yamlString = yaml.stringify(data);
        fs.writeFileSync(this.#filePath, yamlString, 'utf8');
    }
}

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
            console.log(current)
            current = current[keys[i]];
            console.log(current)
        }

        current[keys[keys.length - 1]] = currentDate;
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
