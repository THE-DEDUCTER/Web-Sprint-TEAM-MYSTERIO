import mainConfig from 'mainConfig';
const sdkInfo = mainConfig['analytics.header.sdkName'] + '/' + mainConfig['sdk.version'];
const headerName = mainConfig['analytics.header.name'];

const getGlobalAnalytics = () => {
    global.__tomtomAnalyticsInfo_ = global.__tomtomAnalyticsInfo_ ? global.__tomtomAnalyticsInfo_ : {};
    return global.__tomtomAnalyticsInfo_;
};

export const getHeaderName = () => headerName;

export const getHeaderContent = () => {
    const prodInfo = getGlobalAnalytics().productInfo !== undefined ? ' ' + getGlobalAnalytics().productInfo : '';
    return sdkInfo + prodInfo;
};

export const setProductInfo = (productId, productVersion) => {
    if (!productId) {
        throw new Error('ProductId needs to be set');
    }
    const prodVersion = productVersion || productVersion === 0 ? '/' + productVersion : '';
    getGlobalAnalytics().productInfo = productId + prodVersion;
};

export const getProductInfo = () => getGlobalAnalytics().productInfo;

export const addAnalyticsHeader = (req) => {
    req.header(headerName, getHeaderContent());
    return req;
};

export const getAnalyticsHeader = () => {
    const header = {};
    header[headerName] = getHeaderContent();
    return header;
};
