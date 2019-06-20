import mongoose  from "mongoose";
import Problem from "../models/problem";
import User from "../models/user";
import Participant from "../models/participant";
import Event from "../models/event";

const users = [
  {
    _id: mongoose.Types.ObjectId(),
    username: "Atishya_NEW",
    password: "1234",
    name: "Atishya Jain",
    email: "atishyajain1212@gmail.com",
    entryNumber: "2016CS50393",
    hostel: "Satpura",
    institution: "IIT DELHI",
    rating: 5,
    isAdmin: 0,
    events: [],
    problems: [],
    participant: []
  },
  {
    _id: mongoose.Types.ObjectId(),
    username: "Ananye",
    password: "1234",
    name: "Ananye Agarwal",
    email: "ananye@gmail.com",
    entryNumber: "2017CS1xxxx",
    hostel: "xxxx",
    institution: "IIT DELHI",
    rating: 5,
    isAdmin: 0,
    events: [],
    problems: [],
    participant: []
  },
  {
    _id: mongoose.Types.ObjectId(),
    username: "random",
    password: "1234",
    name: "random Agarwal",
    email: "random@gmail.com",
    entryNumber: "2017CS1xxxx",
    hostel: "xxxx",
    institution: "IIT DELHI",
    rating: 15,
    isAdmin: 0,
    events: [],
    problems: [],
    participant: []
  },
];

const events = [
  {
    _id: mongoose.Types.ObjectId(),
    title: "Introduction",
    organiser: "devclub",
    difficulty: "easy",
    startTime: new Date(),
    endTime: new Date(),
    isOngoing: true,
    problems: [],
    scoringMech: "static",
    participants: [],
    leaderboard: []
  }
];

const participants = [
  {
    _id: mongoose.Types.ObjectId(),
    eventId: events[0]._id,
    userId: users[0]._id,
    score: 55,
    rank: 1,
    problemsSolved: []
  },
  {
    _id: mongoose.Types.ObjectId(),
    eventId: events[0]._id,
    userId: users[0]._id,
    score: 155,
    rank: 2,
    problemsSolved: []
  }
];



const problems = [
  {
    _id: mongoose.Types.ObjectId(),
    difficulty: "medium",
    author: "atishya",
    content: "Do something",
    answer: "123456",
    points: {"0": 0, "1": 12},
    category: "Web Exploits",
    isActive: 0
  },
  {
    _id: mongoose.Types.ObjectId(),
    difficulty: "easy",
    author: "ananye",
    content: "Do something",
    answer: "12356",
    points: {"0": 10, "1": 10},
    category: "Web Exploits",
    isActive: 1
  },
  {
    _id: mongoose.Types.ObjectId(),
    difficulty: "medium",
    author: "atishya",
    content: "Do something again",
    answer: "1234",
    points: {"0": 20, "1": 122},
    category: "Web Exploits",
    isActive: 2
  }
];

const createDummyData = async () => {
  console.log("Creating dummy data...");
  const createdUsers = await User.create(users);
  console.log("Created users ", createdUsers);
  const createdParticipants = await Participant.create(participants);
  const [createdParticipants1, createdUsers1] = [createdParticipants, createdUsers];
  const createdEvents = await Event.create(events);
  const [createdEvents1, createdParticipants2, createdUsers2] = [createdEvents, createdParticipants1, createdUsers1];
  const x = await Problem.create(problems);
  return [x, createdEvents1, createdParticipants2, createdUsers2];
}

export default createDummyData;