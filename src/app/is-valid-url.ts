function isValidUrl(url: string): boolean {
    const pattern = /^(https?:\/\/)([a-zA-Z0-9_\-~.]+(:[a-zA-Z0-9_\-~.!$&'()*+,;=]+)?@)?([\w\-]+(\.[\w\-]+)+|localhost|(\d{1,3}\.){3}\d{1,3}|\[::1\])(:\d+)?(\/[\w\-./]*)?(\?[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?(#[\w\-]*)?$/i;
    return pattern.test(url);
}

export default isValidUrl