import { getRequestConfiguration, performRequest, getResponseText } from './helpers';

export const text = {
    /**
     * Executes a request and processes the response as text.
     * @method get
     * @param {Object} options Specifies the details of the request.
     * @param {String} options.url The URL to request.
     * @param {Object} [options.queryParameters] The data to pass as GET parameters with the request.
     * @param {Object} [options.pathParameters] The data to use as {placeholders} in url.
     * @param {Function} [transformResponse] The custom response transformer function.
     * @return {Promise} Returns a promise
     */
    get: function(options, transformResponse) {
        const config = getRequestConfiguration(options, transformResponse, 'text');
        return performRequest(config.options, config.url, config.requestOptions, getResponseText);
    }
};
