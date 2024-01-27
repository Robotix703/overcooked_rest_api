import { Response } from "express";
import { fetchData } from "../modules/webScrapping";

export namespace toolsController {
    //Get
    export async function extractFromMarmiton(req: any, res: Response) {
        const url = req.query.url as string;
        if(!url) return res.status(400).json({errorMessage: "URL is missing"});
        
        const result = await fetchData(url);
        res.status(200).json(result);
    }
}