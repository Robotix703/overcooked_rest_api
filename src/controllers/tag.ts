import { ITag } from "../models/tag";
import { baseTag } from "../compute/base/tag";
import { IDeleteOne, IUpdateOne } from "../models/mongoose";

const isProduction = (process.env.NODE_ENV === "production");
const protocol = isProduction ? "https" : "http";

export namespace tagController {
    //POST
    export async function writeTag(req: any, res: any){
        const url = protocol + '://' + req.get("host");

        if(req.file){
            await baseTag.writeTag(req.body.name, url + "/images/" + req.file.filename,)
            .then((result: ITag) => {
                res.status(201).json(result);
            })
            .catch((error: Error) => {
                res.status(500).json(error);
            })
        } else {
            res.status(400).json("No file provided");
        }        
    }

    //GET
    export async function getTags(req: any, res: any){
        await baseTag.getTags()
        .then((result: ITag[]) => {
            res.status(201).json(result);
        })
        .catch((error: Error) => {
            res.status(500).json(error);
        })
    }

    //PUT
    export async function updateTag(req: any, res: any){
        baseTag.updateTag(req.params.id, req.body.name, req.body.image)
        .then((result : IUpdateOne) => {
            if (result.modifiedCount > 0) {
              res.status(200).json(result);
            } else {
              res.status(500).json({ errorMessage: "Pas de modification" });
            }
        })
        .catch((error : Error) => {
            res.status(500).json({
              errorMessage: error
            })
        });
    }

    //DELETE
    export async function deleteTag(req: any, res: any){
        baseTag.deleteTag(req.params.id)
        .then((result: IDeleteOne) => {
            if (result.deletedCount > 0) {
              res.status(200).json(result);
            } else {
              res.status(500).json(result);
            }
        })
        .catch((error: Error) => {
            res.status(500).json({
              errorMessage: error
            })
        });
    }
}