import {validateAgainstSetOfValues} from '../utils';

export function oneOfValueValidator(values, paramName) {
    return (value) => {
        const message = 'Supported ' + paramName + ' is expected (one of: ' + values + '), but ' + value +
            ' [' + typeof value + '] was given.';
        return validateAgainstSetOfValues(value, values, message);
    };
}
