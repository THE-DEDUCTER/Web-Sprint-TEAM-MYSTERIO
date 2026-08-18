/* eslint-disable max-len */

import * as defaultEndpoints from './endpoints';
import { validCustomEndpoint, validCustomEndpointsObject } from '../services/validators';

/**
 * @ignore
 * Resolves endpoint by given name. Enables use of custom domain or endpoint.
 *
 * To use custom domain set it with `additionalOptions.customDomain` attribute.
 * @example
 * ```js
 * const options = {
 *   key: 'your-key'
 * };
 * const additionalOptions = {
 *   customDomain: 'custom-domain.tomtom.com'
 * }
 * tt.services.copyrightsV2(options, additionalOptions)
 *   .then(successCallback)
 *   .catch(errorCallback);
 * ```
 *
 * To replace entire endpoint set it with 'additionalOptions.customEndpoints' object.
 * Key describes which endpoint you want to change, value should be endpoint string.
 * @example
 * ```js
 * const options = {
 *   key: 'your-key',
 *   ...
 * };
 * const additionalOptions = {
 *   customEndpoints: {
 *     routingEndpoint: 'custom.tomtom.com/routing-custom/1/calculateRoute/{locations}/{contentType}'
 *   }
 * }
 * tt.services.calculateRoute(options, additionalOptions)
 *   .then(successCallback)
 *   .catch(errorCallback);
 * ```
 *
 * In both cases provide URL without protocol prefix (http/https). URL must be in TomTom domain (*.tomtom.com).
 * If `customDomain` and `customEndpoints` will be provided together, `customDomain` won't affect
 * endpooints set using customEndpoints.
 *
 * List of methods and endpoints that may be replaced using customEndpoints option ([key]: url):
 * For default value please check ./endpoints.js file and corresponding URL in mainConfig.js in root directory.
 *
 * tt.services.additionalData: adpEndpoint; batch requests: batchAdpQueryEndpoint, batchSyncSearchEndpoint, batchSearchEndpoint
 * tt.services.alongRouteSearch: searchEndpoint; batch requests: batchSearchQueryEndpoint, batchSyncSearchEndpoint, batchSearchEndpoint
 * tt.services.autocomplete: autocompleteEndpoint
 * tt.services.calculateReachableRange: calculateReachableRangeEndpoint; batch requests: batchSyncRoutingEndpoint, batchRoutingEndpoint, batchReachableRangeQueryEndpoint
 * tt.services.calculateRoute: routingEndpoint; batch requests: batchSyncRoutingEndpoint, batchRoutingEndpoint, batchRoutingQueryEndpoint
 * tt.services.categorySearch: searchEndpoint; batch requests: batchSearchQueryEndpoint, batchSyncSearchEndpoint, batchSearchEndpoint
 * tt.services.copyrightsCaptionV2: captionV2Endpoint
 * tt.services.copyrightsV2: copyrightsV2Endpoint
 * tt.services.crossStreetLookup: reverseGeocodeEndpoint; batch requests: batchReverseGeocodeQueryEndpoint, batchSearchEndpoint, batchSyncSearchEndpoint
 * tt.services.evChargingStationsAvailability: chargingAvailabilityEndpoint; batch requests: batchChargingAvailabilityQueryEndpoint, batchSyncSearchEndpoint, batchSearchEndpoint
 * tt.services.fuzzySearch: searchEndpoint; batch requests: batchSearchQueryEndpoint, batchSyncSearchEndpoint, batchSearchEndpoint
 * tt.services.geocode: geocodeEndpoint; batch requests: batchSearchQueryEndpoint, batchSyncSearchEndpoint, batchSearchEndpoint
 * tt.services.geometrySearch: searchEndpoint; batch requests: batchSearchQueryEndpoint, batchSyncSearchEndpoint, batchSearchEndpoint
 * tt.services.incidentDetailsV5: incidentDetailsV5Endpoint
 * tt.services.incidentViewport: incidentViewportEndpoint
 * tt.services.longDistanceEVRouting: longDistanceEVRoutingEndpoint
 * tt.services.matrixRouting: matrixSyncRoutingEndpoint, matrixRoutingEndpoint
 * tt.services.nearbySearch: nearbySearchEndpoint; batch requests: batchNearbySearchQueryEndpoint, batchSyncSearchEndpoint, batchSearchEndpoint
 * tt.services.placeById: placeByIdEndpoint
 * tt.services.poiCategories: poiCategoriesEndpoint
 * tt.services.poiSearch: searchEndpoint; batch requests: batchSearchQueryEndpoint, batchSyncSearchEndpoint, batchSearchEndpoint
 * tt.services.reverseGeocode: reverseGeocodeEndpoint; batch requests: batchReverseGeocodeQueryEndpoint, batchSearchEndpoint, batchSyncSearchEndpoint
 * tt.services.staticImage: staticMapImageEndpoint
 * tt.services.structuredGeocode: structuredGeocodeEndpoint; batch requests: batchStructuredGeocodeQueryEndpoint, batchSearchEndpoint, batchSyncSearchEndpoint
 * tt.services.trafficFlowSegmentData: flowSegmentDataEndpoint
 */
export class Endpoints {
    constructor(additionalOptions) {
        if (additionalOptions?.customEndpoints !== undefined) {
            this._customEndpoints = validCustomEndpointsObject(additionalOptions.customEndpoints);
        }
        if (additionalOptions?.customDomain !== undefined) {
            this._customDomain = validCustomEndpoint(additionalOptions.customDomain);
            this._customDomain = this._customDomain.replace(new RegExp(/\/$/), '');
        }
    }

    resolve(endpointName) {
        if (this._customEndpoints?.[endpointName] !== undefined) {
            return this._customEndpoints[endpointName];
        }

        const defaultEndpoint = defaultEndpoints[endpointName];
        if (this._customDomain !== undefined) {
            return this._changeDomain(defaultEndpoint, this._customDomain);
        }

        return defaultEndpoint;
    }

    _changeDomain(endpointUrl, newDomain) {
        return endpointUrl.replace(defaultEndpoints.origin, newDomain);
    }
}
