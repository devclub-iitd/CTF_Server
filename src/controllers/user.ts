import express, { RequestHandler } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import initCRUD from "../utils/crudFactory";
import { createResponse, createError } from "../utils/helper";
import { validateToken } from '../utils/tokenValidator';

const router = express.Router({mergeParams: true});
const [create, get, update, all] = initCRUD(User);

const userLogin = (req:Request, res: Response, next:NextFunction) => {
    let p_username : string;
    let p_password : string;

    if (!req.body) {
        next(createError(400, "Bad request", "Received request with no body"));
    }

    p_password = req.body.password;
    p_username = req.body.username;
    
    // Retrieve the username from the database
    User.findOne({username: p_username}).then((userDoc) => {
        if (!userDoc) {
            next(createError(404, "Not found", `User with username ${p_username} does not exist`));
        } else {
            let userObject = userDoc.toObject();

            // Get the password
            let userPassword = userObject.password;
            
            if (userPassword == p_password) {
                // Create a token
                const payload = {user: userObject.username};
                const options = {expiresIn: '2d', issuer: 'devclub-ctf'};
                //const secret = process.env.JWT_SECRET as Secret;
                const secret = 'secret' as Secret
                
                if (secret === undefined) {
                    next(createError(500, "Incorrect configuration", `Token secret key not initialized`));
                }

                
                const token = jwt.sign(payload, secret, options);

                let result = {
                    token: token,
                    status: 200,
                    userId: userObject._id,
                    expiresIn: 172800 as Number
                };

                res.status(200).send(result);
                return result;
            } else {
                next(createError(400, "Incorrect login", `User with username ${p_username} does not exist or incorrect password entered`));
            }
            
            return userObject;
        }
    })
    .catch((err) => {
        next(err);
    });
}

const userSignUp : RequestHandler = async (req, res, next) => {
    const user = new User(req.body)
    try{
        const token = user.generateAuthToken()
        await user.save()
        let result = {
            token: token,
            status: 200,
            userId: user._id,
            expiresIn: 172800 as Number
        };
        res.json(result)
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