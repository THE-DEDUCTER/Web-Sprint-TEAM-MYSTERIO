import parameterApplications from 'common/parameterApplications';

const fieldName = 'contentType';

export function setField(fields) {
    const copiedFields = Object.assign({}, fields);
    copiedFields[fieldName] = {
        application: parameterApplications.PATH
    };
    return copiedFields;
}

export function setValue(requestOptions) {
    requestOptions[fieldName] = requestOptions[fieldName] || 'json';
    return requestOptions;
}
