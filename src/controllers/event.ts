import express from "express";
import Event from "../models/event";
import mongoose, { model } from "mongoose";
import initCRUD from "../utils/crudFactory";
import { Request, Response, NextFunction } from "express";
import { createResponse, createError } from "../utils/helper";
import { validateToken } from "../utils/tokenValidator";

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

router.post('/', create); 
router.get('/ongoing-events', get_ongoing_events);
router.get('/', validateToken, all); // Protected function 
router.get('/:id',get);
router.put('/:id',update);


export default router;