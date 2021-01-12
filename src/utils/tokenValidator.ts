import jwt, { Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { createResponse, createError } from "./helper";
import User from "../models/user";
import { create } from "domain";

const validateToken = (req: Request, res:Response, next:NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) { 
        const token = authorizationHeader.split(' ')[1];console.log(authorizationHeader)
        const options = {
            expiresIn: '2d',
            issuer: 'devclub-ctf'
        };

        try {
            //const secret = process.env.JWT_SECRET
            const secret = 'secret' as Secret
            if (!secret) {
                next(createError(500, "Internal error", `The JWT secret is not configured properly`));
                return;
            } else {
                jwt.verify(token, secret, options, (err, authorizedData) => {
                    if(err) {
                        console.log("jwt.verify error 1");
                        next(err);
                        return;
                    }

                    let usernameFromToken = (<any>authorizedData).user;
                    
                    if (!usernameFromToken) {
                        next(createError(401, "Invalid token", "Token supplied does not belong to any user"));
                        return;
                    }
                    
                    // Retrieve user from the database
                    User.findOne({username: usernameFromToken})
                        .then((userObject) => {
                            if (!userObject) {
                                next(createError(404, "Not found", `User with username ${usernameFromToken} does not exist`));
                                return;
                            } else {
                                // Pass to the next function in the middleware with user object added
                                req.user = userObject; 
                                next();
                                return;
                            }   
                        })
                        .catch((err) => {
                            next(err);
                            return;
                        });
                });
            }
        } catch(err) {
            next(err);
        }
    } else {
        next(createError(401, "Forbidden", "No authorization header found"));
    }
}

export {validateToken};

