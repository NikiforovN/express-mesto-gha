const User = require("../models/User");

function errorHandler(err, _, res) {
  const fields = Object.keys(err.errors).join(", ");
  return res.status(400).send({ message: `${fields} is not correct` });
}

const getUsers = (_, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => res.status(500).send({ message: "Server Error" }));
};

const getUserById = (req, res) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({ message: "Id is not correct" });
      }
      return res.status(500).send({ message: "Server Error" });
    });
};

const addUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (Object.keys(err.errors).join("")) {
        errorHandler(err, req, res);
      }
      return res.status(500).send({ message: "Server Error" });
    });
};

const updateUser = (req, res) => {
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
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        errorHandler(err, req, res);
      }
      return res.status(500).send({ message: "Server Error" });
    });
};

const updateAvatar = (req, res) => {
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
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({ message: "Id is not correct" });
      }
      if (Object.keys(err.errors).join("")) {
        errorHandler(err, req, res);
      }
      return res.status(500).send({ message: "Server Error" });
    });
};

module.exports = {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  updateAvatar,
  errorHandler,
};
