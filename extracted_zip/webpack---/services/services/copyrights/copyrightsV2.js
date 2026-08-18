/**
 * The Copyrights service implementation provides a full copyrights notice in a HTML format that can be displayed to
 * the user when the copyrights link is clicked.
 *
 * Parameters need to be passed to the constructor.
 *
 * ### Response
 * The response from the service is a HTML string with the copyrights information that have to be displayed.
 * The whole respose is wrapped into a div element with the id copyrightMessage.
 * ```html
 * <div id="copyrightMessage"><h4>General Copyrights:</h4>
 *  <p>© 1992 - 2021 TomTom. All rights reserved. This
 *  material is proprietary and the subject of copyright protection, database
 *  right protection and other intellectual property rights owned by TomTom
 *  or its suppliers. The use of this material is subject to the terms of
 *  a license agreement. Any unauthorized copying or disclosure of this
 *  material will lead to criminal and civil liabilities.,</p>
 *  <p>Data Source © 2021 TomTom,</p>
 *  <p>based on https://www.tomtom.com/en_gb/thirdpartyproductterms/</p>
 * </div>
 * ```
 *
 * The response is also extended by `getTrackingId()` method, which returns the `Tracking-ID`
 * associated with the request.
 *
 * @example
 * ```js
 * tt.services.copyrightsV2({
 *   key: <Your API key>
 * }).then(function(response) {
 *    console.log(response);
 * });
 * ```
 *
 * @class copyrightsV2
 * @namespace Services.services
 * @module Services
 * @constructor
 * @uses KeyMixin
 * @uses TrackingIdMixin
 * @uses AbortSignalMixin
 *
 * @param {Object} [options] Options to be passed to the call
 */

import {SERVICE_TYPES} from 'Core/serviceTypes';
import {
    string as validateString, trackingId as validateTrackingId
} from '../validators';
import parameterApplications from '../../common/parameterApplications';
import { v4 as uuid } from 'uuid';
import { singleRequestServiceFactory, serviceFactory } from '../../core';
import { Endpoints } from '../../endpoints/endpointsManager';
import { modelResponse } from '../../model/modelResponse';

const fields = {
    key: {
        validators: [validateString]
    },
    trackingId: {
        validators: [validateTrackingId],
        application: parameterApplications.HEADER,
        defaultValue: uuid
    }
};

export function copyrightsV2(options, additionalOptions) {
    const endpoints = new Endpoints(additionalOptions);
    const singleRequest = singleRequestServiceFactory(endpoints.resolve('copyrightsV2Endpoint'));

    function handleServiceCall(requestOptions, abortSignal) {
        requestOptions.contentType = 'text';
        return singleRequest(fields, requestOptions, abortSignal).then(modelResponse);
    }

    return serviceFactory(
        fields,
        SERVICE_TYPES.MAP,
        'copyrights',
        handleServiceCall
    )(options, additionalOptions);
}
