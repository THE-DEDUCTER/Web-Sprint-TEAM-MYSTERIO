/* eslint-disable max-len */
const origin = 'api.tomtom.com';
const hostedStylesVersion = '22.2.1-*';

module.exports = {
    'sdk.name': 'MapsWebSDK',
    'sdk.version': '6.25.0',
    'sdk.examples.version': 'SDK-${version}',

    'analytics.header.name': 'TomTom-User-Agent',
    'analytics.header.sdkName': 'MapsWebSDK',

    // copyrights
    'endpoints.copyrightsV2': `${origin}/map/2/copyrights`,
    'endpoints.captionV2': `${origin}/map/2/copyrights/caption.{contentType}`,

    // search
    'endpoints.geocode': `${origin}/search/2/geocode/{query}.{contentType}`,
    'endpoints.structuredGeocode': `${origin}/search/2/structuredGeocode.{contentType}`,
    'endpoints.search': `${origin}/search/2/{type}/{query}.{contentType}`,
    'endpoints.nearbySearch': `${origin}/search/2/nearbySearch/.{contentType}`,
    'endpoints.batchNearbySearchQuery': '/{type}/.{contentType}',
    'endpoints.batchSearch': `${origin}/search/2/batch.{contentType}`,
    'endpoints.batchSyncSearch': `${origin}/search/2/batch/sync.{contentType}`,
    'endpoints.batchSearchQuery': '/{type}/{query}.{contentType}',
    'endpoints.batchStructuredGeocodeQuery': '/structuredGeocode.{contentType}',
    'endpoints.adp': `${origin}/search/2/additionalData.{contentType}`,
    'endpoints.batchAdpQuery': '/additionalData.{contentType}',
    'endpoints.reverseGeocode': `${origin}/search/2/{type}/{position}.{contentType}`,
    'endpoints.batchReverseGeocodeQuery': '/{type}/{position}.{contentType}',
    'endpoints.autocomplete': `${origin}/search/2/autocomplete/{query}.{contentType}`,
    'endpoints.poiCategories': `${origin}/search/2/poiCategories.{contentType}`,
    'endpoints.chargingAvailability': `${origin}/search/2/chargingAvailability.{contentType}`,
    'endpoints.batchChargingAvailabilityQuery': '/chargingAvailability.{contentType}',
    'endpoints.placeById': `${origin}/search/2/place.{contentType}`,

    // traffic
    'endpoints.incidentDetailsV5': `${origin}/traffic/services/5/incidentDetails`,
    'endpoints.incidentViewport': `${origin}/traffic/services/4/incidentViewport/0,0,.1,.1/0/0,0,.1,.1/0/false/{contentType}`,
    'endpoints.flowSegmentData': `${origin}/traffic/services/4/flowSegmentData/{style}/{zoom}/{contentType}`,
    'endpoints.incidentRegions': `${origin}/traffic/services/4/incidentRegions/{contentType}`,

    // layers
    'endpoints.rasterTrafficIncidentTilesLayer': `{s}.${origin}/traffic/map/4/tile/incidents/{style}/{z}/{x}/{y}.png?tileSize={tileSize}`,
    'endpoints.vectorTrafficIncidentTilesLayer': `{s}.${origin}/traffic/map/4/tile/incidents/{z}/{x}/{y}.pbf`,
    'endpoints.rasterTrafficFlowTilesLayer': `{s}.${origin}/traffic/map/4/tile/flow/{style}/{z}/{x}/{y}.png`,
    'endpoints.vectorTrafficFlowTilesLayer': `{s}.${origin}/traffic/map/4/tile/flow/{style}/{z}/{x}/{y}.pbf`,
    'endpoints.tileLayer': `{s}.${origin}/map/1/tile/{layer}/{style}/{z}/{x}/{y}.png?tileSize={tileSize}`,
    'endpoints.wmsLayer': `{s}.${origin}/map/1/wms/?service=WMS&version=1.1.1&request=GetMap&bbox={bbox-epsg-3857}&srs=EPSG:3857&width=512&height=512&layers=basic&styles=&format={format}`,
    'endpoints.vectorTileLayer': `{s}.${origin}/map/1/tile/{layer}/{style}/{z}/{x}/{y}.pbf`,
    'endpoints.vectorTileLayerV2': `{s}.${origin}/map/2/tile/{layer}/{z}/{x}/{y}.pbf`,

    // routing
    'endpoints.routing': `${origin}/routing/1/calculateRoute/{locations}/{contentType}`,
    'endpoints.calculateReachableRange': `${origin}/routing/1/calculateReachableRange/{origin}/{contentType}`,
    'endpoints.batchRouting': `${origin}/routing/1/batch/{contentType}`,
    'endpoints.batchSyncRouting': `${origin}/routing/1/batch/sync/{contentType}`,
    'endpoints.batchRoutingQuery': '/calculateRoute/{locations}/{contentType}',
    'endpoints.batchReachableRangeQuery': '/calculateReachableRange/{origin}/{contentType}',
    'endpoints.matrixRouting': `${origin}/routing/1/matrix/{contentType}`,
    'endpoints.matrixSyncRouting': `${origin}/routing/1/matrix/sync/{contentType}`,
    'endpoints.longDistanceEVRouting': `${origin}/routing/1/calculateLongDistanceEVRoute/{locations}/{contentType}`,

    //static map image
    'endpoints.staticImage': `https://${origin}/map/1/staticimage`,

    'vector.glyphs': 'https://' + origin + '/maps-sdk-js/6.25.0/glyphs/{fontstack}/{range}.pbf',
    'vector.sprites': 'https://' + origin + '/maps-sdk-js/6.25.0/sprites/sprite',

    //hosted styles
    'endpoints.styles': `https://${origin}/style/1/style/{version}?map=2/basic_street-light&traffic_incidents=2/incidents_light&traffic_flow=2/flow_relative-light&poi=2/poi_light`,

    'origin': origin,
    'hostedStylesVersion': hostedStylesVersion
};
