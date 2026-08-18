import http from '@http';
import { createRequestParams } from '../request/requestParamsFactory';
import isEmpty from 'lodash/isEmpty';
import {setField, setValue} from '../request/contentTypeConfigurer';

export const singleRequestServiceFactory = (endpoint) => {
    return (fields, options, abortSignal) => {
        const { pathParams, queryParams, postParams, headerParams } = createRequestParams(
            setField(fields),
            setValue(options)
        );

        const httpOptions = {
            headers: headerParams,
            url: '{protocol}://' + endpoint,
            pathParameters: pathParams,
            queryParameters: queryParams,
            abortSignal
        };

        if (isEmpty(postParams)) {
            return http.get(httpOptions);
        } else {
            httpOptions.bodyParameters = postParams;
            return http.post(httpOptions);
        }
    };
};
