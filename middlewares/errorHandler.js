module.exports = (err, _, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(err.statusCode).send({
    message: statusCode === 500
      ? "Oooops! Server Error:("
      : message,
  });
  next();
};
