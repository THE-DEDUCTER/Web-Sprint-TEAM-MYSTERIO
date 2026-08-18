/**
 * @class tt
 */

import mapboxGl from 'mapbox-gl';
import { Marker } from './marker/Marker';
import { NavigationControl } from './NavigationControl';

const additionalMethodsList = [
    /**
     * @property Popup
     * @type Maps.Popup
     * @description Use this class to create a new popup component.
     */
    'Popup',

    /**
     * @property FullscreenControl
     * @type Maps.FullscreenControl
     * @description Use this class to create a new full screen control.
     */
    'FullscreenControl',

    /**
     * @property ScaleControl
     * @type Maps.ScaleControl
     * @description Use this class to create a new ScaleControl.
     */
    'ScaleControl',

    /**
     * @property GeolocateControl
     * @type Maps.GeolocateControl
     * @description Use this class to create a new GeolocateControl.
     */
    'GeolocateControl',

    /**
     * @property LngLat
     * @type Maps.LngLat
     * @description Use this class to create a new LngLat.
     */
    'LngLat',

    /**
     * @property LngLatBounds
     * @type Maps.LngLatBounds
     * @description Use this class to create a new LngLatBounds.
     */
    'LngLatBounds',

    /**
     * @property Point
     * @type Maps.Point
     * @description Use this class to create a new Point.
     */
    'Point',

    /**
     * @property MercatorCoordinate
     * @type Maps.MercatorCoordinate
     * @description Use this class to create a new MercatorCoordinate.
     */
    'MercatorCoordinate',

    /**
     * @property Evented
     * @type Maps.Evented
     * @description Use this class to create a new Evented.
     */
    'Evented',

    /**
     * @method supported
     * @type function
     * @param {Object} [options] Object with options
     * @param {Boolean} [options.failIfMajorPerformanceCaveat] If true, the function will return false if
     * the performance of maps would be dramatically worse than expected (e.g. a software
     * WebGL renderer would be used).
     * @description This method allows you to check if the user's browser is supported.
     * @returns {Boolean}
     * @example
     * ```javascript
     * tt.supported() // = true
     * ```
     */
    'supported',

    /**
     * @method prewarm
     * @type function
     * @description Initializes resources like WebWorkers that can be shared across maps to lower load times in
     * some situations. `tt.workerCount`, if being used, must be set before `tt.prewarm()` is called to have an
     * effect. By default, the lifecycle of these resources is managed automatically, and they are lazily initialized
     * when a Map is first created. By invoking `tt.prewarm()`, these resources will be created ahead of time, and will
     * not be cleared when the last Map is removed from the page. This allows them to be re-used by new Map instances
     * that are created later. They can be manually cleared by calling `tt.clearPrewarmedResources()`.
     * This is only necessary if your web page remains active but stops using maps altogether.
     */
    'prewarm',

    /**
     * @method clearPrewarmedResources
     * @type function
     * @description Clears up resources that have previously been created by `tt.prewarm()`. Note that this is
     * typically not necessary. You should only call this function if you expect the user of your app to not
     * return to a Map view at any point in your application.
     */
    'clearPrewarmedResources',

    /**
     * @property workerCount
     * @type {Number}
     * @description Gets and sets the number of web workers instantiated on a page with Web SDK maps. By default,
     * it is set to half the number of CPU cores (capped at 6). Make sure to set this property before creating
     * any map instances for it to have effect.
     */
    'workerCount'
];

function fixMapReference(methodName, mapboxMethod) {
    function replaceMapPointer() {
        const exposedMethodProto = mapboxMethod.prototype;
        const originalFunction = exposedMethodProto.addTo;

        exposedMethodProto.addTo = function(map) {
            // The original function needs to be called with a mapbox map instance as they require internal properties
            // provided by mapbox.
            // map.__om is the mapbox instance provided as a private field in our public map interface. When our public
            // map interface is used we need to make sure that we pass the correct mapbox map instance to this method.
            // If the addTo method is invoked by other mapbox methods we assume that it will receive the correct
            // mapbox map instance.
            return originalFunction.call(this, map.__om ? map.__om : map);
        };
    }

    switch (methodName) {
    case 'Popup':
    case 'Marker':
    case 'NavigationControl':
        replaceMapPointer();
        break;
    default:
        break;
    }

    return mapboxMethod;
}

/**
 * This function appends mapbox methods modified by us
 * @param {Object} exposedMethods
 */
function appendModifiedMethods(exposedMethods) {
    /**
     * @property Marker
     * @type Maps.Marker
     * @description Use this class to create a new marker component.
     */
    exposedMethods.Marker = fixMapReference('Marker', Marker);

    /**
     * @property NavigationControl
     * @type Maps.NavigationControl
     * @description Use this class to create a new NavigationControl.
     */
    exposedMethods.NavigationControl = fixMapReference('NavigationControl', NavigationControl);
}

function additionalMethodsObj() {
    const exposedMethods = {};

    additionalMethodsList.forEach((method) => {
        const mapboxMethod = mapboxGl[method];
        exposedMethods[method] = fixMapReference(method, mapboxMethod);
    });

    appendModifiedMethods(exposedMethods);

    return exposedMethods;
}

export default additionalMethodsObj;
