import problem, { default as Problem } from "../models/problem";
import { default as User } from "../models/user";
import { default as Participant } from "../models/participant";
import { default as Event } from "../models/event";
import { Document, mongo } from "mongoose";
import mongoose from "mongoose";

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

export const createDummyData = () => {
    console.log("Creating dummy data...");
    return User.create(users)
    .then((createdUsers) => {
        console.log("Created users ", createdUsers);
        return Participant.create(participants)
        .then((createdParticipants) => {
            return [createdParticipants, createdUsers];
        });
    })
    .then(([createdParticipants, createdUsers]) => {
        return Event.create(events)
        .then(createdEvents => [createdEvents, createdParticipants, createdUsers]);
    })
    .then(([createdEvents, createdParticipants, createdUsers]) => {
        return Problem.create(problems).then(x => [x, createdEvents, createdParticipants, createdUsers]);
    });
}