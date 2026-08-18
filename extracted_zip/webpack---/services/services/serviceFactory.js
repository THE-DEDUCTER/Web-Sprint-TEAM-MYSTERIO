import { goPrototype } from './service';
import isFunction from 'lodash/isFunction';

export function serviceFactory(fields, serviceType, serviceName, handleServiceCall, handleBatchServiceCall) {
    const batchFields = {
        batchItems: fields
    };

    return (options = {}, additionalOptions = {}) => {
        let serviceCall = handleServiceCall;
        let opt = options;
        let serviceFields = fields;

        if (options.batchItems && isFunction(handleBatchServiceCall)) {
            opt = {
                trackingId: options.trackingId,
                batchMode: options.batchMode,
                waitTimeSeconds: options.waitTimeSeconds,
                batchItems: options.batchItems,
                key: options.key
            };
            serviceCall = handleBatchServiceCall;
            serviceFields = batchFields;
        }

        return goPrototype(
            serviceFields,
            opt,
            serviceType,
            serviceName,
            serviceCall,
            additionalOptions.abortSignal
        );
    };
}
