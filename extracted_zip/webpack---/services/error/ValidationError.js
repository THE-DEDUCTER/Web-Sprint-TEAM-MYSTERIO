export default class ValidationError extends Error {
    constructor(errors, ...params) {
        super(...params);

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
        let consolidatedErrorMessages = '\n';
        errors.forEach(element => {
            consolidatedErrorMessages += element.message + '\n';
        });

        this.errors = errors;
        this.message = 'Validation errors occured: ' + consolidatedErrorMessages;
    }
}
