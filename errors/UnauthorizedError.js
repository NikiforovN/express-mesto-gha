class Unauthorized extends Error {
  constructor(message = "Oooops! Need to login!") {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = {
  Unauthorized,
};
