const { Schema, model } = require("mongoose");

const questionSchema = new Schema(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    correctAnswers: [
      {
        type: String,
        required: true,
      },
    ],
    mediaUrl: String, // Optional image/video
  },
  { timestamps: true }
);

const Question = model("Question", questionSchema);
module.exports = Question;
