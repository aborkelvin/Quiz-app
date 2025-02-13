const { Schema, model } = require("mongoose");

const resultSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    score: {
      type: Number,
      default: 0, // Default score before submission
    },
    answers: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Question",
        },
        selectedOption: String,
      },
    ],
    timeTaken: {
      type: Number, // In seconds
    },
    startTime: {
      type: Date, // When the user starts the quiz
    },
    endTime: {
      type: Date, // When the user submits the quiz
    },
    attempts: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Result = model("Result", resultSchema);
module.exports = Result;
