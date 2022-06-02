const Card = require("../models/Card");
const { NotFound } = require("../errors/NotFoundError");
const { BadRequest } = require("../errors/BadRequestError");
const { Forbidden } = require("../errors/ForbiddenError");

const getCards = (_, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  const id = req.params.cardId;
  const currentUserId = req.user._id;

  Card.findById(id)
    .then((card) => {
      if (!card) {
        throw new NotFound();
      }
      if (card.owner.toHexString() !== currentUserId) {
        throw new Forbidden();
      }
      return card.remove().then(() => res.send({ message: "OK" }));
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        next(new BadRequest("Id is not correct"));
      }
      next(err);
    });
};

const createCard = (req, res, next) => {
  const id = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: id }, { runValidators: true })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const fields = Object.keys(err.errors).join(", ");
        return next(new BadRequest(`${fields} is not correct`));
      }
      return next(err);
    });
};

const updateLikes = (req, res, next, method) => {
  const id = req.params.cardId;
  const userWhoLikedCardId = req.user._id;

  Card.findByIdAndUpdate(
    id,
    { [method]: { likes: userWhoLikedCardId } },
    {
      new: true,
    },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound();
      }
      res.status(200).send({ message: "OK" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        next(new BadRequest(`ID is not correct`));
      }
      next(err);
    });
};

const deleteLike = (req, res, next) => updateLikes(req, res, next, "$pull");
const setLike = (req, res, next) => updateLikes(req, res, next, "$addToSet");

module.exports = {
  getCards,
  createCard,
  deleteCard,
  deleteLike,
  setLike,
};
