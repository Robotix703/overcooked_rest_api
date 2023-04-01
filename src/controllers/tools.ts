import { Request, Response } from "express";
import { getShelfLifeFromChatGPT } from "../modules/openAI";
import { fetchData } from "../modules/webScrapping";

export namespace toolsController {
    //Get
    export async function extractFromMarmiton(req: any, res: Response) {
        const url = req.query.url as string;
        if(!url) return res.status(400).json({errorMessage: "URL is missing"});
        
        const result = await fetchData(url);
        res.status(200).json(result);
    }
    export async function shelfLifeFromChatGPT(req: any, res: Response) {
        const result = await getShelfLifeFromChatGPT(req.query.ingredientName as string);
        res.status(200).json(result);
    }
}