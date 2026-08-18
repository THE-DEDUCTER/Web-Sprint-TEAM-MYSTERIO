import {pointRegex, circleRegex, validateAgainstSetOfValues, convertFieldStringIntoObject} from './utils';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import isNil from 'lodash/isNil';
import isInteger from 'lodash/isInteger';
import {
    routing as routingLanguageMap,
    search as searchLanguageMap
} from '../config/language/mappings';

// Search supported language codes
// Up-to-date list available on:
// https://developer.tomtom.com/search-api/search-api-documentation/supported-languages

// Up-to-date list available on:
// eslint-disable-next-line
// https://developer.tomtom.com/search-api-and-extended-search-api/search-api-and-extended-search-api-documentation/supported-connector-types
const connectorNames = [
    'StandardHouseholdCountrySpecific',
    'IEC62196Type2CableAttached',
    'IEC60309AC1PhaseBlue',
    'IEC60309AC3PhaseRed',
    'IEC62196Type2Outlet',
    'IEC62196Type1CCS',
    'IEC62196Type2CCS',
    'IEC60309DCWhite',
    'IEC62196Type1',
    'IEC62196Type3',
    'GBT20234Part2',
    'GBT20234Part3',
    'Chademo',
    'Tesla'
];

// Up-to-date list available on:
// https://developer.tomtom.com/routing-api/routing-api-documentation/long-distance-ev-routing
const plugTypes = [
    'Small_Paddle_Inductive',
    'Large_Paddle_Inductive',
    'IEC_60309_1_Phase',
    'IEC_60309_3_Phase',
    'IEC_62196_Type_1_Outlet',
    'IEC_62196_Type_2_Outlet',
    'IEC_62196_Type_3_Outlet',
    'IEC_62196_Type_1_Connector_Cable_Attached',
    'IEC_62196_Type_2_Connector_Cable_Attached',
    'IEC_62196_Type_3_Connector_Cable_Attached',
    'Combo_to_IEC_62196_Type_1_Base',
    'Combo_to_IEC_62196_Type_2_Base',
    'Type_E_French_Standard_CEE_7_5',
    'Type_F_Schuko_CEE_7_4',
    'Type_G_British_Standard_BS_1363',
    'Type_J_Swiss_Standard_SEV_1011',
    'China_GB_Part_2',
    'China_GB_Part_3',
    'IEC_309_DC_Plug',
    'AVCON_Connector',
    'Tesla_Connector',
    'NEMA_5_20',
    'CHAdeMO',
    'SAE_J1772',
    'TEPCO',
    'Better_Place_Socket',
    'Marechal_Socket',
    'Standard_Household_Country_Specific'
];

// Up-to-date list available on:
// https://developer.tomtom.com/routing-api/routing-api-documentation/long-distance-ev-routing
const facilityTypes = [
    'Battery_Exchange',
    'Charge_100_to_120V_1_Phase_at_8A',
    'Charge_100_to_120V_1_Phase_at_10A',
    'Charge_100_to_120V_1_Phase_at_12A',
    'Charge_100_to_120V_1_Phase_at_13A',
    'Charge_100_to_120V_1_Phase_at_16A',
    'Charge_100_to_120V_1_Phase_at_32A',
    'Charge_200_to_240V_1_Phase_at_8A',
    'Charge_200_to_240V_1_Phase_at_10A',
    'Charge_200_to_240V_1_Phase_at_12A',
    'Charge_200_to_240V_1_Phase_at_16A',
    'Charge_200_to_240V_1_Phase_at_20A',
    'Charge_200_to_240V_1_Phase_at_32A',
    'Charge_200_to_240V_1_Phase_above_32A',
    'Charge_200_to_240V_3_Phase_at_16A',
    'Charge_200_to_240V_3_Phase_at_32A',
    'Charge_380_to_480V_3_Phase_at_16A',
    'Charge_380_to_480V_3_Phase_at_32A',
    'Charge_380_to_480V_3_Phase_at_63A',
    'Charge_50_to_500V_Direct_Current_at_62A_25kW',
    'Charge_50_to_500V_Direct_Current_at_125A_50kW',
    'Charge_200_to_450V_Direct_Current_at_200A_90kW',
    'Charge_200_to_480V_Direct_Current_at_255A_120kW',
    'Charge_Direct_Current_at_20kW',
    'Charge_Direct_Current_at_50kW',
    'Charge_Direct_Current_above_50kW'
];

const mapsLangCodes = [
    'NGT', 'NGT-Latn', 'ar', 'bg-BG', 'zh-TW', 'cs-CZ', 'da-DK', 'nl-NL', 'en-AU', 'en-CA', 'en-GB', 'en-NZ',
    'en-US', 'fi-FI', 'fr-FR', 'de-DE', 'el-GR', 'hu-HU', 'id-ID', 'it-IT', 'ko-KR', 'lt-LT', 'ms-MY', 'nb-NO',
    'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'ru-Latn-RU', 'ru-Cyrl-RU', 'sk-SK', 'sl-SI', 'es-ES', 'es-MX', 'sv-SE',
    'th-TH', 'tr-TR'
];

// Up-to-date list available on:
// https://developer.tomtom.com/search-api/search-api-documentation-search/fuzzy-search [fuelSet] section
const fuelTypes = [
    'Petrol', 'LPG', 'Diesel', 'Biodiesel', 'DieselForCommercialVehicles',
    'E85', 'LNG', 'CNG', 'Hydrogen', 'AdBlue'
];

const incidentDetailsAvailableFields = `
    {
        incidents {
            type,
            geometry {
                type,
                coordinates
            },
            properties {
                id,
                iconCategory,
                magnitudeOfDelay,
                events {
                    description,
                    code,
                    iconCategory
                },
                startTime,
                endTime,
                from,
                to,
                length,
                delay,
                roadNumbers,
                aci {
                    probabilityOfOccurrence,
                    numberOfReports,
                    lastReportTime
                }
            }
        }
    }`;

function isDateRfc3339(dateString) {
    return dateString.toString()
        .match(/(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/);
}

function hasBoundingBoxFields(bbox) {
    return Object.prototype.hasOwnProperty.call(bbox, 'minLon') &&
        Object.prototype.hasOwnProperty.call(bbox, 'maxLon') &&
        Object.prototype.hasOwnProperty.call(bbox, 'minLat') &&
        Object.prototype.hasOwnProperty.call(bbox, 'maxLat');
}

function checkBBoxNormalized(bbox) {
    return parseFloat(bbox.maxLat) <= parseFloat(bbox.minLat) || parseFloat(bbox.maxLon) <= parseFloat(bbox.minLon);
}

function hasChargingCurveSupportPointFields(value) {
    return Object.prototype.hasOwnProperty.call(value, 'chargeInkWh') &&
        Object.prototype.hasOwnProperty.call(value, 'timeToChargeInSeconds');
}

function hasChargingConnectionFields(value) {
    return Object.prototype.hasOwnProperty.call(value, 'facilityType') &&
        Object.prototype.hasOwnProperty.call(value, 'plugType');
}

function hasChargingModeFields(value) {
    return Object.prototype.hasOwnProperty.call(value, 'chargingConnections') &&
        Object.prototype.hasOwnProperty.call(value, 'chargingCurve');
}

function isNumberInInterval(numValue, min, max) {
    return isFinite(numValue) && numValue >= min && numValue <= max;
}

function checkArray(array) {
    return array.constructor.toString().indexOf('Array') < 0;
}
function throwTypeErrorWhen(condition, message) {
    if (condition) {
        throw new TypeError(message);
    }
}

function isPointValid(point) {
    if (!isString(point) || !pointRegex.test(point)) {
        throw new TypeError('A point is expected, but ' + point + ' [' + typeof point + '] given');
    }
    return true;
}

function checkLongitude(value) {
    const numValue = parseFloat(value);
    if (!isNumberInInterval(numValue, -180, 180)) {
        throw new TypeError('an longitude <-180,180> is expected, but ' +
            value + ' [' + typeof value + '] given');
    }
    return numValue;
}

function checkChargingMode(chargingMode) {
    throwTypeErrorWhen(!hasChargingModeFields(chargingMode),
        'a chargingMode is expected, but ' + chargingMode +
        ' [' + typeof chargingMode + '] given');

    checkChargingCurve(chargingMode.chargingCurve);
    checkChargingConnections(chargingMode.chargingConnections);

    return chargingMode;
}

function checkChargingCurve(chargingCurve) {
    if (chargingCurve.length > 10) {
        throw new Error('Given chargingCurve array contains more than 10 elements.');
    }

    chargingCurve.forEach((element) => {
        checkChargingCurveSupportPoint(element);
    });

    return chargingCurve;
}

function checkChargingCurveSupportPoint(chargingCurveSupportPoint) {
    throwTypeErrorWhen(!hasChargingCurveSupportPointFields(chargingCurveSupportPoint),
        'a chargingCurveSupportPoint is expected, but ' + chargingCurveSupportPoint +
        ' [' + typeof chargingCurveSupportPoint + '] given');

    throwTypeErrorWhen(!isNumberInInterval(chargingCurveSupportPoint.chargeInkWh, 0, Number.MAX_VALUE),
        'a chargeInkWh is expected, but ' + chargingCurveSupportPoint.chargeInkWh +
        ' [' + typeof chargingCurveSupportPoint.chargeInkWh + '] given');

    throwTypeErrorWhen(!isNumberInInterval(chargingCurveSupportPoint.timeToChargeInSeconds, 0, Number.MAX_VALUE),
        'a timeToChargeInSeconds is expected, but ' + chargingCurveSupportPoint.timeToChargeInSeconds +
        ' [' + typeof chargingCurveSupportPoint.timeToChargeInSeconds + '] given');

    return chargingCurveSupportPoint;
}

function checkChargingConnection(chargingConnection) {
    throwTypeErrorWhen(!hasChargingConnectionFields(chargingConnection),
        'a chargingConnection is expected, but ' + chargingConnection +
        ' [' + typeof chargingConnection + '] given');

    checkPlugType(chargingConnection.plugType);
    checkFacilityType(chargingConnection.facilityType);

    return chargingConnection;
}

function checkPlugType(plugType) {
    const message = 'Plug type is expected to be one of supported values, but ' +
        plugType + ' [' + typeof plugType + '] given';
    return validateAgainstSetOfValues(plugType, plugTypes, message);
}

function checkFacilityType(facilityType) {
    const message = 'Facility type is expected to be one of supported values, but ' +
    facilityType + ' [' + typeof facilityType + '] given';
    return validateAgainstSetOfValues(facilityType, facilityTypes, message);
}

function checkChargingConnections(chargingConnections) {
    if (chargingConnections.length > 20) {
        throw new Error('Given chargingConnections array contains more than 20 elements.');
    }

    chargingConnections.forEach((element) => {
        checkChargingConnection(element);
    });

    return chargingConnections;
}

function checkLatitude(value) {
    const numValue = parseFloat(value);
    if (!isNumberInInterval(numValue, -90, 90)) {
        throw new TypeError('an latitude <-90,90> is expected, but ' + value + ' [' + typeof value + '] given');
    }
    return numValue;
}

function checkPointObjectOrArray(point) {
    let lat, lon;
    if (Array.isArray(point)) {
        if (!(point.length === 2 && point.filter(isFinite).length === 2)) {
            throw new TypeError('Invalid point array in route points');
        }
        lat = point[1];
        lon = point[0];
    } else {
        if (!(isFinite(point.lat) && (isFinite(point.lon) || isFinite(point.lng)))) {
            throw new TypeError('Invalid point object in route points');
        }
        lat = point.lat;
        lon = typeof point.lon !== 'undefined' ? point.lon : point.lng;
    }

    if (!(typeof lat === 'number' || lat instanceof Number) ||
        !(typeof lon === 'number' || lon instanceof Number)) {
        throw new TypeError('Lat and lon components of point should be finite numbers');
    }

    checkLongitude(lon);
    checkLatitude(lat);
}

function validateField(options, value) {
    for (const key in options) {
        if (Object.prototype.hasOwnProperty.call(options, key)) {
            if (Object.prototype.hasOwnProperty.call(value, key) && Array.isArray(options[key].validators)) {
                for (const validator of options[key].validators) {
                    if (isFunction(validator)) {
                        value[key] = validator(value[key]);
                    }
                }
            }

            if (options[key].required === true && !Object.prototype.hasOwnProperty.call(value, key)) {
                throw new Error('Missing required ' + key);
            }
        }
    }
}

function validateNumberInInterval(min, max, errorMsg, integerRequired) {
    if (isNil(min) || isNil(max)) {
        throw new TypeError('Number in interval validator requires min and max value parameters');
    }

    return function(value) {
        const numValue = parseFloat(value);

        if (!isNumberInInterval(numValue, min, max) || (integerRequired && !isInteger(numValue))) {
            throw new TypeError(errorMsg + ', but ' + value + ' [' + typeof value + '] given');
        }

        return numValue;
    };
}

function validateIntInInterval(min, max, errorMsg) {
    return validateNumberInInterval(min, max, errorMsg, true);
}

function validateAllowedTypes(value, message, allowedTypes) {
    if (isString(value)) {
        value = value.split(',');
    }

    if (Array.isArray(value) && value.length > 0) {
        for (let i = 0; i < value.length; i += 1) {
            validateAgainstSetOfValues(value[i], allowedTypes, message);
        }

        return value.join(',');
    } else {
        throw new TypeError(message);
    }
}

function checkDateRfc3339(value, paramName) {
    if (!isDateRfc3339(value)) {
        throw new TypeError(`Invalid "${paramName}" parameter value.
        Valid format: YYYY-MM-DDThh:mm:ss.SSSTZD`);
    }

    return value;
}

export function trackingId(value) {
    if (isString(value) && /^[a-zA-Z0-9-]{1,100}$/.test(value)) {
        return value;
    } else {
        throw new TypeError('a string matching regular expression ^[a-zA-Z0-9-]{1,100}$ is expected, but ' +
            value + ' [' + typeof value + '] given');
    }
}

/**
 * @ignore
 * Casts to boolean.
 * @param {*} value
 * @return {Boolean} A casted value.
 */
export function bool(value) {
    return value === 'false' ? false : Boolean(value);
}

/**
 * @ignore
 * Checks whether the given parameter is an integer greater than or equal to 0.
 * @param {*} value The value
 * @return {Number} value
 * @throws {TypeError} for an invalid parameter.
 */
export function naturalInteger(value) {
    const numValue = parseFloat(value);
    if (!isInteger(numValue) || numValue < 0) {
        throw new TypeError('a natural integer (greater than or equal 0) is expected, but ' +
            value + ' [' + typeof value + '] given');
    }
    return numValue;
}

/**
 * @ignore
 * Checks whether the given parameter is an integer greater than 0.
 * @param {*} value The value
 * @return {Number} value
 * @throws {TypeError} for an invalid parameter.
 */
export function positiveInteger(value) {
    const numValue = parseFloat(value);
    if (!isInteger(numValue) || numValue <= 0) {
        throw new TypeError('a positive integer (greater than 0) is expected, but ' +
            value + ' [' + typeof value + '] given');
    }
    return numValue;
}

export function integer(value) {
    const numValue = parseFloat(value);
    if (!isInteger(numValue)) {
        throw new TypeError('an integer is expected, but ' + value + ' [' + typeof value + '] given');
    }
    return numValue;
}

/**
 * @ignore
 * Checks whether the given parameter is a longitude and casts to a proper interval <-180, 180>.
 * @param {*} value
 * @return {Number} value
 * @throws {TypeError} for an invalid parameter.
 */
export function longitude(value) {
    return checkLongitude(value);
}

/**
 * @ignore
 * Checks whether the given parameter is a latitude and casts to a proper interval <-90, 90>
 * @param {*} value
 * @return {Number} value
 * @throws {TypeError} for an invalid parameter.
 */
export function latitude(value) {
    return checkLatitude(value);
}

/**
 * @ignore
 * Checks whether the given parameter is a valid bounding box. Contains the whole world and a half on each
 * side.
 * @param {*} bbox The bounding box
 * @return {Object} bbox
 * @throws {TypeError} for an invalid parameter.
 */
export function validateBoundingBox(bbox) {
    throwTypeErrorWhen(!hasBoundingBoxFields(bbox),
        'a bounding box is expected, but ' + bbox + ' [' + typeof bbox + '] given');

    throwTypeErrorWhen(!isNumberInInterval(bbox.minLat, -90, 90),
        'a bounding box minimal latitude is expected ' + bbox.minLat + ' [' + typeof bbox.minLat + '] given');

    throwTypeErrorWhen(!isNumberInInterval(bbox.maxLat, -90, 90),
        'a bounding box maximal latitude is expected ' + bbox.maxLat + ' [' + typeof bbox.maxLat + '] given');

    throwTypeErrorWhen(!isNumberInInterval(bbox.minLon, -270, 180),
        'a bounding box minimal longitude is expected ' + bbox.minLon + ' [' + typeof bbox.minLon + '] given');

    throwTypeErrorWhen(!isNumberInInterval(bbox.maxLon, -180, 270),
        'a bounding box maximal longitude is expected ' + bbox.maxLon + ' [' + typeof bbox.maxLon + '] given');

    throwTypeErrorWhen(checkBBoxNormalized(bbox), 'a bounding box expected but max <= min');

    return bbox;
}

/**
 * @ignore
 * Checks whether the given parameter is a float number in a proper interval <min, max>.
 * @example
 * var numberBetweenMinusFiveAndFive = validators.numberInInterval(-5,5);
 * numberBetweenMinusFiveAndFive(-10); // false
 * numberBetweenMinusFiveAndFive(3); //true
 *
 * @param {Number} [min] The minimal value.
 * @param {Number} [max] The maximal value.
 * @return {Function} validator function that checks the type and value range.
 * @throws {TypeError} when missing a min or max value.
 */
export function numberInInterval(min, max) {
    return validateNumberInInterval(min, max, 'a number in interval <' + min + ', ' + max + '> is expected');
}

/**
 * @ignore
 * Checks whether the given parameter is an integer number in a proper interval <min, max>.
 * @example
 * var numberBetweenMinusFiveAndFive = validators.numberInInterval(-5,5);
 * numberBetweenMinusFiveAndFive(-10); // false
 * numberBetweenMinusFiveAndFive(3); //true
 *
 * @param {Number} [min] The minimal value.
 * @param {Number} [max] The maximal value.
 * @return {Function} validator function that checks the type and value range.
 * @throws {TypeError} when missing a min or max value.
 */
export function integerInInterval(min, max) {
    return validateIntInInterval(min, max, 'an integer in interval <' + min + ', ' + max + '> is expected');
}

/**
 * @ignore
 * Checks whether the given parameter is a string.
 * @param {String} string
 * @return {String} value
 * @throws {TypeError} for non strings.
 */
export function string(string) {
    if (!isString(string)) {
        throw new TypeError('a string is expected, but ' + string + ' [' + typeof string + '] given');
    }
    return string;
}

/**
 * @ignore
 * Checks whether the given parameter geometries zoom has the value <0, 22>.
 * @param {Number} geometriesZoom
 * @return {Number} value
 * @throws {TypeError} for a non invalid parameter.
 */
export function geometriesZoom(geometriesZoom) {
    return validateNumberInInterval(0, 22, 'a geometries zoom value <0, 22> is expected')(geometriesZoom);
}

/**
 * @ignore
 * Checks whether the given parameter is a zoom level of <0, 22>
 * @param {Number} zoomLevel
 * @return {Number} value
 * @throws {TypeError} for a non invalid parameter.
 */
export function zoomLevel(zoomLevel) {
    return validateIntInInterval(0, 22, 'zoom level <0, 22> is expected')(zoomLevel);
}

/**
 * @ignore
 * Checks whether the given parameter is a function.
 * @param {Function} fun
 * @return {Function} fun
 * @throws {TypeError} for a non-function.
 */
export function functionType(fun) {
    if (typeof fun !== 'function') {
        throw new TypeError('a function is expected, but ' + fun + '  [' + typeof fun + '] given');
    }
    return fun;
}

/**
 * @ignore
 * Checks whether the given country name uses the ISO 3166 alpha-3 or alpha-2 format.
 * @param {String} name
 * @return {String} name
 * @throws {TypeError} if the country name is not valid.
 */
export function countryCode(name) {
    if (!(isString(name) && (name.length === 3 || name.length === 2))) {
        throw new TypeError('a 2 or 3-characters long country name is expected, but ' + name +
            ' [' + typeof name + '] given');
    }
    return name;
}

/**
 * @ignore
 * Checks whether the given language code belongs to a predefined set of supported language codes
 * which is a subset of the IETF language tags.
 * @param {String|undefined} langCode
 * @return {String}
 */
export function languageCode(langCode) {
    const searchLanguageCodes = Object.keys(searchLanguageMap);
    if (!isString(langCode) || searchLanguageCodes.indexOf(langCode) < 0) {
        throw new TypeError('One of pre-defined language codes was expected: ' + searchLanguageCodes +
            ', but ' + langCode + ' [' + typeof langCode + '] given');
    }
    return langCode;
}

/**
 * @ignore
 * Checks whether the given country name's list uses the ISO 3166 alpha-3 or alpha-2 format.
 * @param {String|Array} value
 * @return {String} list
 * @throws {TypeError} if one of the country names is not valid.
 */
export function countrySet(value) {
    throwTypeErrorWhen(!isString(value) && checkArray(value),
        'An array of string country names or string (divided with commas) of country ' +
        'names (two or three-characters long) is expected, but ' + value + ' [' + typeof value + '] given');

    const stringValue = isString(value) ? value : value.join();
    throwTypeErrorWhen(!stringValue.match(/^([a-zA-z]{2,3},)*[a-zA-z]{2,3}$/),
        'An array of string country names or string (divided with commas) of country ' +
        'names (two or three-characters long) is expected, but ' + value + ' [' + typeof value + '] given');

    return stringValue;
}

/**
 * @ignore
 * Checks whether the given EV connector names list belongs to a predefined set of supported names
 * @param {String} value
 * @return {String} list
 * @throws {TypeError} if one of the EV connectors names is not valid.
 */
export function connectorSet(value) {
    const message = 'List of pre-defined EV connector names was expected,' +
    'but ' + value + ' [' + typeof value + '] given';

    return validateAllowedTypes(value, message, connectorNames);
}

/**
 * @ignore
 * Checks whether the given fuel types names list belongs to a predefined set of supported names
 * @param {String} value
 * @return {String} list
 * @throws {TypeError} if one of the fuel type names is not valid.
 */
export function fuelSet(value) {
    const message = 'List of pre-defined Fuel types names was expected,' +
    'but ' + value + ' [' + typeof value + '] given';

    return validateAllowedTypes(value, message, fuelTypes);
}

/**
 * @ignore
 * Checks whether the given mapcode types list belongs to a predefined set of supported names
 * @param {String} value
 * @return {String} list
 * @throws {TypeError} if one of the mapcode types names is not valid.
 */
export function mapcodes(value) {
    const mapcodesValues = [
        'Local',
        'International',
        'Alternative'
    ];

    const message = 'List of pre-defined mapcode types names was expected,' +
    'but ' + value + ' [' + typeof value + '] given';

    if (isString(value)) {
        value = value.split(',');
    }

    if (Array.isArray(value) && value.length > 0) {
        for (let i = 0; i < value.length; i += 1) {
            validateAgainstSetOfValues(value[i], mapcodesValues, message);
        }

        return value.join(',');

    } else {
        throw new TypeError(message);
    }

}

/**
 * @ignore
 * Checks whether the given EV charging plug type belongs to a predefined set of supported types
 * @param {String} value
 * @return {String} plugType
 * @throws {TypeError} if the given plug type is not valid.
 */
export function plugType(value) {
    return checkPlugType(value);
}

/**
 * @ignore
 * Checks whether the given EV charging facility type belongs to a predefined set of supported types
 * @param {String} value
 * @return {String} facilityType
 * @throws {TypeError} if the given facility type is not valid.
 */
export function facilityType(value) {
    return checkFacilityType(value);
}

/**
 * @ignore
 * Checks whether the given chargingCurveSupportPoint object has right properties
 * @param {Object} chargingCurveSupportPoint
 * @return {Object} chargingCurveSupportPoint
 * @throws {TypeError} if the given chargingCurveSupportPoint is not valid.
 */
export function chargingCurveSupportPoint(chargingCurveSupportPoint) {
    return checkChargingCurveSupportPoint(chargingCurveSupportPoint);
}

/**
 * @ignore
 * Checks whether the given chargingCurve array has proper elements
 * @param {Array} chargingCurve
 * @return {Array} chargingCurve
 * @throws {TypeError} if the given chargingCurve array is not valid.
 */
export function chargingCurve(chargingCurve) {
    return checkChargingCurve(chargingCurve);
}

/**
 * @ignore
 * Checks whether the given chargingConnection has right properties
 * @param {Object} chargingConnection
 * @return {Object} chargingConnection
 * @throws {TypeError} if the given chargingConnection is not valid.
 */
export function chargingConnection(chargingConnection) {
    return checkChargingConnection(chargingConnection);
}

/**
 * @ignore
 * Checks whether the given chargingConnections array has proper elements
 * @param {Array} chargingConnections
 * @return {Array} chargingConnections
 * @throws {TypeError} if the given chargingConnections array is not valid.
 */
export function chargingConnections(chargingConnections) {
    return checkChargingConnections(chargingConnections);
}

/**
 * @ignore
 * Checks whether the given chargingMode has right properties
 * @param {Object} chargingMode
 * @return {Object} chargingMode
 * @throws {TypeError} if the given chargingMode is not valid.
 */
export function chargingMode(chargingMode) {
    return checkChargingMode(chargingMode);
}

/**
 * @ignore
 * Checks whether the given chargingModes array has right elements
 * @param {Array} chargingModes
 * @return {Array} chargingModes
 * @throws {TypeError} if the given chargingModes array is not valid.
 */
export function chargingModes(chargingModes) {
    if (chargingModes.length > 10) {
        throw new Error('Given chargingModes array contains more than 10 elements.');
    }

    chargingModes.forEach((element) => {
        checkChargingMode(element);
    });

    return chargingModes;
}

/**
 * @ignore
 * Checks whether the given country name's list uses the ISO 3166 alpha-3 or alpha-2 format.
 * @param {Boolean} allowEmpty Specifies that it allows an empty array as a valid value.
 * @param {String|Array} value
 * @return {String} list
 * @throws {TypeError} if one of the country names is not valid.
 */
export function countrySetAlpha3(allowEmpty, value) {
    throwTypeErrorWhen(!isString(value) && checkArray(value),
        'An array of string country names or string (divided with commas) of country ' +
        'names (three-characters long) is expected, but ' + value + ' [' + typeof value + '] given');

    const stringValue = isString(value) ? value : value.join();
    if (allowEmpty && stringValue === '') {
        return value;
    }
    throwTypeErrorWhen(!stringValue.match(/^([a-zA-z]{3},)*[a-zA-z]{3}$/),
        'An array of string country names or string (divided with commas) of country ' +
        'names (three-characters long) is expected, but ' + value + ' [' + typeof value + '] given');

    return value;
}

/**
 * @ignore
 * Checks whether the given point is in the proper format.
 * @param {String} value
 * @return {String} value
 * @throws {TypeError} if the given value is in an invalid format.
 */
export function point(value) {
    isPointValid(value);
    return value;
}

/**
 * @ignore
 * Checks whether the given parameter is a positive integer (greater than 0) and lower than 5.
 * @param {Number} value The value
 * @return {Number} value
 * @throws {TypeError} for an invalid parameter.
 */
export function fuzzinessLevel(value) {
    return validateIntInInterval(1, 4, 'Fuzziness level value (a positive integer lower than 5) is expected')(value);
}

/**
 * @ignore
 * Checks whether the given parameter is a positive integer (greater than 0) and lower than 100.
 * @param {Number} value The value
 * @return {Number} value
 * @throws {TypeError} for an invalid parameter.
 */
export function limit(value) {
    return validateIntInInterval(1, 100, 'Limit value (a positive integer lower than 100) is expected')(value);
}

/**
 * @ignore
 * Checks whether the given parameter is an offset - positive integer <0, 1900>.
 * @param {Number} value The value
 * @return {Number} value
 * @throws {TypeError} for an invalid parameter.
 */
export function offset(value) {
    return validateIntInInterval(0, 1900, 'Offset an integer value <0, 1900> is expected')(value);
}

/**
 * @ignore
 * Checks whether the given parameter is a plain object (array and functions are not accepted).
 * @param {Object} object
 * @return {Object} object
 * @throws {TypeError} for a non-object.
 */
export function plainObject(object) {
    if (typeof object !== 'object' || object.constructor !== Object) {
        throw new TypeError('an object is expected, but ' + object + '  [' + typeof object + '] given');
    }
    return object;
}

/**
 * @ignore
 * Checks whether the given parameter is an array (objects and functions are not accepted).
 * @param {Array} array
 * @return {Array} array
 * @throws {TypeError} for a non-array.
 */
export function arrayType(array) {
    if (checkArray(array)) {
        throw new TypeError('an array is expected, but ' + array + '  [' + typeof array + '] given');
    }
    return array;
}

export function arrayOf(options) {
    return (values) => {
        values.forEach((value) => validateField(options, value));
        return values;
    };
}

export function entityType(values) {
    const entityTypeValues = [
        'Country',
        'CountrySubdivision',
        'CountrySecondarySubdivision',
        'CountryTertiarySubdivision',
        'Municipality',
        'MunicipalitySubdivision',
        'Neighbourhood',
        'PostalCodeArea'
    ];
    for (const value of values.split(',')) {
        if (entityTypeValues.indexOf(value) === -1) {
            throw new TypeError(
                `Entity type (${entityTypeValues}) is expected, but ${values} [${typeof values}] given`);
        }
    }

    return values;
}

export function objectOf(options) {
    return (value) => {
        validateField(options, value);
        return value;
    };
}

export function roadUse(value) {
    const roadUseValues = ['LimitedAccess', 'Arterial', 'Terminal', 'Ramp', 'Rotary', 'LocalStreet'];
    throwTypeErrorWhen(!isString(value) || !value.match(/^\[("\w*",?)+\]$/),
        'Road use is expected, but ' + value + '  [' + typeof value + '] given');

    const elements = value.replace(/["[\]]/g, '').split(',');
    for (let i = 0; i < elements.length; i += 1) {
        throwTypeErrorWhen(roadUseValues.indexOf(elements[i]) < 0,
            'Road use (' + roadUseValues + ') is expected, but ' + value +
            '  [' + typeof value + '] given');
    }
    return value;
}

export function arrayOfValues(values, paramName) {
    return (value) => {
        const message = 'Supported ' + paramName + ' type is expected (array with one of: ' + values +
            '), but ' + value + ' [' + typeof value + '] given';
        if (checkArray(value)) {
            throw new TypeError('an array is expected, but ' + value + '  [' + typeof value + '] given');
        }
        for (let i = 0; i < value.length; i += 1) {
            validateAgainstSetOfValues(value[i], values, message);
        }
        return value;
    };
}

/**
 * @ignore
 * Checks whether the given departure time is now or in the proper RFC-3339 format ( 1996-12-19T16:39:57 or
 * 1996-12-19T16:39:57-08:00 ):
 * @param {String} value
 * @return {String} value
 * @throws {TypeError} if the given value is not valid.
 */
export function departAt(value) {
    if (value === 'now' || isDateRfc3339(value) && Date.now() < Date.parse(value)) {
        return value;
    } else {
        throw new TypeError('Supported departAt is now or rfc3339 format and no earlier than now(), but ' +
            value + ' [' + typeof value + '] given');
    }
}

/**
 * @ignore
 * Checks whether the given arrive time is in proper RFC-3339 format (1996-12-19T16:39:57 or
 * 1996-12-19T16:39:57-08:00):
 * @param {String} value
 * @return {String} value
 * @throws {TypeError} if the given value is not valid.
 */
export function arriveAt(value) {
    if (isDateRfc3339(value) && Date.now() < Date.parse(value)) {
        return value;
    } else {
        throw new TypeError('Supported arriveAt is rfc3339 format, but and no earlier than now() ' +
            value + ' [' + typeof value + '] given');
    }
}

export function routingGuidanceLanguage(value) {
    const routingGuidanceLanguageValues = Object.keys(routingLanguageMap);
    const message = 'Supported routing guidance language is expected to be one of: ' +
        routingGuidanceLanguageValues + '), but ' + value + ' [' + typeof value + '] given';
    return validateAgainstSetOfValues(value, routingGuidanceLanguageValues, message);
}

export function mapsLanguage(value) {
    const message = 'Supported maps language is expected to be one of: ' +
    mapsLangCodes + '), but ' + value + ' [' + typeof value + '] given';
    return validateAgainstSetOfValues(value, mapsLangCodes, message);
}

/**
 * @ignore
 * Checks whether the given routing locations is in the proper format:
 * circle - A circle with a center point and a radius (in meters).
 * The radius must be a positive integer with the maximum value of 20050000. Note that larger integer values
 * will not be rejected but lowered to the maximum value. circle(52.37245,4.89406,10000) location - A point or
 * a circle.
 * 52.37245,4.89406
 * circle(52.37245,4.89406,10000)
 * @param {String} value
 * @return {String} value
 * @throws {TypeError} if the given value is not valid.
 */
export function routingLocations(value) {
    const point = pointRegex,
        circle = circleRegex;

    if (value.constructor.toString().indexOf('Array') > -1) {
        value = value.join(':');
    }

    const routingLocation = new RegExp('^' + point.source + ':(?:(?:' + point.source + '|' +
        circle.source + '):)*' + point.source + '$');
    if (!value.match(routingLocation)) {
        throw new TypeError('Routing location is expected. But ' + value + ' [' + typeof value + '] given');
    }
    return value;
}

/**
 * @ignore
 * Checks whether the given input is in the proper circle format:
 * circle - A circle with a center point and a radius (in meters).
 * The radius must be a positive integer with the maximum value of 20050000. Note that larger integer values
 * will not be rejected but lowered to the maximum value. circle(52.37245,4.89406,10000)
 * @param {String} value
 * @return {String} value
 * @throws {TypeError} if the given value is not valid.
 */
export function circle(value) {
    throwTypeErrorWhen(!isString(value),
        'Expecting circle but ' + value + ' [' + typeof value + '] given');

    const match = value.match(/circle\(-?\d*(?:\.\d*)?\s*,\s*-?\d*(?:\.\d*)?\s*,\s*(\d+)\)/);
    throwTypeErrorWhen(!match || parseFloat(match[1]) > 20050000,
        'Expecting circle but ' + value + ' [' + typeof value + '] given');

    return value;
}

/**
 * @ignore
 * Checks whether the given input is in the proper geometry list format.
 * Geometry list represents a list of figures (polygons or circles) objects.
 * Circle contains properties like: type ("CIRCLE"), position (lat & lon) and radius.
 * Polygon contains properties like: type ("POLYGON") and vertices (as a list of points).
 *
 * @param {Array} value
 * @return {Array} value
 * @throws {TypeError} if the given value is not valid.
 */
export function geometryList(value) {
    throwTypeErrorWhen(checkArray(value), 'An array of geometry objects is expected, but ' +
    value + ' [' + typeof value + '] given');

    if (value.length > 0) {
        for (let i = 0; i < value.length; i += 1) {
            const geoObject = value[i];
            throwTypeErrorWhen(!Object.prototype.hasOwnProperty.call(geoObject, 'type') ||
                !Object.prototype.hasOwnProperty.call(geoObject, 'vertices') &&
                (!Object.prototype.hasOwnProperty.call(geoObject, 'position') ||
                !Object.prototype.hasOwnProperty.call(geoObject, 'radius')),
            'An array of geometry objects is expected, but ' + value + ' [' + typeof value + '] given');
        }
    } else {
        throw new TypeError('An array of geometry objects is expected, but ' + value +
            ' [' + typeof value + '] given');
    }
    return value;
}

/**
 * @ignore
 *
 * Checks if the given value has a property 'route' which is an array of points.
 * By an array of points we mean an array of an array of { lon, lat }, { lng, lat }, [ num, num ],
 * Maps.LngLat objects or mixed.
 *
 * @param {Object} value
 *
 * @return {Object} value Stringified array of figures (JSON format).
 * @throws {TypeError} if the given value is not valid.
 */
export function route(value) {
    let points;

    if (typeof value.points !== 'undefined') {
        points = value.points;
    } else {
        throw new TypeError('Invalid structure of the route object');
    }

    if (points && !(Array.isArray(points) && points.length > 2)) {
        throw new TypeError('Provided route array ' +
            points + ' is not valid. It should be an array with at least 2 points.');
    }
    points.forEach(checkPointObjectOrArray);
    return value;
}

export function supportingPoints(value) {
    if (!Array.isArray(value)) {
        throw new TypeError('Expecting array in supporting points validator');
    }
    if (!value.length || value.length < 2) {
        throw new TypeError('There should be at least two supporting points');
    }
    return value;
}

export function waitTimeSeconds(value) {
    if (isNaN(value) || !isInteger(value) || !(value === 120 || (value >= 5 && value <= 60))) {
        throw new TypeError('Invalid `waitTimeSeconds` parameter value. ' +
        'Must be 120 or an integer between 5 and 60.');
    }

    return value;
}

export function clientTime(value) {
    return checkDateRfc3339(value, 'clientTime');
}

export function dateTime(value) {
    return checkDateRfc3339(value, 'dateTime');
}

/**
 * @ignore
 * Checks whether object-like fields definition matches
 * available fields.
 *
 * @param {String} value Object-like fields definition.
 * @returns {String} value Object-like fields definition.
 * @throws {TypeError} if given value not matches available fields.
 */
export function validIncidentDetailsV5Fields(value) {
    const availableFields = convertFieldStringIntoObject(incidentDetailsAvailableFields);
    const testFields = convertFieldStringIntoObject(value);

    const recursiveComparer = (objToTest, objToCompare) => {
        Object.keys(objToTest).forEach(function(key) {
            if (objToCompare.hasOwnProperty(key) &&
                (typeof objToTest[key] === typeof objToCompare[key])) {
                if (typeof objToTest[key] === 'object') {
                    recursiveComparer(objToTest[key], objToCompare[key]);
                }
            } else {
                throw new TypeError(`Property ${key} not matches available fields: ` + incidentDetailsAvailableFields);
            }
        });
    };
    recursiveComparer(testFields, availableFields);

    return value;
}

const customEndpoints = [
    'adpEndpoint',
    'autocompleteEndpoint',
    'batchRoutingEndpoint',
    'batchSearchEndpoint',
    'batchSyncRoutingEndpoint',
    'batchSyncSearchEndpoint',
    'calculateReachableRangeEndpoint',
    'captionV2Endpoint',
    'chargingAvailabilityEndpoint',
    'copyrightsV2Endpoint',
    'flowSegmentDataEndpoint',
    'geocodeEndpoint',
    'incidentDetailsV5Endpoint',
    'incidentRegionsEndpoint',
    'incidentViewportEndpoint',
    'longDistanceEVRoutingEndpoint',
    'matrixRoutingEndpoint',
    'matrixSyncRoutingEndpoint',
    'nearbySearchEndpoint',
    'placeByIdEndpoint',
    'poiCategoriesEndpoint',
    'reverseGeocodeEndpoint',
    'routingEndpoint',
    'searchEndpoint',
    'staticMapImageEndpoint',
    'structuredGeocodeEndpoint'
];

const customQueries = [
    'batchAdpQueryEndpoint',
    'batchChargingAvailabilityQueryEndpoint',
    'batchNearbySearchQueryEndpoint',
    'batchReachableRangeQueryEndpoint',
    'batchReverseGeocodeQueryEndpoint',
    'batchRoutingQueryEndpoint',
    'batchSearchQueryEndpoint',
    'batchStructuredGeocodeQueryEndpoint'
];

export function validCustomEndpointsObject(value) {
    try {
        plainObject(value);

        for (const endpointName in value) {
            if (customEndpoints.includes(endpointName)) {
                validCustomEndpoint(value[endpointName]);
            } else if (customQueries.includes(endpointName)) {
                validCustomQuery(value[endpointName]);
            } else {
                throw new TypeError('Endpoint name is expected to be one of supported values, but ' +
                value + 'given');
            }
        }
    } catch (error) {
        throw new TypeError(`Invalid custom endpoints object. ${error.message}`);
    }

    return value;
}

export function validCustomEndpoint(value) {
    if (!isString(value)) {
        throw new TypeError(`Invalid custom URL. A string URL is expected, ${value} [${typeof value}] given`);
    }

    const hasProtocolRegex = new RegExp(/(https:\/\/|http:\/\/).*/);
    if (hasProtocolRegex.test(value)) {
        throw new TypeError(`Invalid custom URL. URL without protocol (http/https) is expected, ${value} given`);
    }

    const tomtomDomainRegex = new RegExp(/^[0-9a-zA-Z-.]+(\.tomtom\.com)(\/.*)?$/);
    if (!tomtomDomainRegex.test(value)) {
        throw new TypeError(`Invalid custom URL. URL in TomTom domain (*.tomtom.com) is expected, ${value} given`);
    }

    return value;
}

export function validCustomQuery(value) {
    if (!isString(value)) {
        throw new TypeError(`Invalid custom query. A string URL is expected, ${value} [${typeof value}] given`);
    }

    const startingWithSlash = new RegExp(/^\//);
    if (!startingWithSlash.test(value)) {
        throw new TypeError(`Invalid custom query. A string starting with / is expected, ${value} given`);
    }

    return value;
}

export { keyValidator as key } from './validators/key';
export { numberValidator as number } from './validators/number';
export { oneOfValueValidator as oneOfValue } from './validators/oneOfValue';

