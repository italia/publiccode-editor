import fs from "node:fs";
import yaml from "yaml";

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

export default YamlFileProxy;