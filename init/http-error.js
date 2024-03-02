class HttpError extends Error {
  constructor(message, errorCode) {
    super(message);
    this.statusCode = errorCode || 404;
  }
}

export default HttpError;
