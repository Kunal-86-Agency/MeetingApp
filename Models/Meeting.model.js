const mongoose = require("mongoose");

const meetingSchema = mongoose.Schema(
  {
    feedback: { type: mongoose.Schema.Types.ObjectId, ref: "Feedbacks" },
  },
  { timestamps: true }
);

const MeetingModel = mongoose.model("Meetings", meetingSchema);

module.exports = MeetingModel;
