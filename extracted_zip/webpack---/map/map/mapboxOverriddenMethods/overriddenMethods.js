import addLayerOverride from './addLayerOverride';
import fitBoundsOverride from './fitBoundsOverride';
import CUSTOM_EVENTS from '../../utils/events/customEvents';
import styleResolver from '../../configurer/styleResolver';

const tranformEventName = (eventName) => eventName === 'load' ? CUSTOM_EVENTS.MAP_LOAD : eventName;

export const overriddenMethods = {
    setStyle(style) {
        const resolvedStyle = styleResolver(style);
        this._initializeStyle(resolvedStyle);
        return this;
    },
    addLayer: addLayerOverride.addLayer,
    once(eventName, ...args) {
        this.__om.once(tranformEventName(eventName), ...args);
        return this;
    },
    on(eventName, ...args) {
        this.__om.on(tranformEventName(eventName), ...args);
        return this;
    },
    off(eventName, ...args) {
        this.__om.off(tranformEventName(eventName), ...args);
        return this;
    },
    fitBounds: fitBoundsOverride.fitBounds
};
