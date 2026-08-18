import TomTomAttributionControl from '../display/attribution/tomTomAttributionControl';

export default async (mapsKey, controlPosition = 'bottom-right', map) => {
    const attribution = new TomTomAttributionControl(mapsKey);
    map.addControl(attribution, controlPosition);
    map._attributionControl = attribution;
};
