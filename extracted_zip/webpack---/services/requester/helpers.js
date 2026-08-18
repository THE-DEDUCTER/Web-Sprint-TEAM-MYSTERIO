import fetchProxy from '@fetch';
import template from './template';
import { getAnalyticsHeader } from './analytics';

export function getRequestConfiguration(options, transformResponse, contentType) {
    options.pathParameters = options.pathParameters || {};
    options.pathParameters.contentType = contentType;
    options.pathParameters.protocol = options.pathParameters.protocol || 'https';
    const url = template(options.url, options.pathParameters);
    const headers = getAnalyticsHeader();
    headers['Accept'] = 'application/json'; //eslint-disable-line dot-notation
    if (options.headers && options.headers.trackingId) {
        headers['Tracking-ID'] = options.headers.trackingId;
    }

    let requestOptions = {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        ...options.abortSignal && { signal: options.abortSignal }
    };

    if (transformResponse) {
        requestOptions = { ...requestOptions, transformResponse };
    }
    return {
        options, url, requestOptions
    };
}

export function performRequest(options, url, requestOptions = {}, getData) {
    return fetchProxy(withQueryParams(options, url), requestOptions)
        .then(async (response) => {
            const data = await getData(response);
            if (!response.ok) {
                return Promise.reject({ response, data });
            }

            if (options._getOriginalResponse) {
                return response;
            }
            if (options.requestType === 'batch' && response.status === 202) {
                return response.headers.location;
            }

            const trackingIdHeader = response.headers &&
                (response.headers.get('tracking-id') || response.headers.get('Tracking-ID'));

            return {
                data,
                ...trackingIdHeader && { trackingId: trackingIdHeader }
            };
        })
        .catch((error = {}) => {
            if (requestOptions.signal && requestOptions.signal.aborted === true) {
                return Promise.reject(error);
            }

            const { response, data } = error;
            const err = options._getOriginalResponse ? response || error :
                errorResponse(data, response && response.status) || error;

            return Promise.reject(err);
        });
}

export function getResponseText(response) {
    return response.text();
}

export function getResponseJson(response) {
    return response.json();
}

const errorResponse = (data, status) => {
    if (!data) {
        return undefined;
    }

    const { error, detailedError } = data;

    // preflight response failed
    if (!error || !detailedError) {
        return data;
    }

    return {
        message: error.description,
        data: detailedError,
        status
    };
};

function withQueryParams(options, url) {
    if (!options.queryParameters) {
        return url;
    }

    const queryString = Object.keys(options.queryParameters)
        .map(function(key) {
            return mapQueryParamToKeyValueString(options, key);
        })
        .join('&');
    return url + '?' + queryString;
}

function mapQueryParamToKeyValueString(options, key) {
    const queryParamValue = options.queryParameters[key];
    let result = '';
    if (Array.isArray(queryParamValue)) {
        result = queryParamValue.map(function(value) {
            return createKeyValueString(key, value);
        }).join('&');
    } else {
        result = createKeyValueString(key, options.queryParameters[key]);
    }
    return result;
}

function createKeyValueString(key, value) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(value);
}
