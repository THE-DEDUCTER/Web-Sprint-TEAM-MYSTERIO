import { LngLatBounds } from 'mapbox-gl';

export default {
    fitBounds: function(bounds, options) {

        //handling antimeridian
        bounds = LngLatBounds.convert(bounds);
        const south = bounds.getSouth(),
            west = bounds.getWest(),
            north = bounds.getNorth(),
            east = west + difference(bounds.getEast(), west);

        this.__om.fitBounds(new LngLatBounds([
            [ west, south ],
            [ east, north ]
        ]), options);
    }
};

function difference(a, b) {
    return 180 - Math.abs(Math.abs(a - b) - 180);
}
