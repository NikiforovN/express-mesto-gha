const express = require("express");
const mongoose = require("mongoose");
const { errors, celebrate, Joi } = require("celebrate");
const {
  addUser,
  login,
} = require("./controllers/users");
const { NotFound } = require("./errors/NotFoundError");
const auth = require("./middlewares/auth");

const app = express();

function errorHandler(err, _, res, next) {
  const { statusCode = 500, message } = err;
  res.status(err.statusCode).send({
    message: statusCode === 500
      ? "Oooops! Server Error:("
      : message,
  });
  next();
}

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(express.json());

app.post("/signin", login);
app.post("/signup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required(),
    password: Joi.string().required().min(4),
  }).unknown(true),
}), addUser);

app.use("/users", auth, require("./routes/users"));
app.use("/cards", auth, require("./routes/cards"));

app.use("", (_, res, next) => next(new NotFound()));
app.use(errors());
app.use(errorHandler);

app.listen(3000);
