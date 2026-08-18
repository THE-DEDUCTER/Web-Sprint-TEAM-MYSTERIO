import isNil from 'lodash/isNil';

// import * as isNil from 'lodash.isnil';
class DeprecationHandler {
    constructor() {
        this.log = {};
    }

    _isLogPrinted(serviceName, name) {
        const serviceLog = this.log[serviceName];
        if (serviceLog) {
            return serviceLog[name];
        }

        return false;
    }

    _setLog(serviceName, name) {
        this.log[serviceName] = this.log[serviceName] || {};
        this.log[serviceName][name] = true;
    }

    _displayWarning(name, date, serviceName) {
        const isPastCurrentDate = Date.now() > Date.parse(date);
        const serviceNameMsg = serviceName !== 'default' ? `(used in ${serviceName}) ` : '';

        if (isPastCurrentDate) {
            console.error(`[DEPRECATION WARNING] The parameter '${name}' ${serviceNameMsg} deprecation period ` +
            'has ended. It is recommended to stop using it as it may stop working. ' +
            'Please refer to https://developer.tomtom.com/maps-sdk-web-js/documentation for more information');
        } else {
            console.warn(`[DEPRECATION NOTICE] The parameter '${name}' ${serviceNameMsg}is deprecated. ` +
                `By ${date} we can not guarantee that it will continue to work. ` +
                'Please refer to https://developer.tomtom.com/maps-sdk-web-js/documentation for more information');
        }

    }

    checkDeprecation(name, date, serviceName = 'default') {
        if (isNil(name) || isNil(date) || this._isLogPrinted(serviceName, name)) {
            return;
        }

        this._displayWarning(name, date, serviceName);
        this._setLog(serviceName, name);
    }

}

export default new DeprecationHandler();
