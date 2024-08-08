class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something Went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;
        stack
            ? (this.stack = stack)
            : Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;
