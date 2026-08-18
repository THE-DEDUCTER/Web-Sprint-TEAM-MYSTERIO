import 'core-js';
import 'regenerator-runtime/runtime';

import mapboxGl from 'mapbox-gl';

import MapConfigurer from './configurer/mapConfigurer';
import mainConfig from 'mainConfig';
import additionalCoreMethods from './additionalCoreMethods/additionalCoreMethods';
import { setProductInfo } from '../services/requester/analytics';

/**
 * This library provides you with the tools to embed Tomtom Maps in your webpage in a quick and effortless way.
 *
 *
 * We provide two different bundles of the library:
 *
 * - __maps-web.min.js__ - Use this file if you want to include the library directly on a web page,
 * it can be imported in the `<head>` of your HTML document.
 * The `tt` global object will be created and attached to the `window`. <br/> Please refer to the
 * <a  target="_blank" rel=”noopener”
 * href="https://developer.tomtom.com/maps-sdk-web-js/tutorials-basic/display-vector-map">
 * Display vector map tutorial</a> for detailed instructions.
 * - __maps.min.js__ - Use this file if you are using a module bundler (e.g., Webpack). It conforms to the
 * <a target="_blank" rel=”noopener” href="https://github.com/umdjs/umd">UMD standard</a>.
 * In case you installed library with npm, all you need is: <br/>`import tt from '@tomtom-international/web-sdk-maps'`
 *
 * The library uses following hosted styles version: ${hostedStyles.version}<br/>
 * For more information on styles, please refer to
 * <a target="_blank" rel=”noopener”
 *  href="https://developer.tomtom.com/maps-api/maps-api-documentation/map-style-specification">
 *  Map style specification</a>.
 *
 * #### CSS stylesheet
 * __maps.css__ - CSS declarations for Maps library. It can be imported in the `<head>` of your HTML document.
 * Without the CSS, dependant elements might appear in wrong place.
 * <div class="alert alert-info margin-top-16">
 * If you are looking for a convenient JavaScript library to use TomTom services, go to the
 * {{#crossLinkModule "Services"}}Services library documentation{{/crossLinkModule}}.
 * </div>
 * @module Maps
 * @main Maps
 */

/**
 * This object aggregates all necessary modules and classes to work with maps.
 *
 * Please refer to the following documentation to check what properties and methods are
 * included in the tt object.
 *
 * @class tt
 * @namespace Maps
 */

const exposedMethods = {
    __core: mapboxGl,
    map: (options) =>
        new MapConfigurer(options, {
            mapbox: mapboxGl
        }).createMap(),
    sdkInfo: {
        version: mainConfig['sdk.version']
    },
    setProductInfo
};

export default {
    ...exposedMethods,
    ...additionalCoreMethods()
};

/**
 * @property map
 * @type Maps.Map
 * @description Instance of a map.
 */

/**
 * @property sdkInfo
 * @type function
 * @description Returns SDK details. (e.g., version)
 * @return {Object}
 */

/**
 * @method setProductInfo
 * @type function
 * @description This method sets the content of the TomTom-User-Agent header. We are collecting anonymous data for
 * statistics of usage of our services in order to increase the quality of our products.
 * @param {String} productId Identifier (e.g., a name) of your application e.g.,&nbsp;MyApplication
 * @param {String} productVersion Version of your application e.g.,&nbsp;1.0.2
 * @example
 * ```javascript
 * tt.setProductInfo('your-product-id', 'your-product-version');
 * ```
 */
