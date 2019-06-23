import express from "express";
import Event from "../models/event";
import initCRUD from "../utils/crudFactory";
import { NextFunction } from "connect";

const router = express.Router({mergeParams: true});
const [create, get, update, all, get_filter] = initCRUD(Event);

const get_ongoing_events = (req:Request, res:Response, next:NextFunction) => {
    req.body.query = {isOngoing: true};
    return get_filter(req, res, next);
}

router.post('/',create);
router.get('/ongoing_events', get_ongoing_events);
router.get('/', all);
router.get('/:id',get);
router.put('/:id',update);
router.get('/filter', get_filter);

export default router;