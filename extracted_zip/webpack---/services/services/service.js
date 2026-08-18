import ValidationError from '../error/ValidationError';
import Field from '../model/Field';
import isNil from 'lodash/isNil';
import deprecationHandler from './deprecationHandler';
import { trackingId as validateTrackingId } from './validators';
import { v4 as uuid } from 'uuid';
import {keyValidator} from './validators/key';
import {oneOfValueValidator} from './validators/oneOfValue';
import {numberValidator} from './validators/number';

const runValidators = (value, validators, params, key) => {
    const errors = [];

    for (const validator of validators) {
        try {
            validator(value, params, key);
        } catch (error) {
            errors.push(error);
        }
    }
    return errors;
};

const convertToFields = (fields) => {
    const convertedFields = {};
    for (const [key, field] of Object.entries(fields)) {
        convertedFields[key] = new Field(field);
    }
    return convertedFields;
};

const internalValidator = (fields, params = {}, serviceName) => {
    const convertedFields = convertToFields(fields);
    let errors = [];
    for (const [name, field] of Object.entries(convertedFields)) {
        const value = params[name];
        const isRequiredFieldMissing = isNil(value) && field.isRequired();
        const isAppliedForAll = name === '__all';

        if (isRequiredFieldMissing) {
            errors.push(new Error(`${name} is a required field.`));
        } else if (!isNil(value) || isAppliedForAll) { // runs validators for the given field)
            deprecationHandler.checkDeprecation(name, field.getDeprecationDate(), serviceName);

            const validationErrors = runValidators(value, field.getValidators(), params, name);
            errors = [...errors, ...validationErrors];
        }
    }
    return errors;
};

/**
 * Receives a list of fields and parameters and converts them according to the converters
 * defined. It also sets the default value when the field is undefined.
 *
 * @method convert
 * @private
 * @param {Object} [fields] Object containing the fields and their converters.
 * @param {Object} [params] Object containing the params and their values.
 * @param {Object} [serviceType] Service type - required for some converters.
 * @returns {Object} Converted values.
 */
export const convert = (fields, params = {}, serviceType) => {
    const convertedFields = convertToFields(fields);
    const converted = {};
    for (const [name, field] of Object.entries(convertedFields)) {
        const defaultValue = field.getDefaultValue();
        let fieldValue = params[name];
        if (isNil(fieldValue) || fieldValue === '') {
            if (!isNil(defaultValue)) {
                fieldValue = defaultValue;
            } else {
                continue;
            }
        }
        const converters = field.getConverters();
        converted[name] = converters.reduce((value, converter) => {
            return converter(value, serviceType);
        }, fieldValue);
    }
    return converted;
};

/**
 * Responsible for processing batch items. It validates and converts them and it returns
 * the properties and the errors.
 *
 * @method processBatchItems
 * @private
 * @param {Object} [fields] Object containing the fields, their validators and converters, and if they
 * are required.
 * @param {Object} [params] Object containing the parameters and their values.
 * @param {String} [serviceType] ServiceType.
 * @param {String} [serviceName] serviceName.
 * @returns {Object} Batch properties and errors.
 */
function processBatchItems(fields, params, serviceType, serviceName) {
    const batchProperties = {};
    let batchErrors = [];

    if (fields.batchItems && params.batchItems) {
        batchProperties.batchItems = params.batchItems.map((param) => {
            const convertedField = convert(fields.batchItems, param, serviceType);
            batchErrors = batchErrors.concat(internalValidator(fields.batchItems, convertedField, serviceName));
            return convertedField;
        });
        if (params.batchMode) {
            batchProperties.batchMode =
                oneOfValueValidator(['sync', 'async', 'redirect'], 'batchMode')(params.batchMode);
        }
        if (params.key) {
            batchProperties.key = keyValidator(params.key);
        }
        batchProperties.trackingId = params.trackingId ? validateTrackingId(params.trackingId) : uuid();
        if (params.waitTimeSeconds) {
            numberValidator(params.waitTimeSeconds);

            if (!(params.waitTimeSeconds === 120 || (params.waitTimeSeconds >= 5 && params.waitTimeSeconds <= 60))) {
                throw new Error('Invalid `waitTimeSeconds` parameter value. ' +
                'Must be 120 or an integer between 5 and 60.');
            }

            batchProperties.waitTimeSeconds = params.waitTimeSeconds;
        }
    }

    return { batchProperties, batchErrors };
}

/**
 * Receives a list of fields and parameters, validates and converts them according to the validators and
 * converters defined.
 * It also sets the API Key if defined.
 *
 * @method goPrototype
 * @private
 * @param {Object} [fields] Object containing the fields, their validators and converters, and if they
 * are required.
 * @param {Object} [params] Object containing the parameters and their values.
 * @param {String} [serviceType] ServiceType.
 * @param {String} [serviceName] serviceName.
 * @param {Function} [callback] Callback.
 * @param {Object} [abortSignal] abortSignal generated with Abort Controller.
 * @returns {Object} Validated and converted values.
 */
export async function goPrototype(fields, params = {}, serviceType, serviceName, callback, abortSignal) {
    let converted = convert(fields, params, serviceType);
    let errors = internalValidator(fields, converted, serviceName);

    if (fields.batchItems && params.batchItems) {
        const { batchProperties, batchErrors } = processBatchItems(fields, params, serviceType, serviceName);
        converted = { ...converted, ...batchProperties };
        errors = errors.concat(batchErrors);
    }

    if (errors.length) {
        throw new ValidationError(errors);
    }
    return callback(converted, abortSignal);
}
