const yamlMimeTypes = [
    'application/yaml',
    'application/x-yaml',
    'text/yaml'
]

export const isYamlFile = (file?: File | null) => Boolean(file?.type && yamlMimeTypes.includes(file?.type.toLowerCase()))