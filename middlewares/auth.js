const jwt = require("jsonwebtoken");
const { Unauthorized } = require("../errors/UnauthorizedError");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new Unauthorized());
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, "super-strong-secret");
  } catch (err) {
    next(new Unauthorized());
  }

  req.user = payload;

  return next();
};
