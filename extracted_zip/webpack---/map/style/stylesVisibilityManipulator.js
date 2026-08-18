const styleNameToSourceMapping = {
    map: 'vectorTiles',
    trafficFlow: 'vectorTilesFlow',
    trafficIncidents: 'vectorTilesIncidents',
    poi: 'poiTiles'
};

export default {
    setInitialLayersVisibility: function(style, layersVisiblity) {
        for (const styleName in layersVisiblity) {
            const isLayerSetVisibile = layersVisiblity[styleName] === true;
            if (!isLayerSetVisibile) {
                const sourceName = styleNameToSourceMapping[styleName];
                this._updateLayersWithSource(style, sourceName, (layer) => {
                    layer.layout = layer.layout || {};
                    layer.layout.visibility = 'none';
                });
            }
        }
    },

    hide: function(map, layerSet) {
        this._updateLayerSetVisibility(map, layerSet, 'none');
    },

    show: function(map, layerSet) {
        this._updateLayerSetVisibility(map, layerSet, 'visible');
    },

    _updateLayerSetVisibility: function(map, layerSet, visibility) {
        const style = map.getStyle();
        const sourceName = styleNameToSourceMapping[layerSet];
        this._updateLayersWithSource(style, sourceName, (layer) => {
            map.setLayoutProperty(layer.id, 'visibility', visibility, { validate: false });
        });
        map.__om._update(true);
    },

    _updateLayersWithSource: function(style, sourceName, callback) {
        style.layers.forEach((layer) => {
            if (layer.source === sourceName) {
                callback(layer);
            }
        });
    }
};
