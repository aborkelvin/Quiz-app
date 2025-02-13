const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user.route");
const cors = require("cors");
const quizRouter = require("./routes/quiz.route");
const questionRouter = require("./routes/question.route");
const resultRouter = require("./routes/result.route");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

//Routes
app.use("/users", userRouter);
app.use("/quiz", quizRouter);
app.use("/questions", questionRouter);
app.use("/results", resultRouter);

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
