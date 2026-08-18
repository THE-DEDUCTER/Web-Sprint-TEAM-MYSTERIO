/**
 * @ignore
 * Checks whether the given parameter is a float number.
 * @param {*} value The value
 * @return {Number} value
 * @throws {TypeError} for an invalid parameter.
 */
export function numberValidator(value) {
    const numValue = parseFloat(value);
    if (!isFinite(numValue)) {
        throw new TypeError('a number is expected, but ' + value + ' [' + typeof value + '] given');
    }
    return numValue;
}
