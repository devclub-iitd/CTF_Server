import express, { RequestHandler } from "express";
import Participant from "../models/participant";
import initCRUD from "../utils/crudFactory";
import { validateToken } from '../utils/tokenValidator'

const router = express.Router({mergeParams: true});
const [create, get, update, all] = initCRUD(Participant);

const createParticipant :RequestHandler = (req,res,next) => {
    console.log(req.body)
    res.json(req.body)
}

router.post('/', validateToken, create);
router.get('/',all);
router.get('/:id',get);
router.put('/:id', validateToken, update);

export default router;