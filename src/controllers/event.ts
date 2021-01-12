import express, { RequestHandler } from "express";
import Event from "../models/event";
import mongoose, { model } from "mongoose";
import initCRUD from "../utils/crudFactory";
import { Request, Response, NextFunction } from "express";
import { createResponse, createError } from "../utils/helper";
import { validateToken } from "../utils/tokenValidator";
import Participant from '../models/participant';
import { level } from "winston";

const router = express.Router({mergeParams: true});
const [create, get, update, all, remove] = initCRUD(Event);

const get_ongoing_events = async (req:Request, res:Response, next:NextFunction) => {
    try{
        const events = await Event.find({})
        const result = []
        for(const index in events){
            const eventObj = events[index].toObject()
            const currTime = new Date().getTime()
            const startTime = new Date(eventObj.startTime).getTime()
            const endTime = new Date(eventObj.endTime).getTime()
            if(startTime < currTime && currTime < endTime){
                const obj = {
                    name: eventObj.name,
                    _id: eventObj._id
                }
                result.push(obj)
            }
        }
        res.json(result)
    } catch(error) {
        res.status(500).json(error)
    }
}

const get_event :RequestHandler = async (req, res, next) => {
    const event = await Event.findById(req.query.eventId)
    try{
        if(!event){
            throw new Error()
        }
        await event.populate('challenges').execPopulate()
        await event.populate('participants').execPopulate()
        await event.populate('leaderboard').execPopulate()
        let eventObj = event.toObject()
        if(new Date(eventObj.startTime).getTime() > new Date()){
            const result = {
                message: 'Competition has not started yet!!'
            }
            return res.json(result)
        }
        const updatedChallenges = eventObj.challenges.filter(el => el.level === parseInt(req.query.level,10))
        console.log(req.query)
        eventObj.challenges = updatedChallenges
        event.set('challenges',eventObj.challenges)
        res.json(event)
        
    } catch( error ) {
        console.log(error)
        res.status(500).json(error)
    }

}

const get_leaderboard: RequestHandler = async (req, res, next) => {
    const leaderboard = await Participant.find({eventId: req.params.id})
    const event = await Event.findById(req.params.id)
    try{
        if(!event){
            throw new Error()
        }
        if(leaderboard.length === 0  || !event.get('showLeaderboard')){
            return res.json([])
        }
        leaderboard.sort((a, b) => {
            let ans = b.score-a.score
            if(ans!==0){
                return ans
            }
            let penality_A =0
            let penality_B =0
            if(a.problemsSolved.length !== 0){
                penality_A = a.problemsSolved.reduce((sum,problem) => {
                    if(problem.get('Status') === 'Solved'){
                        return (sum + new Date(problem.get('Time')).getTime())
                    }
                }, 0)
            }
            if(b.problemsSolved.length !== 0){
                penality_B = b.problemsSolved.reduce((sum,problem) => {
                    if(problem.get('Status') === 'Solved'){
                        return (sum + new Date(problem.get('Time')).getTime())
                    }
                }, 0)
            }
            ans= penality_A-penality_B
            return ans
        })
        res.json(leaderboard)
    } catch( error ) {
        console.log(error)
        res.status(500).json(error)
    }
}

const get_level_problems: RequestHandler = async (req, res, next) => {
    console.log('get_level_problemss')
    try {
        const event = await Event.findById(req.query.eventId)
        const participant = await Participant.findById(req.query.participantId)
        if(!event || !participant) {
            throw new Error()
        }
        await event.populate('challenges').execPopulate()
        const levelProblems = []
        const participantObj = participant.toObject()
        const eventObj = event.toObject()
        let response = {
            message: 'Level not Unlocked yet!!',
            data: []
        }
        if(eventObj.level !== 1 && participantObj.levelScore[req.query.level] < (eventObj.levelScore[req.query.level]/2) ) {
            response = {
                message: 'Level not Unlocked yet!!',
                data: []
            }
        }
        else{
            for(let i= 0; i<eventObj.challenges.length; i++){
                if(eventObj.challenges[i].level == req.query.level){
                    levelProblems.push(eventObj.challenges[i])
                }
            }
            if(levelProblems.length === 0){
                response = {
                    message: 'This is the final level!!',
                    data: []
                }
            }
            response = {
                message: 'Problems fetched successfully',
                data: levelProblems
            }
        }
        res.json(response)

    } catch( error ) {
        console.log(error)
        res.status(500).json(error)
    }
}

const isAdmin: RequestHandler = (req, res, next) => {
   try {
    if(!req.user){
        throw new Error()
    }
    if(!req.user.get('isAdmin')){
        throw new Error()
    }
    if(req.user.get('isAdmin') === 1){
        next()
        return
    }
   } catch( error ) {
       console.log(error)
        next(error)
        return
   }
}

const showLeaderboard: RequestHandler = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
        if(!event){
            throw new Error()
        }
        event.set('showLeaderboard', req.body.leaderboardStatus)
        await event.save()
        const result = {
            showLeaderboard: req.body.leaderboardStatus
        }
        res.status(200).json(result)
    } catch(error) {
        console.log(error)
        res.status(500).json(error)
    }
}

router.post('/', validateToken, create); 
router.get('/ongoing-events', get_ongoing_events);
router.get('/', all); // Protected function 
router.get('/:id', validateToken, get_event);
router.get('/:id/level-probelms', validateToken, get_level_problems);
router.put('/:id', validateToken, update);
router.get('/leaderboard/:id', get_leaderboard);
router.put('/leaderboard/:id', showLeaderboard);
router.delete('/:id',validateToken, isAdmin, remove)


export default router;