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
    content: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    points: {
        type: Map,
        of: String,
        required: true,
    },
    category: {
        type: String,
        enum: ["Web Exploits", "Binary Exploits", "Cipher-Decipher"]
    },
    isActive: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const problem = mongoose.model("Problem", problemSchema);
export default problem;