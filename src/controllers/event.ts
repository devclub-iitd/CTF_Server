import express, { RequestHandler } from "express";
import Event from "../models/event";
import mongoose, { model } from "mongoose";
import initCRUD from "../utils/crudFactory";
import { Request, Response, NextFunction } from "express";
import { createResponse, createError } from "../utils/helper";
import { validateToken } from "../utils/tokenValidator";
import Participant from '../models/participant';

const router = express.Router({mergeParams: true});
const [create, get, update, all] = initCRUD(Event);

const get_ongoing_events = (req:Request, res:Response, next:NextFunction) => {
    console.log("Ongoing events function entered");
    return Event.find({isOngoing: true})
        .then((docs) => {
           res.json(createResponse('Ongoing events found with details ', docs));
           return docs;
        })
        .catch((err) => {
            next(err);
        });
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
        res.json(event)
    } catch( error ) {
        console.log(error)
        res.status(500).json(error)
    }

}

router.post('/', validateToken,create); 
router.get('/ongoing-events', get_ongoing_events);
router.get('/', all); // Protected function 
router.get('/:id',get_event);
router.put('/:id', validateToken, update);


export default router;