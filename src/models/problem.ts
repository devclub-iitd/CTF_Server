import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
    default: "easy"
  },
  author: {
    type: String,
    required: true,
    trim: true
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
  score: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ["Web Exploits", "Binary Exploits", "Cipher-Decipher"]
  },
  isActive: {
    type: Number,
    required: true
  },
  name: {
    type:String,
    required: true
  },
  userSolved: {
    type: Number,
    required: true 
  }
}, { timestamps: true });

const problem = mongoose.model("Problem", problemSchema);
export default problem;