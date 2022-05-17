const Card = require("../models/Card");
const { errorHandler } = require("./users");

const getCards = (_, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => res.status(500).send({ message: "Server Error" }));
};

const deleteCard = (req, res) => {
  const id = req.params.cardId;

  Card.findByIdAndRemove(id)
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({ message: "Id is not correct" });
      }
      return res.status(500).send({ message: "Server Error" });
    });
};

const createCard = (req, res) => {
  const id = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: id })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (Object.keys(err.errors).join("")) {
        errorHandler(err, req, res);
      }
      return res.status(500).send({ message: "Server Error" });
    });
};

const updateLikes = (req, res, method) => {
  const id = req.params.cardId;
  const userWhoLikedCardId = req.user._id;

  Card.findByIdAndUpdate(
    id,
    { [method]: { likes: userWhoLikedCardId } },
    {
      new: true,
    },
  )
    .then(() => res.status(200).send({ message: "OK" }))
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(400).send({ message: "Id is not correct" });
      }
      return res.status(500).send({ message: "Server Error" });
    });
};

const deleteLike = (req, res) => updateLikes(req, res, "$pull");
const setLike = (req, res) => updateLikes(req, res, "$addToSet");

module.exports = {
  getCards,
  createCard,
  deleteCard,
  deleteLike,
  setLike,
};
