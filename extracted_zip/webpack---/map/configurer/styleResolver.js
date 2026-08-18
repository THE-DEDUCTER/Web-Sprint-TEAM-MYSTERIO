import queryParamUpdater from '../utils/queryParamUpdater';
import {isNil, isObject} from 'lodash';
import mainConfig from 'mainConfig';
import { hostedStyles } from '../endpoints';

function isMapboxObject(style) {
    return isObject(style) && style.version && style.layers && style.sources;
}

function buildURL(style) {
    let url = 'https://' + mainConfig.origin + '/style/1/style/' + mainConfig.hostedStylesVersion;

    if (style.map) {
        url = queryParamUpdater(url, 'map', style.map);
    }

    if (style.trafficIncidents) {
        url = queryParamUpdater(url, 'traffic_incidents', style.trafficIncidents);
    }

    if (style.trafficFlow) {
        url = queryParamUpdater(url, 'traffic_flow', style.trafficFlow);
    }

    if (style.poi) {
        url = queryParamUpdater(url, 'poi', style.poi);
    }

    return url;
}

export default function styleResolver(style) {
    if (isNil(style)) {
        const defaultStyle = hostedStyles.replace('{version}', mainConfig.hostedStylesVersion);
        return defaultStyle;
    } else if (isMapboxObject(style)) {
        return style;
    } else if (isObject(style)) {
        return buildURL(style);
    } else {
        return style;
    }
}
