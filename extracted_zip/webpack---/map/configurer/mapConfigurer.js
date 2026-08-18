/**
 * Map Wrapper
 *
 * The Map Wrapper module is mainly responsible for rendering a map.
 * This module contains the following features:
 *
 * * Load styles:
 *   Will load the styles passed in the options.theme when rendering the map.
 *   If there are traffic flow options, the styles loader module will also load them, displaying both on the map.
 *
 * * Copyrights:
 *   We make use of the TomTomAttributionControl module to request the copyrights by using our services.
 *   We then display them on the map.
 *
 * * Request URL and Analytics:
 *   In order to use the TomTom URL and the necessary headers to request the map tiles, we transform the request
 *   (transformRequestFactory) to obtain the correct URL and set the headers with the cors headers used in tomtom.
 *
 */
import mapboxGlRTLText from 'raw-loader!mapbox-gl-rtl-text';
import initializeMapOptions from './initializeMapOptions';
import initializeCopyrights from './initializeCopyrights';
import {mapboxMapFactory, appendMapboxProperties} from '../map/mapFactory';
import extendedMapFactory from '../map/extendedMap';
import CUSTOM_EVENTS from '../utils/events/customEvents';

function initializeRTLTextPlugin(mapbox) {
    const blob = new Blob([mapboxGlRTLText], {type: 'text/javascript'});

    // a similar check is done internally when setting the plugin
    // but it's not exposed outside the method
    // eslint-disable-next-line
    // https://github.com/mapbox/mapbox-gl-js/blob/e0c4d4679d06be7c0f51970b26a184f8d9ed6d5b/src/source/rtl_text_plugin.js
    if (mapbox.RTLTextPluginRequested === true) {
        return;
    }
    mapbox.RTLTextPluginRequested = true;

    mapbox
        .setRTLTextPlugin(URL.createObjectURL(blob),
            (error) => {
                if (error) {
                    throw Error(error);
                }
            });
}

/**
 * @private
 * @class MapConfigurer
 * @constructor
 * @param {Object} options
 * @param {Object} dependencies
 * @param {CoreMap} dependencies.coreMap
 */
export default class MapConfigurer {
    constructor(options, { mapbox }) {
        this.mapbox = mapbox;
        this.options = initializeMapOptions.call(this, {...options});
    }

    /**
     * @method createMap
     * @return {Map} Instance of the map
     */
    createMap = () => {
        const map = mapboxMapFactory({...this.options});

        const extendedMap = extendedMapFactory(this.options);
        appendMapboxProperties(extendedMap, map);

        initializeCopyrights(this.options.key, this.options.attributionControlPosition, extendedMap);
        initializeRTLTextPlugin(this.mapbox);

        extendedMap._initializeStyle(this.options._deferredStyle).then(() => {
            extendedMap.__om.fire(CUSTOM_EVENTS.MAP_LOAD);
        });

        this._extendedMap = extendedMap;

        return extendedMap;
    }
}
