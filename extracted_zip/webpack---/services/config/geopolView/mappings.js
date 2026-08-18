/* eslint-disable object-curly-spacing */
/* eslint-disable no-undef */
/**
 * @ignore
 * Store the list of geopolitical views available as key-value pairs.
 *
 * By default, all the entries listed here are supported by the supported services defined
 * in the geopoliticalViewService class.
 * If a view is NOT supported by a service it needs to be added as a fallback here.
 *
 * Note: The Maps service has subTypes. If a view is not supported by a service + subType (ex: maps - raster),
 * we need to add its fallback here.
 */
export default {
    Unified: {
        label: 'Unified'
    },
    IN: {
        label: 'India'
    },
    IL: {
        label: 'Israel'
    },
    MA: {
        label: 'Morocco'
    },
    PK: {
        label: 'Pakistan'
    },
    AR: {
        label: 'Argentina',
        search: {
            fallback: 'Unified'
        }
    },
    Arabic: {
        label: 'Arabic',
        search: {
            fallback: 'Unified'
        },
        reverseGeocoder: {
            fallback: 'Unified'
        }
    },
    RU: {
        label: 'Russia'
    },
    TR: {
        label: 'Turkey'
    },
    CN: {
        label: 'China'
    }
};

export const defaultGeopoliticalView = 'Unified';
export const defaultSubType = 'all';
