const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user.route");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

//Routes
app.use("/users", userRouter);

mongoose
  .connect(process.env.MONGODB_LOCAL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
