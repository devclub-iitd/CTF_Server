import mongoose from "mongoose";
import jwt, { Secret } from "jsonwebtoken";
import { isEmail } from "validator";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    //unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [ isEmail, "invalid email" ],
    trim: true
  },
  number: {
    type: String,
    trim: true,
  },
  entryNumber: {
    type: String,
    uppercase: true,
    minlength: 11,
    maxlength: 11,
    trim: true,
    index: true,
    default: "XXXXXXXXXXX"
  },
  hostel: {
    type: String,
    uppercase: true,
    minlength: 4,
    maxlength: 15,
    trim: true,
    default: "XXXX"
  },
  gender: {
    type: String,
    enum:  ["male", "female", "Other"],
    default: "female"
  },
  institution: {
    type: String,
    trim: true
  },
  profilePic: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  isAdmin: {
    type: Number,
    required: true,
    default: 0
  },
  events: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    }],
    default: []
  },
  problems: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem"
    }],
    default: []
  },
  participant: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant"
    }],
    default: []
  }
}, { timestamps: true });

userSchema.methods.generateAuthToken = function() {
  const user = this
  try{
    const payload = {user: user.username};
    const options = {expiresIn: '2d', issuer: 'devclub-ctf'};
    //const secret = process.env.JWT_SECRET as Secret;
    const secret = 'secret' as Secret
    const token = jwt.sign(payload, secret, options);
    return token
  }catch(error){
      return console.log(error)
  }
}



const User = mongoose.model("User", userSchema);
export default User;
