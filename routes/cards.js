const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const validator = require("validator");
const {
  getCards,
  createCard,
  deleteCard,
  deleteLike,
  setLike,
} = require("../controllers/cards");

router.get("/", getCards);

router.delete("/:cardId", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), deleteCard);

router.post("/", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom((value) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        throw new Error("Неправильный формат ссылки");
      }
      return value;
    }),
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
