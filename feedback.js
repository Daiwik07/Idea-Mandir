import mongoose from "mongoose";
// Connection is now handled in index.js via db.js

const feedbackSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model("feedback", feedbackSchema, "feedback");

export default Feedback;
