'use strict';
import mainConfig from 'mainConfig';

export const origin = mainConfig.origin;
export const rasterTileLayer = mainConfig['endpoints.tileLayer'];
export const wmsLayer = mainConfig['endpoints.wmsLayer'];
export const vectorTileLayer = mainConfig['endpoints.vectorTileLayer'];
export const vectorTileLayerV2 = mainConfig['endpoints.vectorTileLayerV2'];
export const rasterTrafficFlowLayer = mainConfig['endpoints.rasterTrafficFlowTilesLayer'];
export const vectorTrafficFlowLayer = mainConfig['endpoints.vectorTrafficFlowTilesLayer'];
export const rasterTrafficIncidentTilesLayer = mainConfig['endpoints.rasterTrafficIncidentTilesLayer'];
export const vectorTrafficIncidentTilesLayer = mainConfig['endpoints.vectorTrafficIncidentTilesLayer'];

//hosted styles
export const hostedStyles = mainConfig['endpoints.styles'];
export const hostedTrafficStyles = mainConfig['endpoints.trafficStyles'];
