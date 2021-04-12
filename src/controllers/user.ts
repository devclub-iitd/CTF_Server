import express, { RequestHandler } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import initCRUD from "../utils/crudFactory";
import { createResponse, createError, makeid } from "../utils/helper";
import { validateToken } from '../utils/tokenValidator';

const router = express.Router({mergeParams: true});
const [create, get, update, all] = initCRUD(User);

const userLogin = (req:Request, res: Response, next:NextFunction) => {
    let p_username : string;
   
    p_username = req.user.username;
    
    // Retrieve the username from the database
    User.findOne({username: p_username}).then((userDoc) => {
        if (!userDoc) {
            const result = {
                message: 'No such user found!!',
                status: 404
            }
            return res.status(200).json(result)
            //next(createError(404, "Not found", `User with username ${p_username} does not exist`));
        } else {
            let userObject = userDoc.toObject();

            const payload = {user: userObject.username};
            const options = {expiresIn: '2d', issuer: 'devclub-ctf'};
            //const secret = process.env.JWT_SECRET as Secret;
            const secret = 'secret' as Secret
            
            if (secret === undefined) {
                const result = {
                    message: `Token secret key not initialized`,
                    status: 500
                }
                return res.status(200).json(result)
                //next(createError(500, "Incorrect configuration", `Token secret key not initialized`));
            }

            
            const token = jwt.sign(payload, secret, options);

            let result = {
                message: 'Successfull Login',
                status: 200,
                token: token,
                userId: userObject._id,
                expiresIn: 172800 as Number
            };

            return res.status(200).send(result);
        }
    })
    .catch((err) => {
        next(err);
    });
}

const userSignUp : RequestHandler = async (req, res, next) => {
    console.log(req.user);
    const userBody = {
        username: req.user.username,
        password: makeid(16),
        email: req.user.email
    }
    const user = new User(userBody)
    try{
        const token = user.generateAuthToken()
        const secret = '$$DevClub$$'
        if(req.body.secret === secret ){
            user.set('isAdmin', 1)
        }
        await user.save()
        let result = {
            message: 'Successfully Signed In',
            token: token,
            status: 200,
            userId: user._id,
            expiresIn: 172800 as Number
        };
        res.status(200).json(result)
    }catch(error) {
        console.log(error)
        res.status(400).json(error)
    }    
}

const getUser : RequestHandler = async (req,res,next) => {
    try{
        const user = await User.findById(req.params.id)
        if( !user ){
            throw new Error()
        }
        await user.populate('participant').execPopulate()
        res.json(createResponse(`User found with details:`, user));
    } catch(error) {
        res.status(500).json(error)
    }
    
}

router.get("/", all);
router.post('/login', userLogin);
router.get("/:id", validateToken, getUser);
router.put("/:id", update);
router.post("/signup", userSignUp);


export default router;