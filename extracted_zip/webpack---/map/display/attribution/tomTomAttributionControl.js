import {AttributionControl} from 'mapbox-gl-js';

import messageBox from '../messageBox/messageBox';
import renderCopyrights from './renderCopyrights';
import {copyrightsV2} from 'Services/services/copyrights/copyrightsV2';
import {copyrightsCaptionV2} from 'Services/services/copyrights/copyrightsCaptionV2';

//Specifies how many times we should ask for captions using before we lower the rate
const RETRY_TIMES_UNTIL_EXTENDED = 5;
//Specifies interval how often we should ask for caption
const RETRY_TIME = 1000;
//If we don't get response from the service after RETRY_TIMES_UNTIL_EXTENDED times, we are going to ask at lower rate
const RETRY_TIME_EXTENDED = 15000;

/**
 * The TomTomAttributionControl control presents the map's attribution information. We have provided functionality
 * to extend it: you are able to add a HTML part to our control.
 * @example
 * ```javascript
 * var map = tt.map({ ... });
 * var attributions = ['<a href="https://www.tomtom.com/mapshare/tools/">Report map issue</a>'];
 * map.getAttributionControl().addAttribution(attributions);
 *
 * ```
 *
 * @class TomTomAttributionControl
 * @constructor
 */
export default class TomTomAttributionControl extends AttributionControl {
    constructor(apiKey) {
        super({
            compact: false //this solves issue with copyrights caption looking bad on small screen
        });
        this.apiKey = apiKey;
        this.attributions = [];
        this.tomtomCopyrightsCaption = `<a class="tomtomAttribution">&copy; 1992 - ${new Date().getFullYear()} TomTom.</a>`; //eslint-disable-line
        this.sourceDataListener = this.__ttUpdateAttributions.bind(this);
        this.separator = ' | ';
        this.retryCount = 0;
        this._getCopyrightsCaption();
    }
    onAdd(map) {
        const container = super.onAdd(map);

        this._map.on('sourcedata', this.sourceDataListener);

        return container;
    }
    onRemove() {
        this._map.off('sourcedata', this.sourceDataListener);
        clearTimeout(this.timeoutId);
        super.onRemove();
    }
    /**
     * Adds the HTML content of the attribution control.
     *
     * @method addAttribution
     * @param {String} toAdd Text that will be added to attributions. When
     * multiple attributions are provided, "|" should be used as a separator.
     */
    addAttribution(toAdd) {
        this._updateAttributions();
        this.attributions = this.attributions.concat(toAdd);
        this.__ttUpdateAttributions();
    }
    /**
     * Removes the HTML content of the attribution control.
     *
     * @method removeAttribution
     * @param {String} toRemove Text that will be removed from the attributions.
     */
    removeAttribution(toRemove) {
        this.attributions = this.attributions.filter(attribution => attribution !== toRemove);
        this.__ttUpdateAttributions();
    }

    /**
     * Gets currently set separator, which will be used when merging attributions together
     *
     * @method getSeparator
     * @returns {String} Default: ' | '
     */
    getSeparator() {
        return this.separator;
    }

    /**
     * This method allows you to override default (' | ') separator, which is used when
     * merging few attributions together.
     * @method setSeparator
     * @param {String} separator New separator.
     */

    setSeparator(separator) {
        this.separator = separator;
    }

    _removeMessageBox = () => {
        this._map.removeControl(this._messageBox);
    }

    _attributionElementCallback = () => {
        return copyrightsV2({
            key: this.apiKey
        })
            .then(response => response.data)
            .then(renderCopyrights)
            .then(html => {
                this._messageBox = messageBox({html, removeCallback: this._removeMessageBox});
                this._map.addControl(this._messageBox);
            })
            .catch(err => console.log(err));// eslint-disable-line
    };

    _getCopyrightsCaption() {
        copyrightsCaptionV2({
            key: this.apiKey
        }).then((caption) => {
            this.tomtomCopyrightsCaption = `<a class="tomtomAttribution">${caption.copyrightsCaption}</a>`;
            this.__ttUpdateAttributions();
        }).catch(() => {
            this.retryCount = this.retryCount + 1;
            const time = this.retryCount > RETRY_TIMES_UNTIL_EXTENDED ? RETRY_TIME_EXTENDED : RETRY_TIME;
            this.timeoutId = setTimeout(this._getCopyrightsCaption.bind(this), time);
        });

    }

    _mergeAttributions() {
        let result = this.tomtomCopyrightsCaption;
        if (this.attributions.length > 0) {
            result += this.separator + this.attributions.join(this.separator);
        }
        return result;
    }

    __ttUpdateAttributions() {
        if (this.attributions.length || this.tomtomCopyrightsCaption) {

            if (this._attributionElement) {
                this._attributionElement.removeEventListener('click', this._attributionElementCallback);
            }

            this._container.innerHTML = this._mergeAttributions();
            this._container.classList.remove('mapboxgl-attrib-empty');
            this._setAttributionElement(this._container.querySelector('.tomtomAttribution'));
        } else {
            this._container.classList.add('mapboxgl-attrib-empty');
        }
    }
    _setAttributionElement(value) {
        if (value) {
            value.addEventListener('click', this._attributionElementCallback);
        }

        this._attributionElement = value;
    }
}
