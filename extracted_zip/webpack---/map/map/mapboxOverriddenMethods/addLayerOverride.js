export default {
    addLayer: function(layer, beforeId) {
        /**
         * This code solves problem with default fonts set by Mapbox. This results in calls to non existent assets.
         * We are overriding this default when user add a layer, because style spec (which contains defaults) is
         * private, which means we can't override it here.
         * Reference: https://jira.tomtomgroup.com/browse/LNS-40669
         */
        if (layer && layer.type === 'symbol' && layer.layout && layer.layout['text-font'] === undefined) {
            layer.layout['text-font'] = ['Noto-Bold'];
        }
        this.__om.addLayer(layer, beforeId);
        return this.__om;
    }
};
