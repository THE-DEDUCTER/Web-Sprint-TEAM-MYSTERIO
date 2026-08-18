import { json } from './json';
import { text } from './text';

let useHttp = false;

const setUseHttp = (use) => {
    useHttp = use;
};

const getProtocol = () => {
    return useHttp ? 'http' : 'https';
};

export default {
    useHttp: setUseHttp,
    protocol: getProtocol,

    get: (options, transformResponse) => {
        options.protocol = (options && options.protocol) || getProtocol();
        const pathParameters = options.pathParameters;
        if (pathParameters && pathParameters.contentType === 'text') {
            return text.get(options, transformResponse);
        }
        return json.get(options, transformResponse);
    },

    post: (options) => {
        options.protocol = options.protocol || getProtocol();
        return json.post(options);
    }
};
