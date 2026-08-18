/* jshint nomen:false */
import isFunction from 'lodash/isFunction';
import castArray from 'lodash/castArray';
import isString from 'lodash/isString';
import isNil from 'lodash/isNil';
import {pointRegex, circleRegex} from './utils';
import {
    routing as routingLanguageMap,
    search as searchLanguageMap,
    maps as mapsLanguageMap,
    incidentV5 as incidentV5LanguageMap
} from '../config/language/mappings';

import geopoliticalViewMappings from 'Services/config/geopolView/mappings';

function isLatLon(latlon) {
    return Object.prototype.hasOwnProperty.call(latlon, 'lat') &&
    (Object.prototype.hasOwnProperty.call(latlon, 'lon') || Object.prototype.hasOwnProperty.call(latlon, 'lng'));
}

function or(first, second) {
    if (first === undefined) {
        return second;
    }
    return first;
}

function throwTypeErrorWhen(condition, message) {
    if (condition) {
        throw new TypeError(message);
    }
}

function normalizeLatitude(latitude) {
    const numLatitude = parseFloat(latitude);
    if (!isFinite(numLatitude)) {
        throw new TypeError('an number is expected, but ' + latitude + ' [' + typeof latitude + '] given');
    }
    const i = Math.ceil((numLatitude - 90) / 180);
    return numLatitude - 180 * i;
}

function normalizeLongitude(longitude) {
    const numLongitude = parseFloat(longitude);
    if (!isFinite(numLongitude)) {
        throw new TypeError('an number is expected, but ' + longitude + ' [' + typeof longitude + '] given');
    }
    const i = Math.ceil((numLongitude - 180) / 360);
    return numLongitude - 360 * i;
}

function isXY(xy) {
    return Object.prototype.hasOwnProperty.call(xy, 'x') && Object.prototype.hasOwnProperty.call(xy, 'y');
}

function isLatitudeLongitude(value) {
    return Object.prototype.hasOwnProperty.call(value, 'latitude') &&
        Object.prototype.hasOwnProperty.call(value, 'longitude');
}

function isLatLonFunction(value) {
    return isFunction(value.lat) && isFunction(value.lng);
}

function castPoint(value) {
    if (Array.isArray(value) && value.length === 2) {
        return [...value].reverse();
    }
    if (isString(value)) {
        const match = value.match(pointRegex);
        throwTypeErrorWhen(!match || !match[1] || !match[2],
            'A point is expected, but ' + value + ' [' + typeof value + '] given');
        return [match[2], match[1]];
    }
    if (isLatLonFunction(value)) {
        return [value.lat(), value.lng()];
    }
    if (isLatLon(value)) {
        return [value.lat, or(value.lon, value.lng)];
    }
    if (isXY(value)) {
        return [value.y, value.x];
    }
    if (isLatitudeLongitude(value)) {
        return [value.latitude, value.longitude];
    }
    throw new TypeError('A point is expected, but ' + value + ' [' + typeof value + '] given');
}

function isLatLonBBox(bbox) {
    return Object.prototype.hasOwnProperty.call(bbox, 'minLon') &&
        Object.prototype.hasOwnProperty.call(bbox, 'minLat') &&
        Object.prototype.hasOwnProperty.call(bbox, 'maxLon') &&
        Object.prototype.hasOwnProperty.call(bbox, 'maxLat');
}

function isRightLeftTopBottomBBox(bbox) {
    return Object.prototype.hasOwnProperty.call(bbox, 'left') &&
        Object.prototype.hasOwnProperty.call(bbox, 'bottom') &&
        Object.prototype.hasOwnProperty.call(bbox, 'right') &&
        Object.prototype.hasOwnProperty.call(bbox, 'top');
}

function isWestEastNorthSouthBBox(bbox) {
    return isFunction(bbox.getWest) && isFunction(bbox.getEast) &&
        isFunction(bbox.getSouth) && isFunction(bbox.getNorth);
}

function castBoundingBox(bbox) {
    let sw, ne;
    if (isLatLonBBox(bbox)) {
        return bbox;
    }
    if (isRightLeftTopBottomBBox(bbox)) {
        return { minLon: bbox.left, minLat: bbox.bottom, maxLon: bbox.right, maxLat: bbox.top };
    }
    if (isWestEastNorthSouthBBox(bbox)) {
        return {
            minLon: bbox.getWest(),
            minLat: bbox.getSouth(),
            maxLon: bbox.getEast(),
            maxLat: bbox.getNorth()
        };
    }
    if (isFunction(bbox.getNorthEast) && isFunction(bbox.getSouthWest)) {
        ne = castPoint(bbox.getNorthEast());
        sw = castPoint(bbox.getSouthWest());
        return { minLon: sw[1], minLat: sw[0], maxLon: ne[1], maxLat: ne[0] };
    }
    if (Array.isArray(bbox) && bbox.length === 4) {
        return { minLon: bbox[0], minLat: bbox[1], maxLon: bbox[2], maxLat: bbox[3] };
    }
    if (Array.isArray(bbox) && bbox.length === 2) {
        sw = castPoint(bbox[0]);
        ne = castPoint(bbox[1]);
        return { minLon: sw[1], minLat: sw[0], maxLon: ne[1], maxLat: ne[0] };
    }
    if (isString(bbox)) {
        bbox = bbox.trim().split(/\s*,\s*/);
        if (bbox.length === 4) {
            return {
                minLon: parseFloat(bbox[0]),
                minLat: parseFloat(bbox[1]),
                maxLon: parseFloat(bbox[2]),
                maxLat: parseFloat(bbox[3])
            };
        }
    }
    throw new TypeError('Unable to cast ' + bbox + ' [' + typeof bbox + '] to bounding box');
}

function normalizeBoundingBox(bbox) {
    let w = bbox.minLon, e = bbox.maxLon, s = bbox.minLat, n = bbox.maxLat;
    if (e - w > 360) {
        e = 180;
        w = -180;
    } else {
        if (e > 270) {
            const right = Math.ceil(w / 360);
            e -= 360 * right;
            w -= 360 * right;
        }
        if (w < -270) {
            const left = Math.ceil(-e / 360);
            e += 360 * left;
            w += 360 * left;
        }
    }
    s = s < -90 ? -90 : s;
    n = n > 90 ? 90 : n;
    return { minLon: w, minLat: s, maxLon: e, maxLat: n };
}

function languageConverter(value, mapping) {

    if (isNil(value) || value === '') {
        return '';
    }

    if (mapping[value]) {
        return value;
    }

    value = value.toLowerCase();

    for (const language in mapping) {
        if (Object.prototype.hasOwnProperty.call(mapping, language) && language !== 'defaultValue' &&
            Object.prototype.hasOwnProperty.call(mapping[language].synonyms, value)
        ) {
            return language;
        }
    }
    console.warn('Value provided is invalid (' + value +
        '). Default value (' + mapping.defaultValue.value + ') will be used instead.');
    return mapping.defaultValue.value;
}

function geopoliticalViewConverter(value) {
    if (isNil(value) || value === '') {
        return '';
    }

    if (geopoliticalViewMappings[value]) {
        return value;
    }
    console.warn('Value provided is invalid (' + value +
        '). Default value (' + geopoliticalViewMappings.defaultValue + ') will be used instead.');
    return geopoliticalViewMappings.defaultValue;
}

function circleFromString(value) {
    const match = value.match(circleRegex);
    throwTypeErrorWhen(!match || !match[1] || !match[2] || !match[3],
        'Unable to cast ' + value + ' [' + typeof value + '] to circle');

    const lat = parseFloat(match[2]);
    const lon = parseFloat(match[1]);
    const radius = parseFloat(match[3]);
    throwTypeErrorWhen(!isFinite(lat) || !isFinite(lon),
        'Unable to cast ' + value + ' [' + typeof value + '] to circle');

    return 'circle(' + lat + ',' + lon + ',' + radius + ')';
}

function castAndNormalizePoint(value) {
    const point = castPoint(value);
    return normalizeLatitude(point[0]) + ',' + normalizeLongitude(point[1]);
}

function convertPointOrCircle(value) {
    if (isString(value) && value.indexOf('circle') > -1) {
        return circleFromString(value);
    }
    if (Array.isArray(value) && value.length === 3) {
        return 'circle(' + normalizeLatitude(value[1]) + ',' +
            normalizeLongitude(value[0]) + ',' + value[2] + ')';
    }
    return castAndNormalizePoint(value);
}

function extractPointsFromPolygon(inputPoints) {
    const points = [];
    for (const point in inputPoints) {
        if (Object.prototype.hasOwnProperty.call(inputPoints, point)) {
            points.push(castAndNormalizePoint(inputPoints[point]));
        }
    }
    return points;
}

function convertPointToLatitudeLongitude(point) {
    if (!isString(point)) {
        return point;
    }

    const splitPoint = point.split(',');

    return {
        latitude: splitPoint[0],
        longitude: splitPoint[1]
    };
}

function prepareSupportingPoints(supportingPoints) {
    return supportingPoints.map(convertPointToLatitudeLongitude);
}

export function convertBoundingBox(value) {
    return normalizeBoundingBox(castBoundingBox(value));
}

export function longitude(value) {
    return normalizeLongitude(value);
}

export function latitude(value) {
    return normalizeLatitude(value);
}

export function point(value) {
    return castAndNormalizePoint(value);
}

export function dateTime(value) {
    if (value && value instanceof Date) {
        return value.toISOString();
    }

    if (!value || !isString(value)) {
        throw new TypeError('Unable to cast ' + value + ' [' + typeof value + '] to datetime value.');
    }
    if (value !== 'now') {
        value = new Date(value).toISOString();
    }
    return value;
}

export function geometryList(value) {
    let figure;
    throwTypeErrorWhen(!value || !Array.isArray(value),
        'Unable to cast ' + value + ' [' + typeof value + '] to geometry list (array)');

    for (const figureName in value) {
        if (Object.prototype.hasOwnProperty.call(value, figureName)) {
            figure = value[figureName];
            if (figure.type === 'POLYGON') {
                figure.vertices = extractPointsFromPolygon(figure.vertices);
            } else if (figure.type === 'CIRCLE') {
                figure.position = castAndNormalizePoint(figure.position);
            }
        }
    }
    return value;
}

export function mapLanguage(value) {
    return languageConverter(value, mapsLanguageMap);
}

export function searchLanguage(value) {
    return languageConverter(value, searchLanguageMap);
}

export function routingGuidanceLanguage(value) {
    return languageConverter(value, routingLanguageMap);
}

export function incidentDetailsV5Language(value) {
    return languageConverter(value, incidentV5LanguageMap);
}

export function geopoliticalView(value) {
    return geopoliticalViewConverter(value);
}

export function routingLocations(value) {
    const response = [];
    if (isString(value)) {
        return value
            .split(':')
            .map((point) => point.split(',').reverse().join(','))
            .join(':');
    }
    if (Array.isArray(value)) {
        throwTypeErrorWhen(value.length < 2,
            'Unable to cast ' + value + ' [' + typeof value + '] to routing locations string');

        // Convert first element to point
        response.push(castAndNormalizePoint(value[0]));

        // Convert elements from 1 to length-2 to point or circle
        for (let i = 1; i < value.length - 1; i += 1) {
            response.push(convertPointOrCircle(value[i]));
        }

        // Convert last element (length-1) to point
        response.push(castAndNormalizePoint(value[value.length - 1]));

        // Join converted elements
        return response.join(':');
    }
    throw new TypeError('Unable to cast ' + value + ' [' + typeof value + '] to routing locations string');
}

export function roadUse(value) {
    if (isString(value)) {
        return '["' + value.replace(/["']|^\s+|\s+$/g, '').split(/[\s,]+/).join('","') + '"]';
    }
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i += 1) {
            value[i] = String(value[i]).replace(/["']|^\s+|\s+$/g, '');
        }
        return '["' + value.join('","') + '"]';
    }
    throw new TypeError('Unable to cast ' + value + ' [' + typeof value + '] to road use string');
}

export function arrayOf(options) {
    return (values) => {
        values.forEach((value) => {
            for (const key in value) {
                if (Object.prototype.hasOwnProperty.call(value, key) &&
                        Object.prototype.hasOwnProperty.call(options, key) &&
                        Array.isArray(options[key].converters)) {
                    options[key].converters.forEach((converter) => {
                        if (isFunction(converter)) {
                            value[key] = converter(value[key]);
                        }
                    });
                }
            }
        });
        return values;
    };
}

export function objectOf(options) {
    return (value) => {
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key) &&
                    Object.prototype.hasOwnProperty.call(options, key) &&
                    isFunction(options[key].converter)) {

                value[key] = options[key].converter(value[key]);
            }
        }
        return value;
    };
}

export function arrayOfStrings(value) {
    if (!value) {
        return [];
    }
    if (isString(value)) {
        value = value.trim().replace(/\s*[,;]\s*/g, ',');
        return value.split(/[,;]+/);
    }
    if (Array.isArray(value)) {
        return value;
    }
    throw new TypeError('Unable to cast ' + value + ' [' + typeof value + '] to array of strings');
}

export function route(values) {
    return {
        points: values.map(castPoint).map(([lat, lon]) => ({ lat, lon }))
    };
}

export function integer(value) {
    return Math.round(Number(value));
}

export function supportingPoints(value) {
    const arrayOfPoints = [];
    if (isString(value)) {
        value = value.split(':');
    }
    if (Array.isArray(value)) {

        // Convert elements to points
        for (let i = 0; i < value.length; i++) {
            arrayOfPoints.push(castAndNormalizePoint(value[i]));
        }
    } else {
        arrayOfPoints.push(castAndNormalizePoint(value));
    }
    return prepareSupportingPoints(arrayOfPoints);
}

export function constantSpeedConsumption(value) {
    if (isString(value)) {
        return value;
    }

    if (!Array.isArray(value)) {
        throw new TypeError('An array is required');
    }
    return value.join(':');
}

export function avoidAreas(value) {
    if (!Array.isArray(value)) {
        throw new TypeError('An array is required');
    }
    return {
        rectangles: value.map((area) => {
            return {
                southWestCorner: convertPointToLatitudeLongitude(castAndNormalizePoint(area.southWestCorner)),
                northEastCorner: convertPointToLatitudeLongitude(castAndNormalizePoint(area.northEastCorner))
            };
        })
    };
}

export function commaSeparated(value) {
    if (Array.isArray(value)) {
        return value.join();
    } else {
        throw new TypeError('An array is required');
    }
}

export function array(value) {
    return castArray(value);
}

export function removeWhitespaces(value) {
    if (typeof value === 'string') {
        return value.replace(/\s/g, '');
    } else {
        throw new TypeError('A string is required');
    }
}

