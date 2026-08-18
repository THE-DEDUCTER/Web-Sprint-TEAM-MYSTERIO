/* eslint-disable max-len */

import mapboxMapClassGetter from './mapboxMapClassGetter';
import { userInteractionHandlers } from './userInteractionHandlers/userInteractionHandlers';
import { overriddenMethods } from './mapboxOverriddenMethods/overriddenMethods';

/**
 * @class Map
 * @namespace Maps
 */

/**
 *
 * @class Map
 * @extends Maps.Evented
 * @description The Map object represents the map on your page.
 * It exposes methods and properties that enable you to programmatically change the map
 * and fires events as users interact with it.
 * You create a Map by specifying a container and other options.
 * @example
 * ```javascript
 * tt.map(options)
 * ```
 * @constructor
 * @param {Object} options Object with options.
 * @param {String} options.key Maps key.
 * @param {HTMLElement|String} options.container The HTML element representig map container or id of that element.
 * @param {String} [options.language] Map language.
 * @param {String} [options.geopoliticalView] Map geopolitical view.
 * @param {Object|String} [options.style] The map style.
 * </br></br>
 * Default value: <a>https://api.tomtom.com/style/1/style/${hostedStyles.version}?
 * map=basic_main&traffic_incidents=incidents_day</br>
 * &traffic_flow=flow_relative0&poi=poi_main</a>
 * </br></br>
 * It can be one of following types:
 * * URL to the JSON object conforming to the schema described in the
 * <a href="https://developer.tomtom.com/maps-api/maps-api-documentation/map-style-specification">
 * Map Style Specification</a>. Provided URL should follow this pattern:
 * `https://api.tomtom.com/style/1/style/<STYLES_VERSION>&map=<MAP_STYLE>&traffic_incidents=<INCIDENTS_STYLE>&traffic_flow=<FLOW_STYLE>&poi=<POI_STYLE>`</br>
 *
 * where:
 *      * `STYLES_VERSION` - version number of the
 *       <a href="https://developer.tomtom.com/maps-api/maps-api-documentation/map-styles-v2">Map Styles</a>
 *      * `MAP_STYLE` - name of the
 *       <a href="https://developer.tomtom.com/map-display-api/documentation/mapstyles/map-styles-v2#available-map-styles">
 *          Map Style</a>
 *      * `INCIDENTS_STYLE` - name of the
 *       <a href="https://developer.tomtom.com/map-display-api/documentation/mapstyles/map-styles-v2#available-incidents-styles">
 *          Traffic Incidents Style</a>
 *      * `FLOW_STYLE` - name of the
 *       <a href="https://developer.tomtom.com/map-display-api/documentation/mapstyles/map-styles-v2#available-flow-styles">
 *          Traffic Flow Style</a>
 *      * `POI_STYLE` - name of the
 *       <a href="https://developer.tomtom.com/map-display-api/documentation/mapstyles/map-styles-v2#available-poi-styles">
 *          POI Style</a>
 * * JSON object conforming to the mentioned specification.
 * * Configuration object e.g.: </br></br>
 *  style: {</br></br>
 *    &nbsp;&nbsp;&nbsp;&nbsp;    map: '2/basic_street-light',</br></br>
 *    &nbsp;&nbsp;&nbsp;&nbsp;    poi: '2/poi_light',</br></br>
 *    &nbsp;&nbsp;&nbsp;&nbsp;    trafficIncidents: '2/incidents_light',</br></br>
 *    &nbsp;&nbsp;&nbsp;&nbsp;    trafficFlow: '2/flow_relative-light'</br></br>
 *  }</br></br>
 *
 *
 * List of styles supported provided by TomTom can be found in
 *  <a href="https://developer.tomtom.com/map-display-api/documentation/mapstyles/map-styles-v2">Map styles service</a>.
 * </br></br>
 * Please notice that visibility of certain layers of the style is altered by
 * {{#crossLink "Maps.Map/stylesVisibility:parameter"}}options.stylesVisibility{{/crossLink}}</br></br>
 * <b>Note:</b> methods responsible for showing/hiding traffic flow and traffic incidents will work only if sources conform
 * given `sourceName` (e.g. `showTrafficFlow()` will only work if `sourceName` for trafficFlow is `vectorTilesFlow` and
 * `hideTrafficIncidents()` will only work if `sourceName` for trafficIncidents is `vectorTilesIncidents`).<br/>
 * To change the parameters of incidents and traffic tiles {{#crossLink "Maps.Map/transformRequest:method"}}options.transformRequest{{/crossLink}}
 * can be used.
 * @param {Object} [options.stylesVisibility] The dictionary of options representing visibility of style parts.
 *
 *
 * Determining which layers belongs to which style is based on the layer `source` name.
 * We use following style name to source name mapping:
 *  * `map`: `'vectorTiles'`,
 *  * `trafficFlow`: `'vectorTilesFlow'`,
 *  * `trafficIncidents`: `'vectorTilesIncidents'`
 *  * `poi`: `'poiTiles'`
 *
 *
 * Styles downloaded from
 * <a href="https://developer.tomtom.com/maps-api/maps-api-documentation/map-styles">Map styles service</a>
 * follow this naming convention.
 * By default layers belonging to "trafficFlow" and trafficIncidents" styles are hidden.
 * </br></br>
 * In case you provide your custom style, be aware that if the style does not have layers with sources named as
 * in the mentioned mapping, this option will have no effect on visibility of layers.
 * @param {Boolean} [options.stylesVisibility.map=true] The visibility of base map layers.
 * @param {Boolean} [options.stylesVisibility.poi=true] The visibility of POI layers.
 * @param {Boolean} [options.stylesVisibility.trafficFlow=false] The visibility of traffic flow layers.
 * @param {Boolean} [options.stylesVisibility.trafficIncidents=false] The visibility of traffic incidents layers.
 * @param {Number} [options.minZoom] The minimum zoom level of the map (0-24).
 * @param {Number} [options.maxZoom] The maximum zoom level of the map (0-24).
 * @param {Number} [options.minPitch=0] The minimum pitch of the map (0-60).
 * @param {Number} [options.maxPitch=60] The maximum pitch of the map (0-60).
 * @param {Boolean|String} [options.hash=false] If  true, the map's position (zoom, center latitude, center
 * longitude, bearing, and pitch) will be synced with the hash fragment of the page's URL.
 * For example, http://path/to/my/page.html#2.59/39.26/53.07/-24.1/60 . An additional string may optionally
 * be provided to indicate a parameter styled hash, e.g. if `hash: 'map'` will be provided:
 * http://path/to/my/page.html#map=2.59/39.26/53.07/-24.1/60 .
 * @param {Boolean} [options.interactive=true] If  false, no mouse, touch,
 *  or keyboard listeners will be attached to the map, so it will not respond to interaction.
 * @param {Number} [options.bearingSnap=7] The threshold, measured in degrees, that determines
 * when the map's bearing will snap to north. For example, with a  bearingSnap of 7,
 * if the user rotates the map within 7 degrees of north, the map will automatically snap to exact north.
 * @param {Boolean} [options.pitchWithRotate=true] If  false, the map's pitch (tilt) control with
 * "drag to rotate" interaction will be disabled.
 * @param {Number} [options.clickTolerance=3] The max number of pixels a user can shift the mouse pointer
 * during a click for it to be considered a valid click (as opposed to a mouse drag).
 * @param {Boolean} [options.failIfMajorPerformanceCaveat=false] If true, map creation will fail if
 * the performance of Map would be dramatically worse than expected (i.e., a software renderer would be used).
 * @param {Boolean} [options.preserveDrawingBuffer=false] If true, the map's canvas can be exported to a PNG
 * using tt.map.getCanvas().toDataURL(). This is false by default as a performance optimization.
 * @param {Boolean} [options.refreshExpiredTiles=true] If false, the map won't attempt to re-request tiles
 * once they expire per their HTTP cacheControl / expires headers.
 * @param {Maps.LngLatBounds} [options.maxBounds] If set, the map will be constrained to the given bounds.
 * @param {Boolean|Object} [options.scrollZoom=true] If true, the "scroll to zoom" interaction is enabled.
 * An `Object` value is passed as options to {{#crossLink "Maps.ScrollZoomHandler/enable:method"}}ScrollZoomHandler{{/crossLink}}'s
 * `enable` method.
 * ```javascript
 * scrollZoom: {
 *     around: 'center'
 * }
 * ```
 * @param {Boolean} [options.boxZoom=true] If true, the "box zoom" interaction is enabled (see {{#crossLink "Maps.BoxZoomHandler"}}
 * BoxZoomHandler{{/crossLink}}).
 * @param {Boolean} [options.dragRotate=true] If true, the "drag to rotate" interaction is enabled (see {{#crossLink
 * "Maps.DragRotateHandler"}}DragRotateHandler{{/crossLink}}).
 * @param {Boolean|Object} [options.dragPan=true] If true, the "drag to pan" interaction is enabled.
 * An `Object` value is passed as options to {{#crossLink "Maps.DragPanHandler/enable:method"}}DragPanHandler{{/crossLink}}'s
 * `enable` method.
 * ```javascript
 * dragPan: {
 *     linearity: 0.3,
 *     easing: bezier(0,0,0.3,1),
 *     maxSpeed: 1400,
 *     deceleration: 2500
 * }
 * ```
 * @param {Boolean} [options.keyboard=true] If true, keyboard shortcuts are enabled (see {{#crossLink
 * "Maps.KeyboardHandler"}}KeyboardHandler{{/crossLink}}).
 * @param {Boolean} [options.doubleClickZoom=true] If true, the "double click to zoom" interaction is enabled (see {{#crossLink
 * "Maps.DoubleClickZoomHandler"}}DoubleClickZoomHandler{{/crossLink}}).
 * @param {Boolean|Object} [options.touchZoomRotate=true] If true, the "pinch to rotate and zoom"
 * interaction is enabled. An `Object` value is passed as options to {{#crossLink "Maps.TouchZoomRotateHandler/enable:method"}}
 * TouchZoomRotateHandler{{/crossLink}}'s `enable` method.
 * ```javascript
 * touchZoomRotate: {
 *     around: 'center'
 * }
 * ```
 * @param {Boolean} [options.touchPitch=true] If `true`, the "drag to pitch" interaction is enabled (see {{#crossLink
 * "Maps.TouchPitchHandler"}}TouchPitchHandler{{/crossLink}}).
 * @param {Boolean|Object} [options.trackResize=true] If true, the map will automatically resize when
 * the browser window resizes.
 * @param {Maps.LngLat} [options.center] The inital geographical center point of the map.
 * If center is not specified in the constructor options, the Maps SDK will look for it in the map's style object.
 * If it is not specified in the style it will default to (0, 0).
 * Note: The Maps SDK uses longitude, latitude coordinate order (as opposed to latitude, longitude) to match GeoJSON.
 * @param {Number} [options.zoom=0] The initial zoom level of the map. If zoom is not specified in the constructor
 * options, the Maps SDK will look for it in the map's style object. If it is not specified in the style
 * it will default to 0.
 * @param {Number} [options.bearing=0] The initial bearing (rotation) of the map, measured in degrees counter-clockwise
 * from north. If bearing is not specified in the constructor options, the Maps SDK will look for it in
 * the map's style object. If it is not specified in the style it will default to 0.
 * @param {Number} [options.pitch=0] The initial pitch (tilt) of the map, measured in degrees away from
 * the plane of the screen (0-60). If pitch is not specified in the constructor options,
 * the Maps SDK will look for it in the map's style object. If it is not specified in the style,
 * it will default to 0.
 * @param {Maps.LngLatBounds} [options.bounds] The initial bounds of the map.
 * If bounds is specified, it overrides center and zoom constructor options.
 * @param {Object} [options.fitBoundsOptions] A fitBounds options object to use only when fitting the initial
 * bounds provided above.
 * @param {Boolean} [options.renderWorldCopies] If true, multiple copies of the world
 * will be rendered when zoomed out.
 * @param {Number} [options.maxTileCacheSize=null] The maximum number of tiles stored in
 * the tile cache for a given source. If omitted, the cache will be dynamically sized based on the current viewport.
 * @param {String} [options.localIdeographFontFamily=null] If specified, defines a CSS font-family for locally
 * overriding the generation of glyphs in the 'CJK Unified Ideographs' and 'Hangul Syllables' ranges.
 * In these ranges, font settings from the map's style will be ignored except for font-weight keywords
 * (light/regular/medium/bold). The purpose of this option is to avoid bandwidth-intensive glyph server requests.
 * @param {Boolean} [options.collectResourceTiming=false] If true, Resource Timing API information will be collected
 * for requests made by GeoJSON and Vector Tile Web Workers (this information is normally inaccessible from the main
 * JavaScript thread). Information will be returned in a resourceTiming property of relevant data events.
 * @param {Number} [options.fadeDuration=300] Controls the duration of the fade-in/fade-out animation for label
 * collisions in milliseconds. This setting affects all symbol layers. This setting does not affect the duration
 * of runtime styling transitions or raster tile cross-fading.
 * @param {Boolean} [options.crossSourceCollisions=true] Controls the duration of the fade-in/fade-out animation
 * for label.
 * @param {String} [options.attributionControlPosition='bottom-right'] Sets position of attribution control.
 * @param {Function} [options.transformRequest] A callback function that runs before the map makes a request for an
 * external URL. This callback can be used to modify the url, set headers or credentials. It takes `url` and
 * `resourceType` as input parameters. It's expected to return an object with properties like `url`, `headers`, `credentials`.<br/><br/>
 * This callback can be used to modify the requested parameters of the
 * <a href="https://developer.tomtom.com/traffic-api/traffic-api-documentation-traffic-flow/vector-flow-tiles">traffic</a>
 * and <a href="https://developer.tomtom.com/traffic-api/traffic-api-documentation-traffic-incidents/vector-incident-tiles">incident</a>
 * tiles.<br/>
 * This example shows how to add the `trafficLevelStep` parameter for the Vector Traffic Flow Tiles:
 *  ```javascript
 *  transformRequest: function(url, resourceType) {
 *      if (resourceType === 'Tile' && url.includes('flow')) {
 *          return { url: url + '&trafficLevelStep=0.2'};
 *      }
 *  }
 * ```
 * For usage please check the <a href="https://developer.tomtom.com/maps-sdk-web-js/functional-examples#examples,map,custom-incident-markers-and-popups.html">
 * Custom incident markers and popups</a> example.
 */

const providedMapboxMapMethods = [
    // movement
    /**
     * @method isMoving
     * @description Returns true if the map is panning, zooming, rotating,
     * or pitching due to a camera animation or user gesture.
     * @return {Boolean}
     */
    'isMoving',

    /**
     * @method isZooming
     * @description Returns true if the map is zooming due to a camera animation or user gesture.
     * @return {Boolean}
     */
    'isZooming',

    /**
     * @method isRotating
     * @description Returns true if the map is rotating due to a camera animation or user gesture.
     * @return {Boolean}
     */
    'isRotating',

    /**
     * @method getCenter
     * @description The map's geographical centerpoint.
     * @return {Maps.LngLat}
     */
    'getCenter',

    /**
     * @method setCenter
     * @description Sets the map's geographical centerpoint. Equivalent to `jumpTo({center: center})`.
     * @param {Maps.LngLat} lnglat The centerpoint to set.
     * @param {Object} [eventData] Additional properties to be added to event objects
     * of events triggered by this method.
     * @return {Maps.Map} Map instance
     */
    'setCenter',

    /**
     * @method panTo
     * @description Pans the map to the specified location with an animated transition.
     * @param {Maps.LngLat} lnglat The location to pan the map to.
     * @param {Object} [options] Animation options.
     * @param {Object} [eventData] Additional properties to be added to event objects
     * of events triggered by this method.
     * @return {Maps.Map} Map instance
     */
    'panTo',

    /**
     * @method getZoom
     * @description Returns the map's current zoom level.
     * @return {Number} The map's current zoom level.
     */
    'getZoom',

    /**
     * @method setZoom
     * @description Sets the map's zoom level. Equivalent to `jumpTo({zoom: zoom})`.
     * @param {Number} zoom The zoom level to set (0-20).
     * @param {Object} [eventData] Additional properties to be added to event objects of events
     * triggered by this method.
     * @return {Maps.Map} Map instance
     */
    'setZoom',

    /**
     * @method zoomTo
     * @description Zooms the map to the specified zoom level with an animated transition.
     * @param {Number} zoom The zoom level to transition to.
     * @param {Object} [options] Animation options.
     * @param {Object} [eventData] Additional properties to be added
     * to event objects of events triggered by this method.
     * @return {Maps.Map} Map instance
     */
    'zoomTo',

    /**
     * @method getBearing
     * @description Returns the map's current bearing.
     * The bearing is the compass direction that is "up"; for example,
     * a bearing of 90° orients the map so that east is up.
     * @return {Number} The map's current bearing.
     */
    'getBearing',

    /**
     * @method setBearing
     * @description Sets the map's bearing (rotation). The bearing is the compass direction that is "up";
     * for example, a bearing of 90° orients the map so that East is up.
     * Equivalent to `jumpTo({bearing: bearing})`.
     * @param {Number} bearing The desired bearing.
     * @param {Object} [eventData] Additional properties to be added to event objects
     * of events triggered by this method.
     * @return {Maps.Map} Map instance
     */
    'setBearing',

    /**
     * @method rotateTo
     * @description Rotates the map to the specified bearing with an animated transition.
     * The bearing is the compass direction that is "up"; for example,
     * a bearing of 90° orients the map so that East is up.
     * @param {Number} bearing The desired bearing.
     * @param {ICameraOptions} [options] Animation options.
     * @param {Number} [options.duration] The animation's duration measured in milliseconds.
     * @param {Function} [options.easing] A function taking a time in the range 0..1 and returning
     * a number where 0 is the initial state and 1 is the final state.
     * @param {Maps.Point} [options.offset] Offset of the target center relative to the real map container
     * center at the end of animation.
     * @param {Boolean} [options.animate] If `false`, no animation will occur.
     * @param {Object} [eventData] Additional properties to be added
     * to event objects of events triggered by this method.
     * @example
     * ```javascript
     * var bounds = [[-10, 52], [10, 55]];
     * tt.map.rotateTo(30, {
     *  duration: 5000,
     *  easing: function(t) { return t; }
     *  offset: [0, 50],
     *  animate: true
     * });
     * ```
     * @return {Maps.Map} Map instance
     */
    'rotateTo',

    /**
     * @method getPitch
     * @description Returns the map's current pitch (tilt).
     * @return {Number} The map's current pitch measured in degrees away from the plane of the screen.

     */
    'getPitch',

    /**
     * @method setPitch
     * @description Sets the map's pitch (tilt). Equivalent to `jumpTo({pitch: pitch})`.
     * @param {Number} pitch The pitch to set, measured in degrees away from the plane of the screen (0-60).
     * @param {Object} [eventData] Additional properties to be added
     * to event objects of events triggered by this method.
     * @return {Maps.Map} Map instance
     */
    'setPitch',

    /**
     * @method fitBounds
     * @description Pans and zooms the map to contain its visible area within the specified geographical bounds.
     * This function will also reset the map's bearing to 0 if the bearing is nonzero.
     * @param {Maps.LngLatBounds} bounds Center these bounds in the viewport and use the highest zoom level up to
     * and including {{#crossLink "Maps.Map/getMaxZoom:method"}}{{/crossLink}} that fits them in the viewport.
     * @param {Object} [options] Options supports all properties from
     *  {{#crossLink "IAnimationOptions"}}IAnimationOptions{{/crossLink}} and
     *  {{#crossLink "ICameraOptions"}}ICameraOptions{{/crossLink}} in addition to the fields below.
     * @param {Object} [options.padding] The amount of padding in pixels to add to the given bounds.
     * @param {Boolean} [options.linear] If  true, the map transitions using Map#easeTo.
     * If `false`, the map transitions using Map#flyTo.
     * See those functions and AnimationOptions for information about the options available.
     * @param {Function} [options.easing] An easing function for the animated transition.
     * @param {Maps.Point} [options.offset] The center of the given bounds relative to the map's center
     * measured in pixels.
     * @param {Number} [options.maxZoom] The maximum zoom level to allow when the map view transitions
     * to the specified bounds
     * and fields listed in the example.
     * @example
     * ```javascript
     * var bounds = [[-10, 52], [10, 55]];
     * tt.map.fitBounds(bounds, {
     *  padding: { top: 10, bottom:25, left: 15, right: 5 }
     *  maxZoom: 12
     * });
     * ```
     * @return {Maps.Map} Map instance
     */
    'fitBounds',

    /**
     * @method jumpTo
     * @description Changes any combination of center, zoom, bearing, and pitch, without an animated transition.
     * The map will retain its current values for any details not specified in `options`.
     * @param {Object} [options] Options supports all properties from
     *  {{#crossLink "ICameraOptions"}}ICameraOptions{{/crossLink}}.
     * @param {Object} [eventData] Additional properties to be added
     * to event objects of events triggered by this method.
     * @example

     * @return {Maps.Map} Map instance
     */
    'jumpTo',

    /**
     * @method easeTo
     * @description Changes any combination of center, zoom, bearing, and pitch,
     * with an animated transition between old and new values.
     * The map will retain its current values for any details not specified in `options`.
     * @param {ICameraOptions | IAnimationOptions} options Camera and animation options.
     * @param {Object} [eventData] Additional properties to be added
     * to event objects of events triggered by this method.
     * @return {Maps.Map} Map instance
     */
    'easeTo',

    /**
     * @method flyTo
     * @description Changes any combination of center, zoom, bearing, and pitch,
     * animating the transition along a curve that evokes flight. The animation seamlessly
     * incorporates zooming and panning to help users maintain their bearings even after traversing a great distance.
     * @param {Object} [options] Options supports all properties from
     *  {{#crossLink "IAnimationOptions"}}IAnimationOptions{{/crossLink}} and
     *  {{#crossLink "ICameraOptions"}}ICameraOptions{{/crossLink}} in addition to the fields below.
     * @param {Number} [options.curve=1.42] The zooming "curve" that will occur along the flight path.
     * A high value maximizes zooming for an exaggerated animation, while a low value minimizes zooming for an effect
     * closer to Map#easeTo. 1.42 is the average value selected by participants in the user study
     * discussed in van Wijk (2003). A value of Math.pow(6, 0.25) would be equivalent to the root mean squared average
     * velocity. A value of 1 would produce a circular motion.
     * @param {Number} [options.minZoom] The zero-based zoom level at the peak of the flight path. If options.curve
     * is specified, this option is ignored.
     * @param {Number} [options.speed=1.2] The average speed of the animation defined in relation to options.curve.
     *  A speed of 1.2 means that the map appears to move along the flight path by 1.2 times options.curve screenfuls
     *  every second. A screenful is the map's visible span. It does not correspond to a fixed physical distance,
     * but varies by zoom level.
     * @param {Number} [options.screenSpeed] The average speed of the animation measured in screenfuls per second
     * assuming a linear timing curve. If options.speed is specified, this option is ignored.
     * @param {Number} [options.maxDuration] The animation's maximum duration measured in milliseconds.
     * If duration exceeds maximum duration it resets to 0.
     * @param {Object} [eventData] Additional properties to be added
     * to event objects of events triggered by this method.
     * @return {Maps.Map} Map instance
     */
    'flyTo',

    /**
     * @method stop
     * @description Stops any animated transition underway.
     * @return {Maps.Map} Map instance
     */
    'stop',

    // Dimension modifications and measurements
    /**
     * @method resize
     * @description Resizes the map according to the dimensions of its container element.
     * This method must be called after the map's container is resized by another script
     * or when the map is shown after being initially hidden with CSS.
     * @param {Object} [eventData] Additional properties
     * to be added to event objects of events triggered by this method.
     * @return {Maps.Map} Map instance
     */
    'resize',

    /**
     * @method getBounds
     * @description Returns the map's geographical bounds. When the bearing or pitch is non-zero,
     * the visible region is not an axis-aligned rectangle, and the result is the smallest bounds
     * that encompasses the visible region.
     * @return {Maps.LngLatBounds}
     */
    'getBounds',

    /**
     * @method getMaxBounds
     * @description Returns the maximum geographical bounds the map is constrained to, or `null` if none set.
     * @return {Maps.LngLatBounds|null}
     */
    'getMaxBounds',

    /**
     * @method setMaxBounds
     * @description Sets or clears the map's geographical bounds.
     * Pan and zoom operations are constrained within these bounds. If a pan or zoom is performed that would display
     * regions outside of these bounds, the map will instead display a position and zoom level as close as possible
     * to the operation's request while still remaining within the bounds.
     * @param {Maps.LngLatBounds|null|undefined} bounds The maximum bounds to set.
     * If `null` or `undefined` is provided, the function removes the map's maximum bounds.
     * @return {Maps.Map} Map instance
     */
    'setMaxBounds',

    /**
     * @method setMinZoom
     * @description Sets or clears the map's minimum zoom level.
     * If the map's current zoom level is lower than the new minimum, the map will zoom to the new minimum.
     * @param {Number|null|undefined} minZoom The minimum zoom level to set (0-24).
     * If `null` or `undefined` is provided, the function removes the current minimum zoom (i.e., sets it to 0).
     * @return {Maps.Map} Map instance
     */
    'setMinZoom',

    /**
     * @method getMinZoom
     * @description Returns the map's minimum allowable zoom level.
     * @return {Number} minZoom.
     */
    'getMinZoom',

    /**
     * @method setMaxZoom
     * @description Sets or clears the map's maximum zoom level.
     * If the map's current zoom level is higher than the new maximum, the map will zoom to the new maximum.
     * @param {Number|null|undefined} maxZoom The maximum zoom level to set.
     * If `null` or `undefined` is provided, the function removes the current maximum zoom (sets it to 22).
     * @return {Maps.Map} Map instance
     */
    'setMaxZoom',

    /**
     * @method getMaxZoom
     * @description Returns the map's maximum allowable zoom level.
     * @return {Number} maxZoom.
     */
    'getMaxZoom',

    // Events
    /**
     * @method on
     * @description Adds a listener for events of a specified type occurring on features in a specified style layer.
     * @param {String} type The event type to listen for; one of 'mousedown' , 'mouseup' , 'click' , 'dblclick' ,
     * 'mousemove' , 'mouseenter' , 'mouseleave' , 'mouseover' , 'mouseout' , 'contextmenu' , 'touchstart' ,
     * 'touchend' , or 'touchcancel' . mouseenter and mouseover events are triggered when the cursor enters
     * a visible portion of the specified layer from outside that layer or outside the map canvas. mouseleave
     * and mouseout events are triggered when the cursor leaves a visible portion of the specified layer,
     * or leaves the map canvas.
     * @param {String} layerId The ID of a style layer. Only events whose location is within a visible feature
     * in this layer will trigger the listener. The event will have a features property containing an array
     * of the matching features.
     * @param {Function} listener The function to be called when the event is fired.
     * @return {Maps.Map} This
     */
    'on',

    /**
     * @method on
     * @description Adds a listener for events of a specified type occurring on features in a specified style layer.
     * @param {String} type The event type to add a listen for.
     * @param {Function} listener The function to be called when the event is fired. The listener function is
     * called with the data object passed to fire, extended with target and type properties.
     * @return {Maps.Map} This
     */
    'on',

    /**
     * @method off
     * @description Removes an event listener previously added with Map.on.
     * @param {String} type The event type previously used to install the listener.
     * @param {String} layerId The layer ID previously used to install the listener.
     * @param {Function} listener The function previously installed as a listener.
     * @return {Maps.Map} This
     */
    'off',

    /**
     * @method off
     * @description Removes an event listener previously added with Map.on.
     * @param {String} type The event type previously used to install the listener.
     * @param {Function} listener The function previously installed as a listener.
     * @return {Maps.Map} This
     */
    'off',

    /**
     * @method once
     * @description Adds a listener that will be called only once to a specified event type.
     * The listener will be called the first time the event fires after the listener is registered.
     * @param {String} type The event type to add a listen for.
     * @param {Function} listener The function to be called when the event is fired the first time.
     * @return {Maps.Map} This
     */
    'once',

    /**
     * @method once
     * @description Adds a listener that will be called only once to a specified event type
     * occurring on features in a specified style layer.
     * @param {String} type The event type to listen for; one of 'mousedown', 'mouseup', 'click', 'dblclick',
     * 'mousemove', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout', 'contextmenu', 'touchstart',
     * 'touchend', or 'touchcancel'. mouseenter and mouseover events are triggered when the cursor enters
     * a visible portion of the specified layer from outside that layer or outside the map canvas. mouseleave
     * and mouseout events are triggered when the cursor leaves a visible portion of the specified layer,
     * or leaves the map canvas.
     * @param {String} layerId The ID of a style layer. Only events whose location is within a visible
     * feature in this layer will trigger the listener. The event will have a features property containing
     * an array of the matching features.
     * @param {Function} listener The function to be called when th e event is fired the first time.
     * @return {Maps.Map} This
     */
    'once',

    // Plugins/controls support
    /**
     * @method addControl
     * @description Add plugin to the map.
     * @param {Plugin} plugin The plugin to add.
     * @param {String} [position] The position on the map to which the control will be added. Valid values are
     * 'top-left', 'top-right', 'bottom-left', and 'bottom-right'. Defaults to 'top-right'.
     * @return {Maps.Map} Map instance
     */
    'addControl',

    /**
     * @method removeControl
     * @description Removes the plugin from the map.
     * @param {Plugin} plugin The plugin to remove.
     * @return {Maps.Map} Map instance
     */
    'removeControl',

    /**
     * @method hasControl
     * @description Checks if a control is on the map.
     * @param {Plugin} plugin The plugin to check.
     * @return {boolean} True if map contains control.
     */
    'hasControl',

    // Style modifications - not in first version

    /**
     * @method addLayer
     * @description
     * Adds a style layer to the map's style.
     * A layer defines styling for data from a specified source.
     * @param {Object} layer The style layer to add.
     * To learn more about layer properties, please refer to
     * [Map Style Specification - Layer properties](MAPS_STYLE_SPECIFICATION_URL#layer-properties).
     * @param {String} [before] The ID of an existing layer to insert before the new layer. If this argument is omitted,
     * the layer will be appended to the end of the layers array.
     * @returns {Maps.Map} This
     */
    'addLayer',

    /**
     * @method isStyleLoaded
     * @description
     * Returns a Boolean indicating whether the map's style is fully loaded.
     * @returns {Boolean} A Boolean indicating whether the style is fully loaded.
     */
    'isStyleLoaded',

    /**
     * @method addSource
     * @description
     * Adds a source to the map's style.
     * @param {String} id The ID of the source to add. Must not conflict with existing sources.
     * @param {Object} source The source object, conforming to the style specification.
     * To learn more about source properties, please refer to
     * [Map Style Specification - Source properties](MAPS_STYLE_SPECIFICATION_URL#source-properties).
     * @returns {Maps.Map} This
     */
    'addSource',

    /**
     * @method isSourceLoaded
     * @description
     * Returns a Boolean indicating whether the source is loaded.
     * @param {String} id The ID of the source to be checked.
     * @returns {Boolean} A Boolean indicating whether the source is loaded.
     */
    'isSourceLoaded',

    /**
     * @method areTilesLoaded
     * @description
     * Returns a Boolean indicating whether all tiles in the viewport from all sources on the style are loaded.
     * @returns {Boolean} A Boolean indicating whether all tiles are loaded.
     */
    'areTilesLoaded',

    /**
     * @method removeSource
     * @description
     * Removes a source from the map's style.
     * @param {String} id The ID of the source to remove.
     * @returns {Maps.Map} This
     */
    'removeSource',

    /**
     * @method getSource
     * @description
     * Returns the source with the specified ID in the map's style.
     * @param {String} id The ID of the source to get.
     * @returns {Maps.GeoJSONSource|Maps.ImageSource|Maps.VideoSource||Maps.CanvasSource|Maps.VectorSource|Object}
     * The style source with the specified ID, or undefined if the ID corresponds
     * to no existing sources.
     */
    'getSource',

    /**
     * @method moveLayer
     * @description
     * Moves a layer to a different z-position.
     * @param {String} id The ID of the layer to move.
     * @param {String} [beforeId] The ID of an existing layer to insert before the new layer.
     * If this argument is omitted, the layer will be appended to the end of the layers array.
     * @returns {Maps.Map} This
     */
    'moveLayer',

    /**
     * @method removeLayer
     * @description
     * Removes the layer with the given id from the map's style.
     * If no such layer exists, an error event is fired.
     * @param {String} id The ID of the layer to remove.
     */
    'removeLayer',

    /**
     * @method getLayer
     * @description
     * Returns the layer with the specified ID in the map's style.
     * @param {String} id The ID of the layer to get.
     * @returns {Object} The layer with the specified ID, or undefined if the ID corresponds to no existing layers.
     */
    'getLayer',

    /**
     * @method setLayerZoomRange
     * @description
     * The ID of the layer to which the zoom extent will be applied.
     * @param {String} layerId The ID of the layer to which the zoom extent will be applied.
     * @param {Number} minzoom The minimum zoom to set (0-24).
     * @param {Number} maxzoom The maximum zoom to set (0-24).
     * @example
     * ```javascript
     * map.setLayerZoomRange('my-layer', 2, 5);
     * ```
     * @returns {Maps.Map} This
     */
    'setLayerZoomRange',

    /**
     * @method setFilter
     * @description
     * Sets the filter for the specified style layer.
     * @param {String} layer The ID of the layer to which the filter will be applied.
     * @param {Array|null|undefined} filter The filter, conforming to the style specification's filter definition.
     * If null or undefined is provided, the function removes any existing filter from the layer.
     * @param {Object} [options={}]
     * @param {Object} [options.validate=true] Whether to check if the filter conforms to the style
     * specification. Disabling validation is a performance optimization that should only be used if you
     * have previously validated the values you will be passing to this function.
     * @example
     * ```javascript
     * map.setFilter('my-layer', ['==', 'name', 'USA']);
     * ```
     * @returns {Maps.Map} This
     */
    'setFilter',

    /**
     * @method getFilter
     * @description
     * Returns the filter applied to the specified style layer.
     * @param {String} layer The ID of the style layer whose filter to get.
     * @returns {Array} The layer's filter.
     */
    'getFilter',

    /**
     * @method setPaintProperty
     * @description
     * Sets the value of a paint property in the specified style layer.
     * @param {String} layer The ID of the layer to set the paint property in.
     * @param {String} name The name of the paint property to set.
     * @param {any} value The value of the paint propery to set. Must be of a type appropriate for the property.
     * @param {Object} [options={}]
     * @param {Object} [options.validate=true] Whether to check if the filter conforms to the style
     * specification. Disabling validation is a performance optimization that should only be used if you
     * have previously validated the values you will be passing to this function.
     * @returns {Maps.Map} This
     */
    'setPaintProperty',

    /**
     * @method setFeatureState
     * @description
     * Sets the state of a feature. The `state` object is merged in with the existing state of the feature.
     * Features are identified by their id attribute, which must be an integer
     * or a string that can be cast to an integer.
     * @param {Object} feature Feature identifier. Feature objects returned from
     * {{#crossLink "Maps.Map/queryRenderedFeatures:method"}}map.queryRenderedFeatures(){{/crossLink}}
     * or event handlers can be used as feature identifiers.
     * @param {Object} state A set of key-value pairs. The values should be valid JSON types.
     * This method requires the `feature.id` attribute on data sets. For GeoJSON sources without feature ids,
     * set the `generateId` option in the GeoJSON source specification to auto-assign them.
     * This option assigns ids based on a feature's index in the source data. If you change feature data
     * using `map.getSource('some id').setData(..)`,
     * you may need to re-apply state taking into account updated id values.
     * @param {String|Number} feature.id Unique id of the feature. If string is being passed, it has to be
     * castable to integer.
     * @param {String} feature.source The Id of the vector source or GeoJSON source for the feature.
     * @param {String} [feature.sourceLayer] For vector tile sources, the sourceLayer is required.
     * @returns {Maps.Map} This
     */
    'setFeatureState',

    /**
     * @method removeFeatureState
     * @description
     * Removes feature state, setting it back to the default behavior.
     * If only source is specified, removes all states of that source. If `target.id` is also specified,
     * removes all keys for that feature's state. If key is also specified, removes that key from that feature's state.
     * Features are identified by their `id` attribute,
     * which must be an integer or a string that can be cast to an integer.
     * @param {Object} target Identifier of where to set state: can be a source,
     * a feature, or a specific key of feature. Feature objects returned from
     * {{#crossLink "Maps.Map/queryRenderedFeatures:method"}}map.queryRenderedFeatures(){{/crossLink}}
     * or event handlers can be used as feature identifiers.
     * @param {String|Number} [target.id] Unique id of the feature. Optional if key is not specified.
     * If string is being passed, it has to be castable to integer.
     * @param {String} target.source The Id of the vector source or GeoJSON source for the feature.
     * @param {String} [target.sourceLayer] For vector tile sources, the sourceLayer is required.
     * @returns {Maps.Map} This
     */
    'removeFeatureState',

    /**
     * @method getFeatureState
     * @description
     * Gets the state of a feature. Features are identified by their `id` attribute,
     * which must be an integer or a string that can be cast to an integer.
     * @param {Object} feature Feature identifier. Feature objects returned from
     * {{#crossLink "Maps.Map/queryRenderedFeatures:method"}}map.queryRenderedFeatures(){{/crossLink}}.
     * or event handlers can be used as feature identifiers.
     * @param {String} key The key in the feature state to reset.
     * @param {String|Number} [feature.id] Unique id of the feature. If string is being passed,
     * it has to be castable to integer.
     * @param {String} feature.source The Id of the vector source or GeoJSON source for the feature.
     * @param {String} [feature.sourceLayer] For vector tile sources, the sourceLayer is required.
     * @returns {Object} The state of the feature.
     */
    'getFeatureState',

    /**
     * @method getPaintProperty
     * @description
     * Returns the value of a paint property in the specified style layer.
     * @param {String} layer The ID of the layer to get the paint property from.
     * @param {String} name The name of a paint property to get.
     * @returns {any} The value of the specified paint property.
     */
    'getPaintProperty',

    /**
     * @method setLayoutProperty
     * @description
     * Sets the value of a layout property in the specified style layer.
     * @param {String} layer The ID of the layer to set the layout property in.
     * @param {String} name The name of the layout property to set.
     * @param {any} value The value of the layout propery. Must be of a type appropriate for the property.
     * @param {Object} [options={}]
     * @param {Object} [options.validate=true] Whether to check if the filter conforms to the style
     * specification. Disabling validation is a performance optimization that should only be used if you
     * have previously validated the values you will be passing to this function.
     * @returns {Maps.Map} This
     */
    'setLayoutProperty',

    /**
     * @method getLayoutProperty
     * @description
     * Returns the value of a layout property in the specified style layer.
     * @param {String} layer The ID of the layer to get the layout property from.
     * @param {String} name The name of the layout property to get.
     * @returns {any} The value of the specified layout property.
     */
    'getLayoutProperty',
    /**
     * @method setStyle
     * @description Sets map style.
     * Visibility of certain layers of the style is altered by
     * {{#crossLink "Maps.Map/stylesVisibility:parameter"}}options.stylesVisibility{{/crossLink}}.
     * If you modified the style in any way (e.g. by adding new layers), the changes you made
     * won't be preserved after calling `map.setStyle()`.
     * @param {String|Object} style Map style
     * It can be one of following types:
     * * URL to the JSON object conforming
     * to the schema described in the
     * <a href="https://developer.tomtom.com/maps-api/maps-api-documentation/map-style-specification">
     * Map Style Specification</a>. Provided URL should follow this pattern:
     * `https://api.tomtom.com/style/1/style/<STYLES_VERSION>&map=<MAP_STYLE>&traffic_incidents=<INCIDENTS_STYLE>&traffic_flow=<FLOW_STYLE>&poi=<POI_STYLE>`</br>
     *
     * where:</br>
     *      * `STYLES_VERSION` - version number of the
     *       <a href="https://developer.tomtom.com/maps-api/maps-api-documentation/map-styles-v2">Map Styles</a>
     *      * `MAP_STYLE` - name of the
     *       <a href="https://developer.tomtom.com/map-display-api/documentation/mapstyles/map-styles-v2#available-map-styles">
     *          Map Style</a>
     *      * `INCIDENTS_STYLE` - name of the
     *       <a href="https://developer.tomtom.com/map-display-api/documentation/mapstyles/map-styles-v2#available-incidents-styles">
     *          Traffic Incidents Style</a>
     *      * `FLOW_STYLE` - name of the
     *       <a href="https://developer.tomtom.com/map-display-api/documentation/mapstyles/map-styles-v2#available-flow-styles">
     *          Traffic Flow Style</a>
     *      * `POI_STYLE` - name of the
     *       <a href="https://developer.tomtom.com/map-display-api/documentation/mapstyles/map-styles-v2#available-poi-styles">
     *          POI Style</a>
     * * JSON object conforming to the mentioned specification.
     * * Configuration object e.g.:
     *      style: {
     *          map: '2/basic_street-light',
     *          poi: '2/poi_light',
     *          trafficIncidents: '2/incidents_light',
     *          trafficFlow: '2/flow_relative-light'
     *      }
     *
     * List of styles supported provided by TomTom can be found in
     *  <a href="https://developer.tomtom.com/map-display-api/documentation/mapstyles/map-styles-v2">Map styles service</a>.
     * </br>
     * @return {Maps.Map} This
     */

    /**
     * @method getStyle
     * @description
     * Returns the map's style object which can be used to recreate the map's style.
     * @returns {Object} The map's style object.
     */
    'getStyle',

    // Other methods

    /**
     * @method getContainer
     * @description
     * Returns the map's containing HTML element.
     * @returns {HTMLElement} The map's container.
     */
    'getContainer',

    /**
     * @method getCanvasContainer
     * @description
     * Returns the HTML element containing the map's `<canvas>` element.
     * If you want to add non-GL overlays to the map, you should append them to this element.
     * This is the element to which event bindings for map interactivity (such as panning and zooming) are attached.
     * It will receive bubbled events from child elements such as the `<canvas>`, but not from map controls.
     * @returns {HTMLElement} The container of the map's canvas.
     */
    'getCanvasContainer',

    /**
     * @method getCanvas
     * @description
     * Returns the map's `<canvas>` element.
     * @returns {HTMLCanvasElement} The map's canvas element.
     */
    'getCanvas',

    /**
     * @method loaded
     * @description
     * Returns a Boolean indicating whether the map is fully loaded.
     * Returns false if the style is not yet fully loaded, or if there has been a change to the
     * sources or style that has not yet fully loaded.
     * @returns {Boolean} A Boolean indicating whether the map is fully loaded.
     */
    'loaded',

    /**
     * @method remove
     * @description
     * Clean up and release all internal resources associated with this map.
     * This includes DOM elements, event bindings, Web Workers, and WebGL resources.
     * Use this method when you are done using the map and wish to ensure that it no longer
     * consumes browser resources. Afterwards, you must not call any other methods on the map.
     */
    'remove',

    /**
     * @method triggerRepaint
     * @description
     * Trigger the rendering of a single frame. Use this method with custom layers to repaint the
     * map when the layer changes. Calling this multiple times before the next frame is rendered will
     * still result in only a single frame being rendered.
     */
    'triggerRepaint',

    /**
     * @method project
     * @param {Maps.LngLat} lnglat The geographical location to project.
     * @description Returns a Point representing pixel coordinates, relative to the map's container
     * that correspond to the specified geographical location.</br>
     * When the map is pitched and `lnglat` is completely behind the camera, there are no pixel
     * coordinates corresponding to that location. In that case, the `x` and `y` components of the
     * returned Point are set to `Number.MAX_VALUE`.
     * @returns {Maps.Point} The Point corresponding to lnglat relative to the map's container.
     */
    'project',

    /**
     * @method unproject
     * @param {Maps.Point} point The pixel coordinates to unproject.
     * @description Returns a LngLat representing geographical coordinates that correspond to
     * the specified pixel coordinates.
     * @returns {Maps.LngLat} The LngLat corresponding to point.
     */
    'unproject',

    /**
     * @method loadImage
     * @param {string} url The URL of the image file. Image file must be in png, webp, or jpg format.
     * @param {Function} callback Expecting `callback(error, data)`. Called when the image has loaded or with an error
     * argument if there is an error.
     * @description Load an image from an external URL for use with `Map#addImage`. External
     * domains must support [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).
     */
    'loadImage',

    /**
     * @method listImages
     * @description Returns an Array of strings containing the IDs of all images currently available in the map.
     * This includes both images from the style's original sprite and any images that have been added at runtime
     * using {{#crossLink "Maps.Map/addImage:method"}}map.addImage(){{/crossLink}}.
     * @returns {Array} An Array of strings containing the names of all sprites/images currently available in the map.
     */
    'listImages',

    /**
     * @method hasImage
     * @description
     * Returns the source with the specified ID in the map's style.
     * @param {String} id The ID of the image.
     * @returns {Boolean} A Boolean indicating whether the image exists.
     */
    'hasImage',

    /**
     * @method removeImage
     * @description
     * Remove an image from a style. This can be an image from the style's original sprite or any
     * images that have been added at runtime using {{#crossLink "Maps.Map/addImage:method"}}map.addImage()
     * {{/crossLink}}.
     * @param {String} id The ID of the image.
     */
    'removeImage',

    /**
     * @method addImage
     * @param id The ID of the image.
     * @param image The image as an `HTMLImageElement`, `ImageData`, or object with `width`, `height`, and `data`
     * properties with the same format as `ImageData`.
     * @param options
     * @param options.pixelRatio The ratio of pixels in the image to physical pixels on the screen
     * @param options.sdf Whether the image should be interpreted as an SDF image
     * @description Add an image to the style. This image can be used in `icon-image`,
     * `background-pattern`, `fill-pattern`, and `line-pattern`. An
     * `Map#error` event will be fired if there is not enough space in the
     * sprite to add this image.
     */
    'addImage',

    /**
     * @method updateImage
     * @param id The ID of the image.
     * @param image The image as an `HTMLImageElement`, `ImageData`, or object with `width`, `height`, and `data`
     * properties with the same format as `ImageData`.
     *
     */
    'updateImage',

    /**
     * @method resetNorthPitch
     * @description Rotates and pitches the map so that north is up (0° bearing)
     * and pitch is 0°, with an animated transition.
     */
    'resetNorthPitch',

    /**
     * @method queryRenderedFeatures
     * @param {Object|Array} [geometry] The geometry of the query region: either a single point or southwest and northeast points
     * describing a bounding box. Omitting this parameter (i.e. calling Map.queryRenderedFeatures with zero arguments,
     * or with only a options argument) is equivalent to passing a bounding box encompassing the entire map viewport.
     * @param [options] Object with options.
     * @param {Array} [options.layers] An array of style layer IDs for the query to inspect.
     * Only features within these layers will be returned.
     * If this parameter is undefined, all layers will be checked.
     * @param {Array} [options.filter] A filter to limit query results.
     * @param {Boolean} [options.validate=true] Whether to check if the options.filter conforms to the
     * Style Specification.
     * @description Returns an array of GeoJSON Feature objects representing visible features that
     * satisfy the query parameters.
     * The properties value of each returned feature object contains the properties of its source feature.
     * For GeoJSON sources, only string and numeric property values are supported (i.e. null, Array, and Object
     * values are not supported).
     * Each feature includes top-level layer, source, and sourceLayer properties. The layer property is an
     * object representing the style
     * layer to which the feature belongs. Layout and paint properties in this object contain values which are
     * fully evaluated for the given zoom level and feature.
     *
     * Only features that are currently rendered are included. Some features will not be included, like:
     * * Features from layers whose visibility property is none;
     * * Features from layers whose zoom range excludes the current zoom level;
     * * Symbol features that have been hidden due to text or icon collision.
     *
     * Features from all other layers are included, including features that may have no visible contribution to the
     * rendered result; for example, because the layer's opacity or color alpha component is set to 0.
     * The topmost rendered feature appears first in the returned array, and subsequent features are sorted by
     * descending z-order. Features that are rendered multiple times (due to wrapping across the antimeridian at
     * low zoom levels) are returned only once (though subject to the following caveat).
     *
     * Because features come from tiled vector data or GeoJSON data that is converted to tiles internally, feature
     * geometries may be split or duplicated across tile boundaries and, as a result, features may appear multiple times
     * in query results. For example, suppose there is a highway running through the bounding rectangle of a query.
     * The results of the query will be those parts of the highway that lie within the map tiles covering the
     * bounding rectangle, even if the highway extends into other tiles, and the portion of the highway within
     * each map tile will be returned as a separate feature. Similarly, a point feature near a tile boundary may
     * appear in multiple tiles due to tile buffering.
     * @returns {Array} An array of GeoJSON feature objects.
     */
    'queryRenderedFeatures',

    /**
     * @method querySourceFeatures
     * @param {String} sourceId The ID of the vector tile or GeoJSON source to query.
     * @param [options]
     * @param {String} [options.sourceLayer] The name of the source layer to query. For vector tile sources, this
     * parameter is required. For GeoJSON sources, it is ignored.
     * @param {Array} [options.filter] A filter to limit query results.
     * @param {Boolean} [options.validate=true] Whether to check if the options.filter conforms to the
     * Style Specification.
     * @description Returns an array of GeoJSON Feature objects .
     * In contrast to {{#crossLink "Maps.Map/queryRenderedFeatures:method"}}map.queryRenderedFeatures(){{/crossLink}},
     * this function returns all features matching the query parameters,
     * whether or not they are rendered by the current style (i.e. visible). The domain of the query includes all
     * currently-loaded vector tiles and GeoJSON source tiles: this function does not check tiles outside the
     * currently visible viewport.
     *
     * Because features come from tiled vector data or GeoJSON data that is converted to tiles internally,
     * feature geometries may be split or duplicated across tile boundaries and, as a result, features may
     * appear multiple times in query results. For example, suppose there is a highway running through the bounding
     * rectangle of a query. The results of the query will be those parts of the highway that lie within the map tiles
     * covering the bounding rectangle, even if the highway extends into other tiles, and the portion of the highway
     * within each map tile will be returned as a separate feature. Similarly, a point feature near a tile boundary
     * may appear in multiple tiles due to tile buffering.
     * @returns {Array} Returns an array of GeoJSON Feature objects representing features within the
     * specified vector tile or GeoJSON source that satisfy the query parameters.
     */
    'querySourceFeatures',

    /**
     * @method cameraForBounds
     * @param {Maps.LngLatBounds} bounds Calculate the center for these bounds in the viewport and use the highest zoom
     * level up to and including {{#crossLink "Maps.Map/getMaxZoom:method"}}map.getMaxZoom(){{/crossLink}}
     * that fits in the viewport. LatLngBounds represent a box that is always axis-aligned with bearing 0.
     * @param {Object} [options] Camera options.
     * @param {Object} [options.padding] The amount of padding in pixels to add to the given bounds.
     * @param {Maps.Point} [options.offset] The center of the given bounds relative to the map's center
     * measured in pixels.
     * @param {Number} [options.maxZoom] The maximum zoom level to allow when the map view transitions
     * @return {ICameraOptions | undefined} If map is able to fit to provided bounds, returns camera options
     * with center, zoom, and bearing. If map is unable to fit, method will warn and return undefined.
     */
    'cameraForBounds'
];

/**
 * Fired immediately after the map has been resized.
 * @event resize
 */

/**
 * Fired immediately after the map has been removed.
 * @event remove
 */

/**
 * Fired when a pointing device (usually a mouse) is pressed within the map.
 * @event mousedown
 * @type Maps.MapMouseEvent
 */

/**
 * Fired when a pointing device (usually a mouse) is released within the map.
 * @event mouseup
 * @type Maps.MapMouseEvent
 */

/**
 * Fired when a pointing device (usually a mouse) is moved within the map.
 * @event mouseover
 * @type Maps.MapMouseEvent
 */

/**
 * Fired when a pointing device (usually a mouse) is moved within the map.
 * @event mousemove
 * @type Maps.MapMouseEvent
 */

/**
 * Fired when a pointing device (usually a mouse) is pressed and released at the same point on the map.
 * @event click
 * @type Maps.MapMouseEvent
 */

/**
 * Fired when a pointing device (usually a mouse) is clicked twice at the same point on the map.
 * @event dblclick
 * @type Maps.MapMouseEvent
 */

/**
 * Fired when a pointing device (usually a mouse) enters a visible portion of a specified layer
 * from outside that layer or outside the map canvas. This event can only be listened for via the
 * three-argument version of Map#on, where the second argument specifies the desired layer.
 * @event mouseenter
 * @type Maps.MapMouseEvent
 */

/**
 * Fired when a pointing device (usually a mouse) leaves a visible portion of a specified layer,
 * or leaves the map canvas. This event can only be listened for via the three-argument version of Map.on,
 * where the second argument specifies the desired layer.
 * @event mouseleave
 * @type Maps.MapMouseEvent
 */

/**
 * Fired when a point device (usually a mouse) leaves the map's canvas.
 * @event mouseout
 * @type Maps.MapMouseEvent
 */

/**
 * Fired when the right button of the mouse is clicked or the context menu key is pressed within the map.
 * @event contextmenu
 * @type Maps.MapMouseEvent
 */

/**
 * Fired when a wheel event occurs within the map.
 * @event wheel
 * @type Maps.MapWheelEvent
 */

/**
 * Fired when a touchstart event occurs within the map.
 * @event touchstart
 * @type Maps.MapTouchEvent
 */

/**
 * Fired when a touchend event occurs within the map.
 * @event touchend
 * @type Maps.MapTouchEvent
 */

/**
 * Fired when a touchmove event occurs within the map.
 * @event touchmove
 * @type Maps.MapTouchEvent
 */

/**
 * Fired when a touchcancel event occurs within the map.
 * @event touchcancel
 * @type Maps.MapTouchEvent
 */

/**
 * Fired just before the map begins a transition from one view to another, as the result of either
 * user interaction or methods such as Map.jumpTo.
 * @event movestart
 * @type DragEvent
 */

/**
 * Fired repeatedly during an animated transition from one view to another, as the result of either
 * user interaction or methods such as Map.flyTo.
 * @event move
 * @type Maps.MapMouseEvent|Maps.MapTouchEvent
 */

/**
 * Fired just after the map completes a transition from one view to another, as the result of either
 * user interaction or methods such as Map.jumpTo.
 * @event moveend
 * @type DragEvent
 */

/**
 * Fired when a "drag to pan" interaction starts.
 * @event dragstart
 * @type DragEvent
 */

/**
 * Fired repeatedly during a "drag to pan" interaction.
 * @event drag
 * @type Maps.MapMouseEvent|Maps.MapTouchEvent
 */

/**
 * Fired when a "drag to pan" interaction ends.
 * @event dragend
 * @type DragEvent
 */

/**
 * Fired just before the map begins a transition from one zoom level to another, as the result of either
 * user interaction or methods such as Map.flyTo.
 * @event zoomstart
 * @type Maps.MapMouseEvent|Maps.MapTouchEvent
 */

/**
 * Fired repeatedly during an animated transition from one zoom level to another, as the result of
 * either user interaction or methods such as Map.flyTo.
 * @event zoom
 * @type Maps.MapMouseEvent|Maps.MapTouchEvent
 */

/**
 * Fired just after the map completes a transition from one zoom level to another, as the result of
 * either user interaction or methods such as Map.flyTo.
 * @event zoomend
 * @type Maps.MapMouseEvent|Maps.MapTouchEvent
 */

/**
 * Fired when a "drag to rotate" interaction starts.
 * @event rotatestart
 * @type Maps.MapMouseEvent|Maps.MapTouchEvent
 */

/**
 * Fired repeatedly during a "drag to rotate" interaction.
 * @event rotate
 * @type Maps.MapMouseEvent|Maps.MapTouchEvent
 */

/**
 * Fired when a "drag to rotate" interaction ends.
 * @event rotateend
 * @type Maps.MapMouseEvent|Maps.MapTouchEvent
 */

/**
 * Fired whenever the map's pitch (tilt) begins a change as the result of either
 * user interaction or methods such as Map.flyTo .
 * @event pitchstart
 * @type Maps.MapEventData
 */

/**
 * Fired whenever the map's pitch (tilt) changes as the result of either user interaction or
 * methods such as Map.flyTo.
 * @event pitch
 * @type Maps.MapEventData
 */

/**
 * Fired immediately after the map's pitch (tilt) finishes changing as the result of either
 * user interaction or methods such as Map.flyTo.
 * @event pitchend
 * @type Maps.MapEventData
 */

/**
 * Fired when a "box zoom" interaction starts.
 * @event boxzoomstart
 * @type Maps.BoxZoomEvent
 */

/**
 * Fired when a "box zoom" interaction ends.
 * @event boxzoomend
 * @type Maps.BoxZoomEvent
 */

/**
 * Fired when the user cancels a "box zoom" interaction, or when the bounding box does not meet the minimum
 * size threshold.
 * @event boxzoomcancel
 * @type Maps.BoxZoomEvent
 */

/**
 * Fired when the WebGL context is lost.
 * @event webglcontextlost
 */

/**
 * Fired when the WebGL context is restored.
 * @event webglcontextrestored
 */

/**
 * Fired immediately after all necessary resources have been downloaded and the first visually complete
 * rendering of the map has occurred.
 * @event load
 */

/**
 * Fired whenever the map is drawn to the screen, as the result of:
 * * A change to the map's position, zoom, pitch, or bearing.
 * * A change to the map's style.
 * * A change to a GeoJSON source.
 * * The loading of a vector tile, GeoJSON file, glyph, or sprite.
 * @event render
 */

/**
 * Fired after the last frame rendered before the map enters an "idle" state:
 * * No camera transitions are in progress.
 * * All currently requested tiles have loaded.
 * * All fade/transition animations have completed.
 * @event idle
 */

/**
 * Fired when an error occurs. This is the primary error reporting mechanism. We use an event
 * instead of throw to better accommodate asyncronous operations. If no listeners are bound to the error event,
 * the error will be printed to the console.
 * @event error
 * @type {Object}
 */

/**
 * Fired when any map data loads or changes.
 * @event data
 * @type {Maps.MapDataEvent}
 */

/**
 * Fired when the map's style loads or changes.
 * @event styledata
 * @type {Maps.MapDataEvent}
 */

/**
 * Fired when one of the map's sources loads or changes, including if a tile belonging to a source loads or changes.
 * @event sourcedata
 * @type {Maps.MapDataEvent}
 */

/**
 * Fired when any map data (style, source, tile, etc.) begins loading or changing asyncronously.
 * All dataloading events are followed by a data or error event.
 * @event dataloading
 * @type {Maps.MapDataEvent}
 */

/**
 * Fired when the map's style begins loading or changing asyncronously. All styledataloading
 * events are followed by a styledata or error event.
 * @event styledataloading
 * @type {Maps.MapDataEvent}
 */

/**
 * Fired when one of the map's sources begins loading or changing asyncronously. All sourcedataloading
 * events are followed by a sourcedata or error event.
 * @event sourcedataloading
 * @type {Maps.MapDataEvent}
 */

function proxyMapboxMethods(baseObject, map) {

    providedMapboxMapMethods.forEach((method) => {
        baseObject[method] = function() {
            const methodReturn = map[method](...arguments);
            return methodReturn instanceof mapboxMapClassGetter() ? baseObject : methodReturn;
        };
    });

    Object.defineProperty(baseObject, '__om', { value: map });
}

function appendUserInteractionHandlers(baseObject, map) {
    userInteractionHandlers.forEach((handler) => {
        baseObject[handler] = map[handler];
    });
}

function overrideMapboxMethods(baseObject) {
    for (const method in overriddenMethods) {
        if (Object.prototype.hasOwnProperty.call(overriddenMethods, method)) {
            baseObject[method] = overriddenMethods[method].bind(baseObject);
        }
    }
}

function overrideInitializationMapboxMethods(baseObject) {
    baseObject.prototype._detectMissingCSS = function() {
        const missingCSSCanary = this._missingCSSCanary || document.getElementsByClassName('mapboxgl-canary')[0];
        const computedColor = window.getComputedStyle(missingCSSCanary).getPropertyValue('background-color');
        if (computedColor !== 'rgb(250, 128, 114)') {
            console.warn('This page appears to be missing CSS declarations for Maps SDK for Web, which may cause the map to display incorrectly. ' +
            'Please ensure your page includes maps.css, as described in https://developer.tomtom.com/maps-sdk-web-js/documentation');
        }
    };
}

export function appendMapboxProperties(baseObject, map) {
    proxyMapboxMethods(baseObject, map);
    appendUserInteractionHandlers(baseObject, map);
    overrideMapboxMethods(baseObject);
}

export function mapboxMapFactory(options) {
    const Map = mapboxMapClassGetter();
    overrideInitializationMapboxMethods(Map);

    return new Map(options);
}
