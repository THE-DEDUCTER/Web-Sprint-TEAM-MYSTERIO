import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';

export default function(template, values) {
    return template.replace(/\{ *([\w_]+) *\}/g, (_, key) => {
        let value = values[key];

        if (isUndefined(value)) {
            return '{' + key + '}';
        }

        if (isFunction(value)) {
            value = value(key);
        }

        return key === 'query' ? encodeURIComponent(value) : value;
    });
}
