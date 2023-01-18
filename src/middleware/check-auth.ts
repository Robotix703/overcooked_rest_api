import { Response } from "express";
import { BackendError, errorTypes } from "../error/backendError";
import { checkAPIKey } from '../apiKey';

export default function (req: any, res: Response, next: any) {
    try{
        const api_key_header = req.header("x-api-key");
        if(api_key_header){
            //API-KEY
            if(checkAPIKey(api_key_header)){
                next();
                return;
            } else {
                throw new BackendError(errorTypes.Auth, "Wrong API Key");
            }
        }
        else {
            throw new BackendError(errorTypes.Auth, "API Key not provided");
        }
    } 
    catch (error : any) {
        res.status(401).send(new BackendError(errorTypes.Auth, error.message).display());
    }
}