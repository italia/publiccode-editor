const yamlMimeTypes = [
    'application/yaml',
    'application/x-yaml',
    'text/yaml'
]

export const isYamlFile = (file?: File | null) => Boolean(file?.type && yamlMimeTypes.includes(file?.type.toLowerCase()))

export const hasYamlFileExtension = (value?: string) => {
    const ext = value?.split(/[. ]+/).pop();
    return ext === "yml" || ext === "yaml";
}

export const removeDuplicate = <T>(array: Array<T>) => [...new Set(array)];