import { debounce } from 'lodash';

const styles = {
    container: `
        background: white;
        border-radius: 2px;
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.4);
        margin: 0;
        overflow: hidden;
        padding: 40px 20px 20px;
        position: absolute;
        transform: translate(-50%, -50%);
        width: 70%;
        z-index: 9999;
        max-width: 700px;`,
    content: `
        overflow-y: auto;
        max-height: 100%;
        pointer-events: all;
        word-break: break-word`,
    closeButton: `
        position: fixed;
        top: 15px;
        right: 15px;
        border: 0;
        background: none;
        color: #c3c3c3;
        font-weight: bold;
        font: 16px/14px Tahoma, Verdana, sans-serif;
        cursor: pointer;
        outline: none;`
};

/**
 * Message box is used to show a message over the map.
 * @class MessageBox
 * @private
 * @constructor
 * @param {Object} [options]
 * @param {Boolean} [options.closeable=true] Show the close button.
 * @param {Number} [options.closeAfter=0] The number of milliseconds after which the control will be automatically
 *     closed. If the value is `0` it will not be closed automatically which is the default behaviour.
 * @param {HTMLElement} [options.html] HTMLElement to be a content of the message box.
 * @param {String} [options.content] Text to be a content of the message box.
 * @example
 * ```javascript
 * var html = '<h1>Message</h1>';
 * var messageBox = new MessageBox({html: html});
 * map.addControl(messageBox);
 * ```
 */

const RESIZE_DEBOUNCE_DELAY = 50;

class MessageBox {
    defaultOptions = {
        closeAfter: 0,
        closeable: true
    }
    constructor(options = {}) {
        this.options = {...this.defaultOptions, ...options};

        this._resizeHandler = debounce(this._setMessageBoxSize, RESIZE_DEBOUNCE_DELAY);
        this._removeCallback = options.removeCallback;
    }
    getDefaultPosition = () => {
        return 'top-left';
    }

    _setMessageBoxSize = () => {
        const top = this._mapContainer.offsetHeight / 2;
        const left = this._mapContainer.offsetWidth / 2;
        const height = this._mapContainer.offsetHeight - 340;
        const width = this._mapContainer.offsetWidth * 0.7;

        this._container.style.top = `${top}px`;
        this._container.style.left = `${left}px`;
        this._container.style.height = `${height}px`;
        this._container.style.width = `${width}px`;
    }

    _registerEvents = () => {
        this._map.on('resize', this._resizeHandler);
    }

    _deregisterEvents = () => {
        this._map.off('resize', this._resizeHandler);

    }
    onAdd = (map) => {
        this._map = map;
        this._mapContainer = map.getContainer();
        const container = this._mapContainer.querySelector('.message-box');

        if (container) {
            this._container = container;

            this._closeButton = container.querySelector('.message-box__close-button');

            if (this.options.closeable && !this._closeButton) {
                this._createCloseButton();
            } else if (!this.options.closeable && this._closeButton) {
                this._container.removeChild(this._closeButton);
            }

            this._content = container.querySelector('.message-box__content');
        } else {
            this._container = document.createElement('div');
            this._container.setAttribute('style', styles.container);
            this._container.classList.add('message-box', 'mapboxgl-ctrl');

            if (this.options.closeable) {
                this._createCloseButton();
            }

            this._content = document.createElement('div');
            this._content.setAttribute('style', styles.content);
            this._content.classList.add('message-box__content');
            this._container.appendChild(this._content);
        }

        if (this.options.html) {
            this._content.innerHTML = this.options.html;
        } else if (this.options.text) {
            this._content.innerText = this.options.text;
        }

        if (this.options.closeAfter > 0) {
            this._closeTimeout = setTimeout(this.onRemove.bind(this), this.options.closeAfter);
        }

        this._setMessageBoxSize();
        this._registerEvents();

        return this._container;
    }
    onRemove = () => {
        if (this._closeTimeout) {
            this._closeTimeout = clearTimeout(this._closeTimeout);
        }
        if (this._closeButton) {
            this._closeButton.removeEventListener('click', this.onRemove);
        }

        this._deregisterEvents();

        this._container.parentElement.removeChild(this._container);

        this._map = null;
    }

    _createCloseButton = () => {
        this._closeButton = document.createElement('button');
        this._closeButton.setAttribute('style', styles.closeButton);
        this._closeButton.classList.add('message-box__close-button');
        this._closeButton.innerText = '×';

        this._closeButton.addEventListener('click', this._removeCallback);

        this._container.appendChild(this._closeButton);
    }
}

export default (options) => {
    return new MessageBox(options);
};
