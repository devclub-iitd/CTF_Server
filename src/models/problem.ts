import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  difficulty: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
    default: "easy"
  },
  author: {
    type: String,
    required: true,
    trim: true,
    default: 'Anonymous'
  },
  details: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: Number,
    required: true,
    default: 1
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  category: {
    type: String,
    enum: ["Web Exploits", "Binary Exploits", "Cipher-Decipher"]
  },
  isActive: {
    type: Number,
    required: true, // 0 for do not display, 1 for practice, 2 for competition
    default: 1
  },
  name: {
    type:String,
    required: true
  },
  userSolved: {
    type: Number,
    required: true ,
    default: 0
  }
}, { timestamps: true });

const problem = mongoose.model("Problem", problemSchema);
export default problem;