class Forbidden extends Error {
  constructor(message = "Oooops! You can delete only your own card:(") {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = {
  Forbidden,
};
