import mongoose from 'mongoose';

// Connection is now handled in index.js via db.js

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true
  },
  CreatedAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("users", userSchema, "users");

export default User;
