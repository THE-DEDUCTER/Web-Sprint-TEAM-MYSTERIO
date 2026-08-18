import { createElem } from '../utils/dom';

const buttonClass = 'navigation-button';

export class NavigationButton {
    constructor({className, label, parentContainer, alwaysShow, contentElem}) {
        const classList = [buttonClass, className];

        if (!alwaysShow) {
            classList.push('-hide');
        }

        if (label === 'Reset') {
            classList.push('-reset');
        }

        this._buttonElem = this._createButton(classList.join(' '), label, parentContainer);

        if (contentElem) {
            this._buttonElem.appendChild(contentElem);
        }
    }

    _createButton = (className, ariaLabel, container) => {
        const button = createElem('button', className, container);
        button.type = 'button';
        button.title = ariaLabel;
        button.setAttribute('aria-label', ariaLabel);
        return button;
    }

    addClickListener(callback) {
        this._buttonElem.addEventListener('click', callback);
    }

    removeClickListener(callback) {
        this._buttonElem.removeEventListener('click', callback);
    }

    getElement() {
        return this._buttonElem;
    }

    hide() {
        this._buttonElem.classList.add('-hide');
    }

    show() {
        this._buttonElem.classList.remove('-hide');
    }
}
