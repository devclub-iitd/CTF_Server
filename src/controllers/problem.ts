import express, { RequestHandler } from "express";
import Problem from "../models/problem";
import initCRUD from "../utils/crudFactory";
import User from '../models/user'
import { validateToken } from '../utils/tokenValidator'
import Problem from '../models/problem';
import { createResponse, createError } from '../utils/helper'

const router = express.Router({mergeParams: true});
const [create, get, update, all, ] = initCRUD(Problem);

const updateProblem: RequestHandler = async (error, req, res, next) => {
    try{
        if(!req.user){
            throw Error()
        }
        
        const res1 = await User.updateOne({_id: req.user._id},{problems: req.body.problems})
        const res2 = await Problem.updateOne({_id: req.params.id},{userSolved: req.body.userSolved})
        const doc = {
            res1,
            res2
        }
        res.json({res1, res2});
        return doc;
    }catch(error){
        res.status(500).send()
    }
}

const get_practice_problems: RequestHandler = async (req, res, next) => {
    try{
        const problems = await Problem.find({ isActive: req.params.id })
        res.json(createResponse(`Problems found with details:`, problems));
    } catch(error) {
        res.status(500).json(error)
    }
}



router.post('/', validateToken,create);
router.get('/all_paroblems/:id', get_practice_problems);
router.get('/particular_problem/:id',get);
router.put('/:id', validateToken,updateProblem);

export default router;