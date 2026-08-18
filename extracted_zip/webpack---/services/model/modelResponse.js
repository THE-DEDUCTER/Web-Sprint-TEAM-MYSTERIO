export function modelResponse({ data, trackingId }, modelCallback) {
    const modeledResponseData = typeof data === 'string' ? { data } : { ...data };
    const modeledResponse = modelCallback ? modelCallback(data) : modeledResponseData;
    modeledResponse.getTrackingId = () => trackingId || null;

    return modeledResponse;
}
