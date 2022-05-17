const User = require("../models/User");

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
    .then((user) => {
      if (req.params.userId !== id) {
        return res.status(400).send({ message: "Id is not correct" });
      }
      return res.status(200).send(user);
    })
    .catch(() => res.status(500).send({ message: "Server Error" }));
};

const addUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const fields = Object.keys(err.errors).join(", ");
        return res.status(400).send({ message: `${fields} is not correct` });
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
      if (err.name === "ValidationError") {
        const fields = Object.keys(err.errors).join(", ");
        return res.status(400).send({ message: `${fields} is not correct` });
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
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const fields = Object.keys(err.errors).join(", ");
        return res.status(400).send({ message: `${fields} is not correct` });
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
};
