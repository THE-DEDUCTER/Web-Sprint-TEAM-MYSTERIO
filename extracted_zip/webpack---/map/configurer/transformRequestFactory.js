import {isFunction} from 'lodash';
import uuid from 'uuid/v4';
import * as analytics from 'Services/requester/analytics';
import escapeRegExp from 'Map/utils/escapeRegExp';
import {origin} from 'Map/endpoints';
import {vectorTileLayer, vectorTileLayerV2} from 'Map/endpoints';

import queryParamUpdater from 'Map/utils/queryParamUpdater';

const ORIGIN_URL_PATTERN = new RegExp(escapeRegExp(origin));
const VECTOR_POLYGONS_URL_PATTERN = new RegExp(escapeRegExp(vectorTileLayer));
const VECTOR_V2_POLYGONS_URL_PATTERN = new RegExp(escapeRegExp(vectorTileLayerV2));
const LANGUAGE_PARAM_NAME = 'language';
const GEOPOLITICAL_VIEW_PARAM_NAME = 'view';

function mapPolygonsUrlTransformer(url, languageGetter, geopolViewGetter) {
    let transformedUrl = url;

    if (VECTOR_POLYGONS_URL_PATTERN.test(transformedUrl)) {
        transformedUrl = queryParamUpdater(transformedUrl, LANGUAGE_PARAM_NAME, languageGetter());
        transformedUrl = queryParamUpdater(transformedUrl, GEOPOLITICAL_VIEW_PARAM_NAME, geopolViewGetter());
    }

    if (VECTOR_V2_POLYGONS_URL_PATTERN.test(transformedUrl)) {
        transformedUrl = queryParamUpdater(transformedUrl, GEOPOLITICAL_VIEW_PARAM_NAME, geopolViewGetter());
    }

    return transformedUrl;
}

export default function transformRequestFactory(languageGetter, geopolViewGetter, userTransformRequestFunc) {
    return (inputUrl, resourceType) => {
        const headers = {};
        let transformRequestResult = {
            url: inputUrl,
            headers
        };

        transformRequestResult.url = mapPolygonsUrlTransformer(
            transformRequestResult.url, languageGetter, geopolViewGetter
        );

        if (ORIGIN_URL_PATTERN.test(transformRequestResult.url)) {
            headers[analytics.getHeaderName()] = analytics.getHeaderContent();
            headers['Tracking-ID'] = uuid();
        }

        if (isFunction(userTransformRequestFunc)) {
            const userTransformRequestResult = userTransformRequestFunc(transformRequestResult.url, resourceType);
            if (userTransformRequestResult) {
                transformRequestResult = {...transformRequestResult, ...userTransformRequestResult};
                if (userTransformRequestResult.headers) {
                    transformRequestResult.headers = {...headers, ...userTransformRequestResult.headers};
                }
            }
        }

        return transformRequestResult;
    };

}
