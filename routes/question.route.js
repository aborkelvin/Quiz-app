const express = require("express");

const { verifyJWTAuthToken, restrictTo } = require("../auth/authFunctions");
const Quiz = require("../models/quiz.model");
const Question = require("../models/question.model");
const upload = require("../utils/multerConfig");

const questionRouter = express.Router();

// Create question based on quiz
questionRouter.post("/:quizId/quiz", verifyJWTAuthToken, async (req, res) => {
  try {
    const { title, options, correctAnswers, mediaUrl } = req.body;
    const question = await Question.create({
      quizId: req.params.quizId,
      title,
      options,
      correctAnswers,
      mediaUrl,
    });

    await Quiz.findByIdAndUpdate(req.params.quizId, {
      $push: { questions: question._id },
    });

    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to create question with quiz id and media. Disable the above one
questionRouter.post(
  "/:quizId/quiz/media",
  verifyJWTAuthToken,
  restrictTo(["creator"]),
  upload.single("media"),
  async (req, res) => {
    try {
      //const { title } = req.body;
      console.log(req.body);
      const mediaUrl = req.file ? req.file.path : null; // Cloudinary URL

      const question = await Question.create({
        ...req.body,
        quizId: req.params.quizId,
        mediaUrl,
      });

      res.status(201).json({ success: true, question });
    } catch (error) {
      res.status(500).json({ error: "Something went wrong!" });
    }
  }
);

module.exports = questionRouter;
