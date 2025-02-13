const express = require("express");

const { verifyJWTAuthToken, restrictTo } = require("../auth/authFunctions");
const Quiz = require("../models/quiz.model");
const Result = require("../models/result.model");

const resultRouter = express.Router();

// Get all results for a particular user
resultRouter.get("/mine", verifyJWTAuthToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const results = await Result.find({
      userId,
      endTime: { $exists: true },
    }).populate("quizId", "title description");

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: "No results found for this user." });
    }

    res.status(200).json({ success: true, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = resultRouter;
