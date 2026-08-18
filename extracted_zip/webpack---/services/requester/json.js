import template from './template';
import { getAnalyticsHeader } from './analytics';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';
import { getRequestConfiguration, performRequest, getResponseJson } from './helpers';

function stringify(obj) {
    try {
        return JSON.stringify(obj);
    } catch (ex) {
        return null;
    }
}

function setHeader(requestOptions, headerName, headerValue) {
    if (!requestOptions.headers) {
        requestOptions.headers = {};
    }

    const header = requestOptions.headers[headerName] || requestOptions.headers[headerName.toLowerCase()];
    if (!header) {
        requestOptions.headers[headerName] = headerValue;
    }
}

function addObjectBodyParams(bodyParams, requestOptions) {
    const body = stringify(bodyParams);
    if (!body) {
        throw new Error('Unsupported request body type: ' + bodyParams);
    }
    setHeader(requestOptions, 'Content-Type', 'application/json');
    return body;
}

function addBodyParams(options, requestOptions) {
    const bodyParams = options.bodyParameters;
    let body;
    if (!bodyParams) {
        return;
    }

    if (isObject(bodyParams)) {
        body = addObjectBodyParams(bodyParams, requestOptions);
    } else if (isString(bodyParams)) {
        body = bodyParams;
    }

    requestOptions.body = body;
}

export const json = {
    /**
     * Executes a request and processes the response as JSON.
     * @method get
     * @param {Object} options Specifies the details of the request.
     * @param {String} options.url The URL to request.
     * @param {Object} [options.queryParameters] The data to pass as GET parameters with the request.
     * @param {Object} [options.pathParameters] The data to use as {placeholders} in url.
     * @param {Function} [transformResponse] The custom response transformer function.
     * @return {Promise} Returns a promise
     */
    get: function(options, transformResponse) {
        const config = getRequestConfiguration(options, transformResponse, 'json');
        return performRequest(config.options, config.url, config.requestOptions, getResponseJson);
    },

    /**
     * Executes a request and processes the response as JSON.
     * @method post
     * @param {Object} options Specifies the details of the request.
     * @param {String} options.url The URL to request.
     * @param {Object} [options.queryParameters] The data to pass as Url parameters with the request.
     * @param {Object} [options.pathParameters] The data to use as {placeholders} in url.
     * @param {Object} [options.bodyParameters] The data to pass to request body.
     * @return {Promise} Returns a promise
     */
    post: function(options) {
        options.pathParameters = options.pathParameters || {};
        options.pathParameters.contentType = 'json';
        options.pathParameters.protocol = options.pathParameters.protocol || 'https';

        const url = template(options.url, options.pathParameters);
        const headers = getAnalyticsHeader();
        headers['Accept'] = 'application/json'; //eslint-disable-line dot-notation
        if (options.headers && options.headers.trackingId) {
            headers['Tracking-ID'] = options.headers.trackingId;
        }
        const requestOptions = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            redirect: 'follow',
            ...options.abortSignal && { signal: options.abortSignal }
        };

        addBodyParams(options, requestOptions);

        return performRequest(options, url, requestOptions, getResponseJson);
    }
};
