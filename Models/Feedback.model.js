const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    feedback: { type: String },
  },
  { timestamps: true }
);

const FeedbackModel = mongoose.model("Feedbacks", feedbackSchema);

module.exports = FeedbackModel;
