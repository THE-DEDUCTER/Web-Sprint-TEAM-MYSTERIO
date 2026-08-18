/**
 * @ignore
 * Consider NaN and Infinite as not a number.
 * @param {*} val
 * @return {Boolean}
 */
export function isValidNumber(val) {
    return typeof val === 'number' && isFinite(val);
}

/**
 * @ignore
 * @param {*} val
 * @return {Boolean}
 */
export function isNonEmptyString(val) {
    return typeof val === 'string' && val.length > 0;
}

/**
 * @ignore
 * Used instead of Number.isNaN
 * @param {*} val
 * @return {Boolean}
 */
function numberIsNaN(val) {
    // only true for NaN
    return val !== val; // eslint-disable-line no-self-compare
}

/**
 * @ignore
 * Returns TRUE if the value is not undefined, null, or NaN.
 * @param {*} val
 * @return {Boolean}
 */
export function isValidValue(val) {
    return val !== undefined && val !== null && !numberIsNaN(val);
}

function cloneProperties(object, clonedObject) {
    for (const property in object) {
        if (Object.prototype.hasOwnProperty.call(object, property)) {
            if (Array.isArray(object[property])) {
                clonedObject[property] = object[property].slice(0);
            } else if (typeof object[property] === 'object') {
                clonedObject[property] = {};
                cloneProperties(object[property], clonedObject[property]);
            } else {
                clonedObject[property] = object[property];
            }
        }
    }
}

function getValueOrEmptyObject(value) {
    return value === undefined ? {} : value;
}

function addNewField(result, field, newFields) {
    result[field] = getValueOrEmptyObject(result[field]);
    for (const property in newFields[field]) {
        if (Object.prototype.hasOwnProperty.call(newFields[field], property)) {
            result[field][property] = newFields[field][property];
        }
    }
}

export function extend(obj, src) {
    for (const key in src) {
        if (Object.prototype.hasOwnProperty.call(src, key)) {
            obj[key] = src[key];
        }

    }
    return obj;
}

export function validateAgainstSetOfValues(value, arrayOfValues, messageIfNotFound) {
    if (arrayOfValues.indexOf(value) === -1) {
        throw new TypeError(messageIfNotFound);
    }
    return value;
}
export function encodeQuery(query) {
    return encodeURIComponent(query);
}

/**
 * @ignore
 * Converts fields list in the following format into an JS Object
 * '{
 *     field1,
 *     field2,
 *     field3 {
 *         field4,
 *         field5
 *     }
 * }'
 * @param {String} str Object-like fields definition.
 * @returns {Object} Fields definition converted into an Object.
 */
export function convertFieldStringIntoObject(str) {
    if (typeof str !== 'string') {
        return {};
    }
    let index = -1;
    const fieldRegex = new RegExp('[a-zA-Z]');
    const parserRecursive = function(rootLevel) {
        let obj = {};
        let buffer = '';
        while (++index < str.length) {
            const char = str.charAt(index);
            switch (char) {
            case '}':
                if (buffer !== '') {
                    obj[buffer] = true;
                }
                return obj;
            case '{':
                if (buffer === '') {
                    if (rootLevel) {
                        obj = parserRecursive();
                    } else {
                        parserRecursive();
                    }
                } else {
                    obj[buffer] = parserRecursive();
                    buffer = '';
                }
                break;
            case ',':
                if (buffer !== '') {
                    obj[buffer] = true;
                }
                buffer = '';
                break;
            default:
                if (fieldRegex.test(char)) {
                    buffer += char;
                }
            }
        }
        if (buffer !== '') {
            obj[buffer] = true;
        }
        return obj;
    };
    return parserRecursive(true);
}

export function clone(object) {
    const clonedObject = {};
    cloneProperties(object, clonedObject);
    return clonedObject;
}

export const pointRegex = /(-?\d+(?:\.\d+)?)(?:\s+|\s*,\s*)(-?\d+(?:\.\d+)?)/;

export const circleRegex = /circle\((-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(\d+)\)/;

export function addFields(newFields, defaultFields = {}) {
    const result = { ...defaultFields };
    for (const field in newFields) {
        if (Object.prototype.hasOwnProperty.call(newFields, field)) {
            addNewField(result, field, newFields);
        }
    }
    return result;
}
