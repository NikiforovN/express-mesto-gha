const express = require("express");
const mongoose = require("mongoose");
const { errors, celebrate, Joi } = require("celebrate");
const validator = require("validator");
const {
  addUser,
  login,
} = require("./controllers/users");
const { NotFound } = require("./errors/NotFoundError");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(express.json());

app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post("/signup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        throw new Error("Неправильный формат ссылки");
      }
      return value;
    }),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), addUser);

app.use("/users", auth, require("./routes/users"));
app.use("/cards", auth, require("./routes/cards"));

app.use("", auth, (_, res, next) => next(new NotFound()));
app.use(errors());
app.use(errorHandler);

app.listen(3000);
