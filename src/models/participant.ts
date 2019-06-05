import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: "Event"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: "User"
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
    problemsSolved: {
        type: [{
            type: Map,
            of: String
        }]
    }
}, { timestamps: true });

const Participant = mongoose.model("Participant", participantSchema);
export default Participant;