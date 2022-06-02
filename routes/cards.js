const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getCards,
  createCard,
  deleteCard,
  deleteLike,
  setLike,
} = require("../controllers/cards");
const regEx = require("../models/User");

router.get("/", getCards);

router.delete("/:cardId", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), deleteCard);

router.post("/", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(new RegExp(regEx)),
  }),
}), createCard);

router.put("/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), setLike);

router.delete("/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), deleteLike);

module.exports = router;
