const flattenObjectToRecord = (
    obj: object,
    parentKey = '',
    separator = '.'
): Record<string, unknown> => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const newKey = parentKey ? `${parentKey}${separator}${key}` : key;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            Object.assign(acc, flattenObjectToRecord(value, newKey, separator));
        } else {
            acc[newKey] = value;
        }

        return acc;
    }, {} as Record<string, unknown>);
}

export default flattenObjectToRecord;