import mongoose from 'mongoose';
// We'll import and use connectDB in index.js instead of here

const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Food', 'Education', 'Environment', 'Social', 'Health']
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Idea = mongoose.model('ideas', ideaSchema, 'ideas');

export default Idea;
