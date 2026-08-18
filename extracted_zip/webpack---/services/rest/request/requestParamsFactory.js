import parameterApplications from 'common/parameterApplications';

function isQueryParameter(fieldEntry) {
    const field = fieldEntry[1];
    return !field.application || field.application === parameterApplications.QUERY;
}

function isPathParam(fieldEntry) {
    const field = fieldEntry[1];
    return field.application === parameterApplications.PATH;
}

function isPostParam(fieldEntry) {
    const field = fieldEntry[1];
    return field.application === parameterApplications.POST;
}

function isOtherParam(fieldEntry) {
    const field = fieldEntry[1];
    return field.application === parameterApplications.OTHER;
}

function isHeaderParam(fieldEntry) {
    const field = fieldEntry[1];
    return field.application === parameterApplications.HEADER;
}

function getFieldEntryNames(fieldEntry) {
    return {
        name: fieldEntry[0],
        fieldName: fieldEntry[2]
    };
}

function toEntry(source) {
    return (fieldName) => {
        const name = (source[fieldName] && source[fieldName].name) || fieldName;
        return [name, source[fieldName], fieldName];
    };
}

function createParamsNames(fields, paramsFilterFunction) {
    let params = Object.keys(fields).map(toEntry(fields));
    params = params.filter(paramsFilterFunction);
    params = params.map(getFieldEntryNames);

    return params;
}

function createQueryParamsNames(fields) {
    return createParamsNames(fields, isQueryParameter);
}

function createPathParamsNames(fields) {
    return createParamsNames(fields, isPathParam);
}

function createPostParamsNames(fields) {
    return createParamsNames(fields, isPostParam);
}

function createOtherParamsNames(fields) {
    return createParamsNames(fields, isOtherParam);
}

function createHeaderParamsNames(fields) {
    return createParamsNames(fields, isHeaderParam);
}

function createParams(fields, createParamNamesFunction, requestOptions) {
    const params = {};
    const paramNames = createParamNamesFunction(fields);
    paramNames.forEach((param) => {
        if (param.fieldName in requestOptions) {
            const field = fields[param.fieldName];
            const paramValue = requestOptions[param.fieldName];
            if (field.cast) {
                field.cast(paramValue, params);
            } else {
                params[param.name] = paramValue;
            }
        }
    });

    return params;
}

export function createRequestParams(fields, requestOptions) {
    return {
        pathParams: createParams(fields, createPathParamsNames, requestOptions),
        queryParams: createParams(fields, createQueryParamsNames, requestOptions),
        postParams: createParams(fields, createPostParamsNames, requestOptions),
        otherParams: createParams(fields, createOtherParamsNames, requestOptions),
        headerParams: createParams(fields, createHeaderParamsNames, requestOptions)
    };
}
