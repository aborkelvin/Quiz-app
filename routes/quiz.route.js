const express = require("express");

const { verifyJWTAuthToken, restrictTo } = require("../auth/authFunctions");
const Quiz = require("../models/quiz.model");
const Result = require("../models/result.model");
const Question = require("../models/question.model");
const upload = require("../utils/multerConfig");

const quizRouter = express.Router();

// Create a quiz. Disable later
quizRouter.post("/", verifyJWTAuthToken, async (req, res) => {
  try {
    const { title, description, settings } = req.body;
    console.log(req.user);
    const quiz = await Quiz.create({
      title,
      description,
      creator: req.user._id,
      settings,
    });
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Create quiz with questions once and media too
quizRouter.post(
  "/media",
  verifyJWTAuthToken,
  restrictTo(["creator"]),
  upload.any(), // Accept any number of files
  async (req, res) => {
    try {
      const { title, description, settings } = req.body;
      let questions = req.body.questions;

      // Create Quiz
      const quiz = await Quiz.create({
        title,
        description,
        creator: req.user._id,
        settings,
      });

      let createdQuestions = [];

      // Handle questions
      if (questions) {
        // Ensure questions is an array
        if (!Array.isArray(questions)) {
          questions = [questions];
        }

        //console.log("There are questions" + questions[0].media);
        //console.log(req.file);
        console.log(req.files);

        createdQuestions = await Promise.all(
          questions.map(async (q, index) => {
            let mediaUrl = null;

            // Find the corresponding file for the question
            if (req.files) {
              console.log("Found files one");
              const mediaFile = req.files.find(
                (file) => file.fieldname === `questions[${index}][media]`
              );
              if (mediaFile) {
                console.log("Found media file");
                mediaUrl = mediaFile.path;
              }
            }
            /*  const mediaFile = req.files.find(
              (file) => file.fieldname === `questions[${index}][media]`
            );

            if (mediaFile) {
              mediaUrl = mediaFile.path;
            } */

            const question = await Question.create({
              title: q.title,
              options: q.options,
              correctAnswers: q.correctAnswers,
              quizId: quiz._id,
              mediaUrl,
            });

            // Add question to quiz
            await Quiz.findByIdAndUpdate(quiz._id, {
              $push: { questions: question._id },
            });

            return question;
          })
        );
      }

      quiz.questions = createdQuestions;

      res.status(201).json({ success: true, quiz });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong!" });
    }
  }
);

// Get all quizzes
quizRouter.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate("creator", "username")
      .populate("questions");
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a quiz by ID
quizRouter.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("questions");
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.status(200).json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a quiz
quizRouter.delete("/:id", verifyJWTAuthToken, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    if (quiz.creator.toString() !== req.user._id)
      return res.status(403).json({ error: "Unauthorized" });

    await quiz.deleteOne();
    res.status(200).json({ message: "Quiz deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start a quiz
quizRouter.post("/:id/start", verifyJWTAuthToken, async (req, res) => {
  try {
    const quizId = req.params.id;
    const userId = req.user._id;

    // Check if the user has already started this quiz
    const maxAttempts = 10;
    const existingAttempt = await Result.findOne({ userId, quizId }).sort({
      createdAt: -1,
    });
    if (existingAttempt && existingAttempt.attempts >= maxAttempts) {
      return res
        .status(400)
        .json({ message: "You have reached the maximum number of attempts." });
    }

    const attempts = existingAttempt ? existingAttempt.attempts + 1 : 1;

    const startTime = new Date();
    const result = await Result.create({
      userId,
      quizId,
      startTime,
      attempts,
    });

    res
      .status(201)
      .json({ message: "Quiz started", resultId: result._id, attempts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Submit a quiz
quizRouter.post("/:id/submit", verifyJWTAuthToken, async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.user._id;
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId).populate("questions");
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    const result = await Result.findOne({ userId, quizId }).sort({
      createdAt: -1,
    });
    if (!result || !result.startTime) {
      return res
        .status(400)
        .json({ message: "User hasn't started this quiz." });
    }

    if (result.endTime) {
      return res
        .status(400)
        .json({ message: "This quiz attempt has already been submitted." });
    }

    // Time calculation
    const endTime = new Date();
    const timeTaken = Math.floor((endTime - result.startTime) / 1000); // in seconds

    // Scoring logic
    let score = 0;
    quiz.questions.forEach((question) => {
      const userAnswer = answers.find((a) => a.questionId == question._id);
      if (
        userAnswer &&
        question.correctAnswers.includes(userAnswer.selectedOption)
      ) {
        score += quiz.settings.pointsPerQuestion;
      }
    });

    // Update the result with score, answers, and time taken
    result.score = score;
    result.answers = answers;
    result.timeTaken = timeTaken;
    result.endTime = endTime;
    await result.save();

    res.status(201).json({ message: "Quiz submitted", score, result: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Submit a quiz
/* quizRouter.post("/:id/submit", verifyJWTAuthToken, async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id).populate("questions");

    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((question) => {
      const userAnswer = answers.find((a) => a.questionId == question._id);
      //console.log(question);
      //console.log(userAnswer);
      if (
        userAnswer &&
        question.correctAnswers.includes(userAnswer.selectedOption)
      ) {
        score += quiz.settings.pointsPerQuestion;
      }
    });

    const result = await Result.create({
      userId: req.user._id,
      quizId: quiz._id,
      score,
      answers,
      timeTaken: req.body.timeTaken,
    });

    return res
      .status(201)
      .json({ message: "Quiz submitted", score, result: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}); */

// Get all the results for a quiz
quizRouter.get("/:id/results", verifyJWTAuthToken, async (req, res) => {
  try {
    const quizId = req.params.id;

    const results = await Result.find({
      quizId,
      endTime: { $exists: true },
    }).populate("userId", "name email");

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: "No results found for this quiz." });
    }

    res.status(200).json({ success: true, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all result for a user for a particular quiz
quizRouter.get("/:id/results/mine", verifyJWTAuthToken, async (req, res) => {
  try {
    const quizId = req.params.id;
    const userId = req.user._id;

    const result = await Result.find({
      quizId,
      userId,
      endTime: { $exists: true },
    }).populate("userId", "username email");

    if (!result) {
      return res
        .status(404)
        .json({ message: "No result found for this user." });
    }

    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = quizRouter;
