import {isString} from 'lodash';

import requester from 'Services/requester/requester';
import queryParamUpdater from 'Map/utils/queryParamUpdater';
import styleCopy from '../style/styleCopy';

class StyleRetriever {
    constructor(key) {
        this._key = key;
        this._cache = {};
    }

    _download = (styleUrl) => {
        let url = styleUrl;

        if (!styleUrl.match(/key=/)) {
            url = queryParamUpdater(url, 'key', this._key);
        }

        const options = {url};
        return requester.get(options).then(response => response.data);
    };

    fetch = async (style) => {
        if (!isString(style)) {
            return styleCopy(style);
        }

        const cachedStyle = this._cache[style];
        if (!cachedStyle) {
            this._cache[style] = await this._download(style);
        }

        return this._cache[style];
    };
}

export default (key) => {
    return new StyleRetriever(key);
};
