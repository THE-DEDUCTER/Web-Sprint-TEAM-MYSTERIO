/**
 * @namespace Maps
 */

/**
  * @class Marker
  * @extends Maps.Evented
  * @description Creates a marker component
  * @example
  * ```javascript
  * var marker = new tt.Marker()
  * .setLngLat([30.5, 50.5])
  * .addTo(map);
  * ```
  * @constructor
  * @param {Object|HTMLElement} [options] Object with options or HTMLElement
  * @param {HTMLElement} [options.element] DOM element to use as a marker.
  * @param {String} [options.anchor = bottom] A string indicating the part of the Marker that should be positioned
  * closest to the coordinate set via Marker.setLngLat . Options are 'center', 'top', 'bottom', 'left',
  * 'right', 'top-left', 'top-right', 'bottom-left', and 'bottom-right' .
  * @param {Maps.Point} [options.offset] The offset in pixels as a Point object to apply relative to the
  * element's center. Negatives indicate left and up.
  * @param {number} [options.rotation=0] The rotation angle of the marker in degrees, relative to its respective
  * `rotationAlignment` setting. A positive value will rotate the marker clockwise.
  * @param {string} [options.pitchAlignment='auto'] `map` aligns the Marker to the plane of the map. `viewport` aligns
  * the `Marker` to the plane of the viewport. `auto` automatically matches the value of `rotationAlignment`.
  * @param {string} [options.rotationAlignment='auto'] `map` aligns the Marker's rotation relative to the map,
  * maintaining a bearing as the map rotates. `viewport` aligns the Marker's rotation relative to the viewport,
  * agnostic to map rotations. `auto` is equivalent to `viewport`.
  * @param {String} [options.color = #000000] The color to use for the default marker if options.element is not
  * provided.
  * @param {number} [options.scale=1] The scale to use for the default marker if options.element is not provided.
  * The default scale corresponds to a height of `36px` and a width of `30px`.
  * @param {String} [options.width = 30] The width of the default marker if options.element is not
  * provided.
  * @param {String} [options.height = 36] The height of the default marker if options.element is not
  * provided.
  * @param {Boolean} [options.draggable] A boolean indicating whether or not a marker is able to be dragged to a
  * new position on the map.
  * @param {Number} [options.clickTolerance=3] The max number of pixels a user can shift the mouse pointer during
  * a click on the marker for it to be considered a valid click (as opposed to a marker drag). The default is to
  * inherit map's clickTolerance.
  */

/**
  * Attaches the marker to a map
  * @method addTo
  * @type function
  * @param {Map} map Instance of a map
  * @returns {Maps.Marker} this
*/

/**
  * Removes the marker from a map
  * @method remove
  * @type function
  * @returns {Maps.Marker} this
*/

/**
  * Get the marker's geographical location.
  * The longitude of the result may differ by a multiple of 360 degrees from the longitude previously set by
  * setLngLat because Marker wraps the anchor longitude across copies of the world to keep the marker on screen.
  * @method getLngLat
  * @type function
  * @returns {Maps.LngLat}
*/

/**
  * Set the marker's geographical position and move it.
  * @method setLngLat
  * @type function
  * @param {Maps.LngLat} lnglat
  * @returns {Maps.Marker} this
*/

/**
  * Returns the Marker's HTML element.
  * @method getElement
  * @type function
  * @returns {HTMLElement} element
*/

/**
  * Binds a Popup to the Marker
  * @method setPopup
  * @type function
  * @param {Maps.Popup} popup an instance of the  Popup class. If undefined or null,
  * any popup set on this  Marker instance is unset
  * @returns {Maps.Marker} this
*/

/**
  * Returns the Popup instance that is bound to the Marker
  * @method getPopup
  * @type function
  * @returns {Maps.Popup} popup
*/

/**
  * Opens or closes the bound popup, depending on the current state
  * @method togglePopup
  * @type function
  * @returns {Maps.Marker} this
*/

/**
  * Get the marker's offset.
  * @method getOffset
  * @type function
  * @returns {Maps.Point}
*/

/**
  * Sets the offset of the marker
  * @method setOffset
  * @type function
  * @param {Maps.PontLike} offset The offset in pixels as a Point object to apply relative
  * to the element's center. Negatives indicate left and up.
  * @returns {Maps.Marker} this
*/

/**
  * Sets the draggable property and functionality of the marker
  * @method setDraggable
  * @type function
  * @param {Boolean} [shouldBeDraggable=false] Turns drag functionality on/off
  * @returns {Maps.Marker} this
*/

/**
  * Returns true if the marker can be dragged
  * @method isDraggable
  * @type function
  * @returns {Boolean}
*/

/**
  * Fired when dragging starts
  * @event dragstart
  * @type Maps.Marker
  */

/**
  * Fired while dragging
  * @event drag
  * @type Maps.Marker
  */

/**
  * Fired when the marker is finished being dragged
  * @event dragend
  * @type Maps.Marker
  */

import mapboxGl from 'mapbox-gl';
import markerSvg from './marker.svg';
import flagSvg from './flag.svg';

const defaultMarkerColor = '#000000';
const outerElemDimensions = {
    width: 30,
    height: 36
};

const markerSvgBlack = ({ width, height, color }) => markerSvg.replace('<svg',
    `<svg width="${width}" height="${height}" fill="${color}"`);

const flagSvgWhite = ({ width, height }) => flagSvg
    .replace('<svg', `<svg width="${width}" height="${height}"`)
    .replace('<path', '<path fill="white"');

function renderMarkerElem(defaultMarkerElementOptions) {
    const innerElementOptions = {
        height: defaultMarkerElementOptions.height - Math.round(0.1 * defaultMarkerElementOptions.height),
        width: defaultMarkerElementOptions.width
    };

    const elem = document.createElement('div');
    elem.style.backgroundImage = 'none';
    elem.style.width = `${defaultMarkerElementOptions.width}px`;
    elem.style.height = `${defaultMarkerElementOptions.height}px`;
    elem.innerHTML = markerSvgBlack(defaultMarkerElementOptions);

    const innerElem = document.createElement('div');
    innerElem.style.position = 'absolute';
    innerElem.style.top = 0;
    innerElem.style.left = 0;
    innerElem.style.width = `${innerElementOptions.width}px`;
    innerElem.style.height = `${innerElementOptions.height}px`;
    innerElem.style.backgroundImage = 'none';
    innerElem.style.overflow = 'hidden';

    innerElem.innerHTML = flagSvgWhite(innerElementOptions);

    elem.appendChild(innerElem);

    return elem;
}

function getOptions(options) {
    const {
        width = outerElemDimensions.width * options.scale,
        height = outerElemDimensions.height * options.scale,
        color = defaultMarkerColor
    } = options;

    return {
        ...options,
        element: options.element || renderMarkerElem({ width, height, color }),
        anchor: options.anchor || 'bottom'
    };
}

/* eslint-disable constructor-super */
export class Marker extends mapboxGl.Marker {
    constructor(options) {
        if (options instanceof global.HTMLElement) {
            options = {
                element: options,
                anchor: 'bottom'
            };
            super(options);
            return;
        }

        super(getOptions({ scale: 1, ...options }));
    }
}
