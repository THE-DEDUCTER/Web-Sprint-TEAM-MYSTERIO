function findSeparator(uri) {
    const questionMarkIndex = uri.indexOf('?');
    if (questionMarkIndex === -1) {
        return '?';
    }
    return questionMarkIndex === uri.length - 1 ? '' : '&';
}

export default (uri, key, value) => {
    const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    if (uri.match(re)) {
        if (value) {
            return uri.replace(re, '$1' + key + '=' + value + '$2');
        } else {
            return uri.replace(re, '$1$2').replace('&&', '&');
        }
    } else if (value) {
        const separator = findSeparator(uri);
        return uri + separator + key + '=' + value;
    } else {
        return uri;
    }
};
