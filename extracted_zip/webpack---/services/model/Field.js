import isFunction from 'lodash/isFunction';

const dateRegex = /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/; // eslint-disable-line

export default class Field {
    constructor({validators, converters, required, defaultValue, deprecationDate}) {
        Object.assign(this, {validators, converters, required, defaultValue, deprecationDate});

        this._validateFields();
    }

    _isArrayOfFunctions(array) {
        if (!Array.isArray(array)) {
            return false;
        }

        for (let i = 0; i < array.length; i++) {
            if (!isFunction(array[i])) {
                return false;
            }
        }

        return true;
    }

    _validateFields() {
        if (this.validators === null || (this.validators && !this._isArrayOfFunctions(this.validators))) {
            throw new Error('Validators are not an array of functions.');
        }
        if (this.converters === null || (this.converters && !this._isArrayOfFunctions(this.converters))) {
            throw new Error('Converters are not an array of functions.');
        }
        if (!(this.required === undefined || typeof this.required === 'boolean')) {
            throw new Error('Required must be a Boolean.');
        }
        if (this.deprecationDate &&
            (Number.isNaN(Date.parse(this.deprecationDate)) || !dateRegex.test(this.deprecationDate))) {
            throw new Error('deprecationDate must contain a valid date');
        }
    }

    getDefaultValue() {
        if (isFunction(this.defaultValue)) {
            return this.defaultValue();
        }

        return this.defaultValue;
    }

    getConverters() {
        return this.converters ? this.converters : [];
    }

    getValidators() {
        return this.validators ? this.validators : [];
    }

    getDeprecationDate() {
        return this.deprecationDate;
    }

    isRequired() {
        return this.required === true;
    }
}

export function field(options) {
    return new Field(options);
}
