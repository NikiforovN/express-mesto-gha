const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { NotFound } = require("../errors/NotFoundError");
const { BadRequest } = require("../errors/BadRequestError");
const { Unauthorized } = require("../errors/UnauthorizedError");
const { Conflict } = require("../errors/ConflictError");

const getUsers = (_, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const id = req.params.userId;

  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFound();
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return next(new BadRequest("Oooops! Id is not correct"));
      }
      return next(err);
    });
};

const addUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then(({ name,
        about,
        avatar,
        email, }) => {
        res.status(201).send({
          name,
          about,
          avatar,
          email,
        });
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          const fields = Object.keys(err.errors).join(", ");
          return next(new BadRequest(`${fields} is not correct`));
        }
        if (err.code === 11000) {
          return next(new Conflict("This email is already taken:("));
        }
        return next(err);
      }));
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(
    id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const fields = Object.keys(err.errors).join(", ");
        return next(new BadRequest(`${fields} is not correct`));
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(
    id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const fields = Object.keys(err.errors).join(", ");
        return next(new BadRequest(`${fields} is not correct`));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, "super-strong-secret", { expiresIn: "7d" }),
      });
      return user;
    })
    .catch(() => next(new Unauthorized()));
};

const getCurrentUser = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const payload = jwt.verify(token, "super-strong-secret");
  User.findById(payload)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
