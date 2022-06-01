class InternalServerError extends Error {
  constructor(message = "Oooops! Server Error:(") {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = {
  InternalServerError,
};
