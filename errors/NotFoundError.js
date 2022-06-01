class NotFound extends Error {
  constructor(message = "Oooops! Not Found:(") {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = {
  NotFound,
};
