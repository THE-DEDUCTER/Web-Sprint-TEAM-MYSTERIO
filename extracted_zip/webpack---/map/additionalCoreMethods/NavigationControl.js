/**
 * @namespace Maps
 */

/**
 *
 * @class NavigationControl
 * @description A NavigationControl control contains zoom buttons and a compass.
 * @example
 * ```javascript
 * var nav = new tt.NavigationControl({});
 * map.addControl(nav, 'top-left');
 * ```
 * @constructor
 * @param {Object} [options] Object with options
 * @param {Boolean} [options.showZoom=true] If true the zoom-in and zoom-out buttons are included.
 * @param {Boolean} [options.showCompass=true] If true the compass button is included.
 * @param {Boolean} [options.showExtendedRotationControls=false] If true the rotation buttons are included.
 * @param {Boolean} [options.rotationStep=10] The number of degrees the map rotates per click
 * @param {Boolean} [options.showPitch=false] If true the pitch button is included.
 * @param {Boolean} [options.showExtendedPitchControls=false] If true the rotation buttons are included.
 * @param {Boolean} [options.pitchStep=10] The number of degrees the map tilts per click
 */

import mapboxGl from 'mapbox-gl';
import { NavigationButton } from './NavigationButton';
import { createElem } from '../utils/dom';

import tiltControlSVG from 'Assets/svg/map/pitch.svg';
import tiltUpControlSVG from 'Assets/svg/map/ic_tilt_up.svg';
import tiltDownControlSVG from 'Assets/svg/map/ic_tilt_down.svg';
import rotateRightControlSVG from 'Assets/svg/map/ic_rotate_right.svg';
import rotateLeftControlSVG from 'Assets/svg/map/ic_rotate_left.svg';
import resetControlSVG from 'Assets/svg/map/ic_reset.svg';

function createElemFromHTML(html) {
    const elem = createElem('div');
    elem.innerHTML = html;
    return elem;
}

const mapboxControlGrpClass = 'mapboxgl-ctrl mapboxgl-ctrl-group extended-navigation-group';

const defaultOptions = {
    showRotation: false,
    showExtendedRotationControls: false,
    showExtendedPitchControls: false,
    rotationStep: 10,
    pitchStep: 10
};

export class NavigationControl extends mapboxGl.NavigationControl {
    constructor(options = {}) {
        super(Object.assign({}, defaultOptions, options));

        this.activeEventListeners = {};

        this._extendedControlsContainer = createElem('div');
        this._extendedControlsContainer.appendChild(this._container);
        this._container = this._extendedControlsContainer;

        if (this.options.showCompass && this.options.showExtendedRotationControls) {
            this._appendRotationButtons();
        }

        if (this.options.showPitch) {
            this._appendPitchButtons();
        }

        this.state = {
            rotationControlsOpen: false,
            pitchControlsOpen: false
        };
    }

    _appendRotationButtons = () => {
        const innerContainer = createElem('div', mapboxControlGrpClass, this._container);

        this._compass.parentNode.removeChild(this._compass);
        this._compass = this._createCompassElem();
        innerContainer.appendChild(this._compass);

        this._rotateRightButton = new NavigationButton({
            label: 'Rotate right',
            parentContainer: innerContainer,
            contentElem: createElemFromHTML(rotateRightControlSVG)
        });
        this.activeEventListeners._rotateRightButton = this._changePerspective('bearing', -this.options.rotationStep);
        this._rotateRightButton.addClickListener(this.activeEventListeners._rotateRightButton);

        this._rotateLeftButton = new NavigationButton({
            label: 'Rotate left',
            parentContainer: innerContainer,
            contentElem: createElemFromHTML(rotateLeftControlSVG)
        });
        this.activeEventListeners._rotateLeftButton = this._changePerspective('bearing', this.options.rotationStep);
        this._rotateLeftButton.addClickListener(this.activeEventListeners._rotateLeftButton);

        this._rotateResetButton = new NavigationButton({
            label: 'Reset',
            parentContainer: innerContainer,
            contentElem: createElemFromHTML(resetControlSVG)
        });
        this.activeEventListeners._rotateResetButton = e => this._map.resetNorth({}, {originalEvent: e});
        this._rotateResetButton.addClickListener(this.activeEventListeners._rotateResetButton);
    }

    _createCompassElem = () => {
        this._compassRef = new NavigationButton({
            className: 'mapboxgl-ctrl-compass',
            label: 'Open/Reset rotation',
            alwaysShow: true
        });
        this.activeEventListeners._compassRef = () => this._rotateControlsToggle(!this.state.rotationControlsOpen);
        this._compassRef.addClickListener(this.activeEventListeners._compassRef);
        this._compassIcon = createElem('span', 'mapboxgl-ctrl-icon', this._compassRef.getElement());

        return this._compassRef.getElement();
    }

    _appendPitchButtons = () => {
        const innerContainer = createElem('div', mapboxControlGrpClass, this._container);

        this._pitchControl = new NavigationButton({
            label: 'Open/Reset pitch',
            alwaysShow: true,
            contentElem: createElemFromHTML(tiltControlSVG)
        });
        this.activeEventListeners._pitchControl = () => {
            if (this.options.showExtendedPitchControls) {
                this._pitchControllsToggle(!this.state.pitchControlsOpen);
            } else {
                this._map.easeTo({ pitch: 0 });
            }
        };
        this._pitchControl.addClickListener(this.activeEventListeners._pitchControl);

        innerContainer.appendChild(this._pitchControl.getElement());

        if (this.options.showExtendedPitchControls) {
            this._increasePitchButton = new NavigationButton({
                label: 'Increase pitch',
                parentContainer: innerContainer,
                contentElem: createElemFromHTML(tiltDownControlSVG)
            });
            this.activeEventListeners._increasePitchButton = this._changePerspective('pitch', this.options.pitchStep);
            this._increasePitchButton.addClickListener(this.activeEventListeners._increasePitchButton);

            this._decreasePitchButton = new NavigationButton({
                label: 'Decrease pitch',
                parentContainer: innerContainer,
                contentElem: createElemFromHTML(tiltUpControlSVG)
            });
            this.activeEventListeners._decreasePitchButton = this._changePerspective('pitch', -this.options.pitchStep);
            this._decreasePitchButton.addClickListener(this.activeEventListeners._decreasePitchButton);

            this._pitchResetButton = new NavigationButton({
                label: 'Reset',
                parentContainer: innerContainer,
                contentElem: createElemFromHTML(resetControlSVG)
            });
            this.activeEventListeners._pitchResetButton = () => this._map.easeTo({ pitch: 0 });
            this._pitchResetButton.addClickListener(this.activeEventListeners._pitchResetButton);
        }
    }

    _rotateControlsToggle = (open) => {
        const method = open ? 'show' : 'hide';
        this._rotateResetButton[method]();
        this._rotateRightButton[method]();
        this._rotateLeftButton[method]();
        this.state.rotationControlsOpen = open;
    }

    _pitchControllsToggle = (open) => {
        const method = open ? 'show' : 'hide';
        this._pitchResetButton[method]();
        this._increasePitchButton[method]();
        this._decreasePitchButton[method]();
        this.state.pitchControlsOpen = open;
    }

    _changePerspective = (perspective, step) => (e) => {
        const options = {};
        options[perspective] =
            (perspective === 'pitch' ? this._map.getPitch() : this._map.getBearing()) + step;
        this._map.easeTo(options, {originalEvent: e});
    };

    onRemove() {
        Object.keys(this.activeEventListeners).forEach((buttonRef) => {
            this[buttonRef].removeClickListener(this.activeEventListeners[buttonRef]);
        });

        super.onRemove();
    }
}
