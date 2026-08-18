import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';

export function keyValidator(value) {
    if (!isString(value) && !isFunction(value)) {
        throw new TypeError('Unsupported key type', value);
    }
    return value;
}
