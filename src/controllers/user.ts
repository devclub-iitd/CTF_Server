import express from "express";
import User from "../models/user";
import initCRUD from "../utils/crudFactory";
import { createResponse, createError } from "../utils/helper";
import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

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
                const secret = process.env.JWT_SECRET as Secret;
                
                if (secret === undefined) {
                    next(createError(500, "Incorrect configuration", `Token secret key not initialized`));
                }

                
                const token = jwt.sign(payload, secret, options);

                let result = {
                    token: token,
                    status: 200,
                    result: userObject
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

router.get("/", all);
router.post('/login', userLogin);
router.get("/:id", get);
router.put("/:id", update);
router.post("/", create);


export default router;