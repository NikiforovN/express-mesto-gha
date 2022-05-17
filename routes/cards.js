const router = require("express").Router();
const {
  getCards,
  createCard,
  deleteCard,
  deleteLike,
  setLike,
} = require("../controllers/cards");

router.get("/", getCards);

router.delete("/:cardId", deleteCard);

router.post("/", createCard);

router.put("/:cardId/likes", setLike);

router.delete("/:cardId/likes", deleteLike);

module.exports = router;
