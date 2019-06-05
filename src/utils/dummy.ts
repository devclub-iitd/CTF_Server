import problem, { default as Problem } from "../models/problem";
import { default as User } from "../models/user";
import { default as Participant } from "../models/participant";
import { default as Event } from "../models/event";
import { Document } from "mongoose";

const users = [
    {
        username: "Atishya",
        password: "1234",
        name: "Atishya Jain",
        email: "atishyajain1212@gmail.com",
        entryNumber: "2016CS50393",
        hostel: "Satpura",
        institution: "IIT DELHI",
        rating: 5,
        isAdmin: 0,
        events: [0],
        problems: [0, 1],
        participant: [0, 1]
    },
    {
        username: "Ananye",
        password: "1234",
        name: "Ananye Agarwal",
        email: "ananye@gmail.com",
        entryNumber: "2017CS1xxxx",
        hostel: "xxxx",
        institution: "IIT DELHI",
        rating: 5,
        isAdmin: 0,
        events: [0],
        problems: [0, 1],
        participant: [0, 1]
    },
    {
        username: "random",
        password: "1234",
        name: "random Agarwal",
        email: "random@gmail.com",
        entryNumber: "2017CS1xxxx",
        hostel: "xxxx",
        institution: "IIT DELHI",
        rating: 15,
        isAdmin: 0,
        events: [0],
        problems: [0, 1],
        participant: [0, 1]
    },
];

const participants = [
    {
        eventId: 0,
        userId: 1,
        score: 55,
        rank: 1,
        problemsSolved: [{problem: 0, score: 5}, {problem: 1, score: 15}]
    },
    {
        eventId: 1,
        userId: 0,
        score: 155,
        rank: 2,
        problemsSolved: [{problem: 0, score: 35}, {problem: 1, score: 25}]
    }
];

const events = [
    {
        title: "Introduction",
        organiser: "devclub",
        difficulty: "easy",
        startTime: new Date(),
        endTime: new Date(),
        isOngoing: true,
        problems: [0, 1],
        scoringMech: "static",
        participants: [0, 1],
        leaderboard: [0, 1]
    }
];

const problems = [
    {
        difficulty: "medium",
        author: "atishya",
        content: "Do something",
        answer: "123456",
        points: {"0": 0, "1": 12},
        category: ["Web Exploits"],
        isActive: 0
    },
    {
        difficulty: "easy",
        author: "ananye",
        content: "Do something",
        answer: "12356",
        points: {"0": 10, "1": 10},
        category: ["Web Exploits"],
        isActive: 1
    },
    {
        difficulty: "medium",
        author: "atishya",
        content: "Do something again",
        answer: "1234",
        points: {"0": 20, "1": 122},
        category: ["Web Exploits"],
        isActive: 2
    }
];

export const createDummyData = () => {
    return User.create(users)
    .then((createdUsers) => {
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