import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    trim: true,
    ref: "Event"
  },
  eventName: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: false,
    trim: true,
    ref: "User"
  },
  handle: {
    type: String,
    required: true,
    trim: true
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  rank: {
    type: Number,
    required: true,
    default: 0,
  },
  level: {
    type: Number,
    required: true,
    default: 1,
  },
  levelScore: {
    type: Map,
    of: String,
    default: []
  },
  problemsSolved: {
    type: [{
      type: Map,
      of: String
    }]
  }
}, { timestamps: true });

const Participant = mongoose.model("Participant", participantSchema);
export default Participant;