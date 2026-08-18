/**
 * The copyright caption service implementation provides a caption that is supposed to be displayed on a link
 * that provides the full copyright notice. The response is not changed often.
 *
 * This service is supposed to be called once when user has the map displayed for the first time.
 *
 * ### Response
 * ```
 * {
 *  "formatVersion": "0.0.1"
 *  "copyrightsCaption": "© 1992 - 2021 TomTom."
 * }
 * ```
 *
 * The response is also extended with `getTrackingId()` method, which returns the `Tracking-ID`
 * associated with the request.
 *
 * This text ("© 1992 - 2021 TomTom.") has to be displayed as a copyrights prompt when using TomTom services.
 * The caption should be clickable. A user should be presented with the full copyrights notice when
 * the caption is clicked. Full copyright notice can be retrieved from the
 * {{#crossLink "Services.services.copyrightsV2"}}CopyrightsV2 service{{/crossLink}}.
 *
 * @example
 * ```js
 * tt.services.copyrightsCaptionV2({
 *   key: <Your API key>
*  }).then(function(response) {
 *   console.log(response);
 * });
 * ```
 *
 * @class copyrightsCaptionV2
 * @namespace Services.services
 * @module Services
 * @uses TrackingIdMixin
 * @constructor
 * @uses KeyMixin
 * @uses AbortSignalMixin
 *
 * @param {Object} [options]
 */

import {SERVICE_TYPES} from 'Core/serviceTypes';
import { singleRequestServiceFactory, serviceFactory } from '../../core';
import { modelResponse } from '../../model/modelResponse';
import parameterApplications from '../../common/parameterApplications';
import {
    key as validateKey, trackingId as validateTrackingId
} from '../validators';
import { Endpoints } from '../../endpoints/endpointsManager';
import { v4 as uuid } from 'uuid';

const fields = {
    key: {
        validators: [validateKey]
    },
    trackingId: {
        validators: [validateTrackingId],
        application: parameterApplications.HEADER,
        defaultValue: uuid
    }
};

export function copyrightsCaptionV2(options, additionalOptions) {
    const endpoints = new Endpoints(additionalOptions);
    const singleRequest = singleRequestServiceFactory(endpoints.resolve('captionV2Endpoint'));
    function handleServiceCall(data, abortSignal) {
        return singleRequest(fields, data, abortSignal).then(modelResponse);
    }

    return serviceFactory(
        fields,
        SERVICE_TYPES.MAP,
        'copyrightsCaptionV2',
        handleServiceCall
    )(options, additionalOptions);
}
