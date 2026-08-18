import {isNil, isObject, isBoolean} from 'lodash';
import transformRequestFactory from './transformRequestFactory';
import {mapLanguage as convertMapLanguage} from 'Services/services/converters';
import {oneOfValue as validateOneOfValue} from 'Services/services/validators';
import styleResolver from './styleResolver';

function initializeStyleOption() {
    return {
        version: 8,
        sources: {},
        layers: []
    };
}

function initializeStylesVisibilityOption(stylesVisibility) {
    const defaultStylesVisibility = {
        map: true,
        poi: true,
        trafficFlow: false,
        trafficIncidents: false
    };

    if (isObject(stylesVisibility)) {
        for (const style in stylesVisibility) {
            if (!style.match(/map|trafficFlow|trafficIncidents|poi/)) {
                throw new Error('Allowed properties of "stylesVisibility" are "map",' +
                ' "trafficFlow", "trafficIncidents", "poi".');
            }

            if (!isBoolean(stylesVisibility[style])) {
                throw new Error(`"stylesVisibility.${style}" must be boolean.`);
            }
        }

        return {
            ...defaultStylesVisibility,
            ...stylesVisibility
        };
    } else {
        return defaultStylesVisibility;
    }
}

function convertAndValidateLanguage(languageOption) {
    return convertMapLanguage(languageOption);
}

const geopoliticalViewValidator = validateOneOfValue(
    ['Unified', 'IL', 'IN', 'MA', 'PK', 'AR', 'Arabic', 'RU', 'TR', 'CN'],
    'geopoliticalView');

function convertAndValidateGeopoliticalView(geopoliticalViewOption) {
    if (isNil(geopoliticalViewOption) || geopoliticalViewOption === '') {
        return geopoliticalViewOption;
    }

    geopoliticalViewValidator(geopoliticalViewOption);
    return geopoliticalViewOption;
}

export default function initializeMapOptions(inputOptions) {
    const options = { ...inputOptions };

    if (isNil(options.container)) {
        throw new Error('"container" option is required.');
    }

    if (isNil(options.key)) {
        throw new Error('"key" option is required.');
    }

    options._stylesVisibility = initializeStylesVisibilityOption(options.stylesVisibility);
    options._deferredStyle = styleResolver(options.style);
    options.style = initializeStyleOption();
    options.attributionControl = false;
    options.language = convertAndValidateLanguage(options.language);
    options.geopoliticalView = convertAndValidateGeopoliticalView(options.geopoliticalView);
    options.transformRequest = transformRequestFactory(
        () => this._extendedMap && this._extendedMap.getLanguage() || options.language,
        () => this._extendedMap && this._extendedMap.getGeopoliticalView() || options.geopoliticalView,
        inputOptions.transformRequest
    );

    return options;
}
