function flattenObject(
    obj: object,
    parentKey = '',
    separator = '.'
): Record<string, { type: string; message: string }> {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const newKey = parentKey ? `${parentKey}${separator}${key}` : key;

        // Controlla se il valore è un oggetto e ha proprietà
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            const isLeaf = Object.keys(value).every(
                (k) => typeof value[k] !== 'object' || value[k] === null
            );

            if (isLeaf) {
                // Se è una foglia, aggiungilo direttamente
                acc[newKey] = value as { type: string; message: string };
            } else {
                // Altrimenti continua la ricorsione
                Object.assign(acc, flattenObject(value, newKey, separator));
            }
        }

        return acc;
    }, {} as Record<string, { type: string; message: string }>);
}

export default flattenObject