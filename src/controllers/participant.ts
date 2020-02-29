import express, { RequestHandler } from "express";
import Participant from '../models/participant';
import Problem from '../models/problem'
import User from '../models/user'
import initCRUD from "../utils/crudFactory";
import { validateToken } from '../utils/tokenValidator'
import { level } from 'winston';

const router = express.Router({mergeParams: true});
const [create, get, update, all, remove] = initCRUD(Participant);

const update_participant : RequestHandler = async (req, res, next) => {
    try{
        let message = "Incorrect"
        const currentTime = new Date()
        const startTime = req.body.startTime
        const endTime = req.body.endTime
        if(startTime < currentTime < endTime ){
            if(startTime>currentTime){
                message = "Competition has not started yet"
            }
            else{
                message = "Competition is over!!"
            }
            const response = {
                message,
                currTime: currentTime,
                start: req.body.startTime,
                end: req.body.endTime
            }
            return res.json(response)
        }
        let participant = await Participant.findById(req.params.id)
        const problem = await Problem.findById(req.body.problemId)
        const user = await User.findById(req.user!._id)
        if(!participant || !problem || !user){
            throw new Error()
        }
        const participantObj = participant.toObject()
        const problemObj = problem.toObject()
        const userObj = user.toObject()
        let problemMap = new Map()
        let index =-1
        const answer = problem.get('answer')
        for(let i=0;i<participantObj.problemsSolved.length;i++){
            if(participantObj.problemsSolved[i].has(req.body.problemId)){
                index=i
                problemMap = participantObj.problemsSolved[i]
            }
        }
        if(index === -1){
            problemMap.set(req.body.problemId, 'UnSolved')
            problemMap.set('name', problem.get('name'))
            problemMap.set('Attempt', 0)
            index = participantObj.problemsSolved.length
            participantObj.problemsSolved.push(problemMap)
        }
        let level = participantObj.level
        let updatedScore = participantObj.score
        if(problemMap.get(req.body.problemId) === 'UnSolved'){
            if(req.body.answer === answer){
                problemMap.set(req.body.problemId, 'Solved')
                updatedScore = updatedScore + req.body.score
                problemObj.usersSolved = problemObj.usersSolved + 1
                if(!participantObj.levelScore.has(problemObj.level.toString())){
                    participantObj.levelScore.set(problemObj.level.toString(),0)
                }
                const currScore =  participantObj.levelScore.get(problemObj.level.toString())
                const currScoreVal = parseInt(currScore, 10);
                const updatedcurrScoreVal = currScoreVal + req.body.score
                participantObj.levelScore.set(problemObj.level.toString(),updatedcurrScoreVal)
                const eventScore: Map<String, String> = new Map(JSON.parse(req.body.eventScore)) 
                if(level === problemObj.level && updatedcurrScoreVal >= ((parseInt(eventScore.get(problemObj.level.toString()),10))/2)){
                    level = level + 1
                }
                await Problem.findByIdAndUpdate(
                    problemObj._id,
                    {usersSolved: problemObj.usersSolved},
                )
                await User.findByIdAndUpdate(
                    req.user!._id,
                    {problems: [...userObj.problems, req.body.problemId]},
                    {new: true}
                )
            }
            problemMap.set('Attempt', problemMap.get('Attempt') + 1)
        }
        participantObj.problemsSolved[index] = problemMap
        const participant_id = participantObj._id
        const updatedParticipant = await Participant.findByIdAndUpdate(
            participant_id,
            {problemsSolved: [...participantObj.problemsSolved], score: updatedScore, levelScore: participantObj.levelScore, level},
            {new: true}
        )
        if(req.body.answer === answer){
            message = 'Correct'
        }
        const response = {
            message,
            score: updatedScore,
            updatedParticipant
        }
        res.json(response)
    } catch( error ) {
        console.log(error)
        res.status(500).json(error)
    }
}

router.post('/', validateToken, create);
router.get('/',all);
router.get('/:id',get);
router.put('/:id', validateToken, update_participant);

export default router;