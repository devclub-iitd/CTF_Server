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
    const event = await Event.findById(req.params.id)
    try{
        if(!event){
            throw new Error()
        }
        await event.populate('challenges').execPopulate()
        await event.populate('participants').execPopulate()
        await event.populate('leaderboard').execPopulate()
        const eventObj = event.toObject()
        const updatedChallenges = eventObj.challenges.filter(el => el.level === 1)
        eventObj.challenges = updatedChallenges
        res.json(eventObj)
    } catch( error ) {
        console.log(error)
        res.status(500).json(error)
    }

}

const get_leaderboard: RequestHandler = async (req, res, next) => {
    const leaderboard = await Participant.find({eventId: req.params.id})
    try{
        leaderboard.sort((a, b) => b.score - a.score)
        res.json(leaderboard)
    } catch( error ) {
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

router.post('/', validateToken, create); 
router.get('/ongoing-events', get_ongoing_events);
router.get('/', all); // Protected function 
router.get('/:id', validateToken, get_event);
router.get('/:id/level-probelms', validateToken, get_level_problems);
router.put('/:id', validateToken, update);
router.get('/leaderboard/:id', get_leaderboard);
router.delete('/:id',remove)


export default router;