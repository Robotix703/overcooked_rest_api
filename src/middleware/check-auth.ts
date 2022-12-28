import { Response } from "express";
import { BackendError, errorTypes } from "../error/backendError";
import Jwt from "jsonwebtoken";


export default function (req: any, res: Response, next: any) {
    try{
        if(!req.headers.authorization){
            throw new BackendError(errorTypes.Auth, "Token not provided");
        }
        const token : string = req.headers.authorization.split(" ")[1];
        const decodedToken : Jwt.JwtPayload =  Jwt.verify(token, process.env.JWT) as Jwt.JwtPayload;
    
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };

        next();

    } catch (error : any) {
        if("expiredAt" in error){
            res.status(401).send(new BackendError(errorTypes.Auth, error.message + "ExpireAt : " + error.expiredAt).display());
        }
        else if("display" in error){
            res.status(401).send(error.display());
        }
        else{
            res.status(401).send(new BackendError(errorTypes.Auth, error).display());
        }
    }
}