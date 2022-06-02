const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const validator = require("validator");
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.get("/:userId", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }),
}), getUserById);

router.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);
router.patch("/me/avatar", celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        throw new Error("Неправильный формат ссылки");
      }
      return value;
    }),
  }),
}), updateAvatar);

module.exports = router;
