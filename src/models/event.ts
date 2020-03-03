import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  showLeaderboard: {
    type: Boolean,
    //required: true,
    default: true
  },
  organiser: {
    type: String,
    required: true,
    trim: true,
    default: 'Anonymous'
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  isOngoing: {
    type: Boolean,
    required: true,
    default: false
  },
  challenges: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem"
    }],
    default: []
  },
  scoringMech: {
    type: String,
    required: true,
    enum: ["static", "dynamic"],
    default: "static"
  },
  participants: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant"
    }],
    default: []
  },
  level: {
    type: Number,
    required: true,
    default: 1
  },
  levelScore: {
    type: String,
    required: true,
    default: ""
  },
  leaderboard: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant"
    }],
    default: []
  },
  details: {
    type:String,
    required: true
  }
}, { timestamps: true });


const event = mongoose.model("Event", eventSchema);
export default event;