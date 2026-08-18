import styleRetriever from './styleRetriever';
import {
    mapLanguage as convertMapLanguage,
    geopoliticalView as convertGeopoliticalView
} from 'Services/services/converters';
import stylesVisibilityManipulator from '../style/stylesVisibilityManipulator';

/**
 * @class Map
 * @namespace Maps
 */

class ExtendedMap {
    constructor(options = {}) {
        this.options = options;
        this._styleRetriever = styleRetriever(options.key);
        this._language = options.language;
        this._geopoliticalView = options.geopoliticalView;
    }

    _repaintMap = () => {
        const sourceName = 'vectorTiles';
        const vectorTilesSourceCache = this.__om.style.sourceCaches[sourceName];

        if (vectorTilesSourceCache) {
            vectorTilesSourceCache.clearTiles();
            this.__om.getSource(sourceName).load();
        }
    };

    _initializeStyle = async (styleInput) => {
        const style = await this._styleRetriever.fetch(styleInput);

        stylesVisibilityManipulator.setInitialLayersVisibility(style, this.options._stylesVisibility);

        this._translateStyleTextFields(style, this._language);

        if (this.options.sprite) {
            style.sprite = this.options.sprite;
        }
        if (this.options.glyphs) {
            style.glyphs = this.options.glyphs;
        }
        const promise = new Promise((resolve) => {
            this.__om.once('style.load', () => {
                resolve();
            });
        });

        this.__om.setStyle(style, {diff: false});
        return promise;
    };

    /**
     * @private
     * @description Attempts to get translated version of text field value.
     * The way it works is that every occurrence of ["get", "name"] within text-field value
     * is replaced with ["coalesce",["get", "name_LANG"],["get", "name"]],
     * where LANG is specified by the user. If no name_LANG property is found, "name" is used instead.
     *
     * This function also supports legacy syntax, where text-field value is a string with "{name}".
     *
     * @param {any} textFieldValue Value of 'text-field' property
     * @param {String} language New language code.
     * @param {String} currentLanguage Currently set language code.
     * This is used to match and replace already translated fields.
     * @param {Object} options Options object
     * @returns {String|undefined} Stringified expression or undefined.
     */
    _getTranslatedTextField = (textFieldValue, language, currentLanguage) => {
        // text field must refer to property with this name to be translated.
        // in V2 styles it is "name".
        const fieldName = 'name';
        const optionsOverride = {
            fieldName,
            fieldPattern: new RegExp(`${fieldName}_${currentLanguage}`, 'g'),
            legacyFieldPattern: new RegExp(`\\{${fieldName}\\}`, 'g'),
            searchPattern: new RegExp(`\\["get", *"${fieldName}"\\]`, 'g')
        };

        let stringifiedTranslatedTextField;
        // Only try to translate label if its an expression.
        // This means labels defined with legacy syntax like '{name}', won't be translated.
        if (Array.isArray(textFieldValue)) {
            const stringifiedTextField = JSON.stringify(textFieldValue);

            if (stringifiedTextField.match(optionsOverride.fieldPattern)) {
                stringifiedTranslatedTextField = stringifiedTextField.replaceAll(
                    optionsOverride.fieldPattern,
                    `${optionsOverride.fieldName}_${language}`
                );
            } else {
                try {
                    stringifiedTranslatedTextField = stringifiedTextField.replaceAll(
                        optionsOverride.searchPattern,
                        JSON.stringify(
                            ['coalesce', [
                                'get', `${optionsOverride.fieldName}_${language}`
                            ], [
                                'get', optionsOverride.fieldName
                            ]]
                        )
                    );
                } catch (e) {
                    return undefined;
                }
            }

            try {
                return JSON.parse(stringifiedTranslatedTextField);
            } catch (e) {
                return undefined;
            }
        } else if (typeof textFieldValue === 'string' && textFieldValue.match(optionsOverride.legacyFieldPattern)) {
            try {
                const stringifiedTranslatedTextField = textFieldValue.replaceAll(
                    optionsOverride.legacyFieldPattern,
                    JSON.stringify(
                        ['coalesce', [
                            'get', `${optionsOverride.fieldName}_${language}`
                        ], [
                            'get', optionsOverride.fieldName
                        ]]
                    )
                );

                return JSON.parse(stringifiedTranslatedTextField);
            } catch (e) {
                return undefined;
            }
        }

        return undefined;
    }

    _translateStyleTextFields = (style, language) => {
        for (const layerName in style.layers) {
            const layer = style.layers[layerName];
            if (layer.source === 'vectorTiles' && layer.type === 'symbol') {
                const textFieldValue = layer.layout?.['text-field'];

                const translatedTextField = this._getTranslatedTextField(
                    textFieldValue,
                    language,
                    this._language,
                );

                if (translatedTextField) {
                    layer.layout['text-field'] = translatedTextField;
                }
            }
        }
    }

    /**
     * This method sets a language for a map. This setting will affect only map tiles and not other
     * services, e.g., search. Providing an empty string ('') as an input value will unset this option. Supported
     * languages can be obtained from the list of:
     * <a href="https://developer.tomtom.com/maps-api/maps-api-documentation-vector/tile#listOfSupportedLanguages">
     *     Supported Languages</a> page.
     *
     * @method setLanguage
     * @param {String} language
     */
    setLanguage = (language) => {
        language = convertMapLanguage(language);
        for (const layerName in this.__om.style._layers) {
            const layer = this.__om.style._layers[layerName];
            if (layer.source === 'vectorTiles' && layer.type === 'symbol') {
                const textFieldValue = this.getLayoutProperty(layerName, 'text-field');

                const translatedTextField = this._getTranslatedTextField(
                    textFieldValue,
                    language,
                    this._language,
                );

                if (translatedTextField) {
                    this.setLayoutProperty(
                        layerName,
                        'text-field',
                        translatedTextField
                    );
                }
            }
        }
        this._language = language;
        this._repaintMap();
    };

    /**
     * This method returns a language set.
     *
     * @method getLanguage
     * @return {String}
     */
    getLanguage = () => {
        return this._language;
    };

    /**
     * This method sets a geopolitical view for a map. This setting will only affect map tiles and not
     * other services, e.g., search. Providing an empty string ('') as an input value will unset this option. Supported
     * geopolitical views can be obtained from
     * <a href="https://developer.tomtom.com/maps-api/maps-api-documentation-vector/tile#request-data">
     *     here</a>.
     *
     * @method setGeopoliticalView
     * @param {String} geopoliticalView
     */
    setGeopoliticalView = (geopoliticalView) => {
        geopoliticalView = convertGeopoliticalView(geopoliticalView);
        this._geopoliticalView = geopoliticalView;
        this._repaintMap();
    };

    /**
     * This method returns a geopolitical view set.
     *
     * @method getGeopoliticalView
     * @return {String}
     */
    getGeopoliticalView = () => {
        return this._geopoliticalView;
    };

    /**
     * Returns a TomTomAttributionControl instance.
     *
     * @method getAttributionControl
     * @return {Maps.TomTomAttributionControl}
     */
    getAttributionControl = () => {
        return this.__om._attributionControl || this._attributionControl;
    }
    /**
     * Displays traffic flow on the map. To see how to set a traffic
     * style different to the default one, please have a look at the `options.style`
     * parameter description.</br></br>
     * <b>Note:</b> For custom traffic styles, this method will work only if sources conform
     * to given `sourceName` (`showTrafficFlow()` will only work if `sourceName` property
     * for trafficFlow will be `vectorTilesFlow`).
     *
     * @method showTrafficFlow
     */
    showTrafficFlow = () => {
        stylesVisibilityManipulator.show(this, 'trafficFlow');
    }
    /**
     * Hides a traffic flow layer on the map.</br></br>
     * <b>Note:</b> For custom traffic styles, this method will work only if sources conform
     * to given `sourceName` (`hideTrafficFlow()` will only work if `sourceName` for trafficFlow
     * will be `vectorTilesFlow`).
     * @method hideTrafficFlow
     */
    hideTrafficFlow = () => {
        stylesVisibilityManipulator.hide(this, 'trafficFlow');
    }
    /**
     * Displays a traffic incidents layer on the map. To see how to set a traffic
     * style different to the default one, please have a look at the `options.style`
     * parameter description.</br></br>
     * <b>Note:</b> For custom traffic styles, this method will work only if sources conform
     * to given `sourceName` (`showTrafficIncidents()` will only work if `sourceName` property
     * for trafficIncidents will be `vectorTilesIncidents`).
     * @method showTrafficIncidents
     */
    showTrafficIncidents = () => {
        stylesVisibilityManipulator.show(this, 'trafficIncidents');
    }
    /**
     * Hides traffic incidents layer on the map.</br></br>
     * <b>Note:</b> For custom traffic styles, this method will work only if sources conform
     * to given `sourceName` (`hideTrafficIncidents()` will only work if `sourceName` property
     * for trafficIncidents will be `vectorTilesIncidents`).
     * @method hideTrafficIncidents
     */
    hideTrafficIncidents = () => {
        stylesVisibilityManipulator.hide(this, 'trafficIncidents');
    }
    /**
     * Displays the POI layer on the map.
     * <b>Note:</b> For custom POI styles, this method will work only if sources conform
     * to given `sourceName` (`showPOI()` will only work if `sourceName` property
     * for trafficFlow will be `poiTiles`).
     *
     * @method showPOI
     */
    showPOI = () => {
        stylesVisibilityManipulator.show(this, 'poi');
    }
    /**
     * Hides the POI layer on the map.</br></br>
     * <b>Note:</b> For custom traffic styles, this method will work only if sources conform
     * to given `sourceName` (`hidePOI()` will only work if `sourceName` for trafficFlow
     * will be `poiTiles`).
     * @method hidePOI
     */
    hidePOI = () => {
        stylesVisibilityManipulator.hide(this, 'poi');
    }
}

export default (options) => {
    return new ExtendedMap(options);
};
