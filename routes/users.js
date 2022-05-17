const router = require("express").Router();
const {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

router.get("/", getUsers);

router.get("/:userId", getUserById);

router.post("/", addUser);

router.patch("/me", updateUser);

router.patch("/me/avatar", updateAvatar);

module.exports = router;
