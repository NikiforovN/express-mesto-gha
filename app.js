const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(express.json());

app.use((req, _, next) => {
  req.user = {
    _id: "628111b93d9a2b3a124e5aa7",
  };
  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.listen(3000);
