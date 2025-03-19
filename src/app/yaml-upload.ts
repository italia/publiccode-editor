const yamlMimeTypes = [
    'application/yaml',
    'application/x-yaml',
    'text/yaml'
]

export const isYamlFile = (file?: File | null) => {
    if (!file) return false;

    if (file.type && yamlMimeTypes.includes(file.type.toLowerCase())) {
        return true;
    }

    if (file.type === "" && navigator.userAgent.includes("Windows")) {
        return file.name.endsWith(".yml") || file.name.endsWith(".yaml");
    }

    return false;
};

export const hasYamlFileExtension = (value?: string) => {
    const ext = value?.split(/[. ]+/).pop();
    return ext === "yml" || ext === "yaml";
}

export const removeDuplicate = <T>(array: Array<T>) => [...new Set(array)];