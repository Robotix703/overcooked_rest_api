import { Request, Response } from "express";

import { IPantry } from "../models/pantry";
import { IIngredient } from "../models/ingredient";
import { IDeleteOne } from "../models/mongoose";

import { IPrettyPantry, PantryInventory } from "../compute/pantryInventory";
import { baseIngredient } from "../compute/base/ingredient";
import { basePantry } from "../compute/base/pantry";
import { handlePantry } from "../compute/handlePantry";

import checkTodoList from "../worker/checkTodoList";

export namespace pantryController {
    //POST
    export async function writePantry(req: Request, res: Response) {
        let ingredientId: string = req.body.ingredientID;
        if(req.body.ingredientName){
            let ingredient: IIngredient | null = await baseIngredient.getIngredientByName(req.body.ingredientName);
            if(ingredient){
                ingredientId = ingredient._id;
            }
            else{
                res.status(400).json("Ingredient not found");
                return;
            }
        }
        
        basePantry.register(
            ingredientId,
            req.body.quantity
        )
            .then((result: any) => {
                res.status(201).json(result);
            })
            .catch((error: Error) => {
                res.status(500).json({
                    errorMessage: error
                })
            });
    }
    export async function writePantryByIngredientName(req: Request, res: Response) {
        const ingredientID: IIngredient = await baseIngredient.getIngredientByName(req.body.ingredientName);

        basePantry.register(
            ingredientID._id,
            req.body.quantity
        )
            .then((result: any) => {
                res.status(201).json(result);
            })
            .catch((error: Error) => {
                res.status(500).json({
                    errorMessage: error
                })
            });
    }
    export async function refreshTodoist(req: Request, res: Response) {
        await checkTodoList();

        res.status(201).json({ result: "OK" });
    }

    //GET
    export async function readPantries(req: any, res: Response) {
        let fetchedPantries: IPantry[] | void = await basePantry.getAllPantries()
            .catch((error: Error) => {
                res.status(500).json({
                    errorMessage: error
                })
                return;
            });

        let count = await basePantry.count()
            .catch((error: Error) => {
                res.status(500).json({
                    errorMessage: error
                })
                return;
            });

        let data = {
            pantries: fetchedPantries,
            pantryCount: count
        }

        res.status(200).json(data);
    }
    export async function getPrettyPantries(req: any, res: any){
        handlePantry.getPrettyPantries()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json(error);
        });
    }
    export async function quantityLeft(req: Request, res: Response) {
        basePantry.getByIngredientID(req.query.ingredientID as string)
            .then((documents: IPantry[]) => {
                const fetchedPantries: IPantry[] = [...documents];

                let sum = 0;
                fetchedPantries.forEach((e) => {
                    sum += e.quantity;
                })

                res.status(200).json({ quantityLeft: sum });
            })
            .catch((error: Error) => {
                res.status(500).json({
                    errorMessage: error
                })
            });
    }
    export async function getFullPantryInventory(req: Request, res: Response) {
        PantryInventory.getFullInventory()
            .then((fullInventory: IPrettyPantry[]) => {
                res.status(200).json(fullInventory);
            })
            .catch((error: Error) => {
                res.status(500).json({
                    errorMessage: error
                })
            });
    }
    export async function getPantryByID(req: Request, res: Response) {
        const pantry: IPantry | void = await basePantry.getPantryByID(req.query.pantryID as string)
            .catch((error: Error) => {
                res.status(500).json({
                    errorMessage: error
                })
                return;
            });

        if (pantry) {
            const ingredientName: string | void = await baseIngredient.getIngredientNameByID(pantry.ingredientID)
                .catch((error: Error) => {
                    res.status(500).json({
                        errorMessage: error
                    });
                    return;
                });

            if (ingredientName) {
                res.status(200).json({
                    _id: pantry._id,
                    ingredientID: pantry.ingredientID,
                    quantity: pantry.quantity,
                    ingredientName: ingredientName
                });
            }
            else {
                res.status(500).json({
                    errorMessage: "ingredient not found"
                });
            }
        }
        else {
            res.status(500).json({
                errorMessage: "Pantry not found"
            });
        }
    }

    //PUT
    export async function updatePantry(req: Request, res: Response) {
        if (req.body.ingredientName) {

            let ingredient: IIngredient | void = await baseIngredient.getIngredientByName(req.body.ingredientName)
                .catch((error: Error) => {
                    res.status(500).json({
                        errorMessage: error
                    });
                    return;
                });

            if (ingredient) {
                let ingredientID: string = ingredient._id;

                let updatePantry = await basePantry.updatePantry(
                    req.params.id,
                    ingredientID,
                    req.body.quantity
                )
                    .catch((error: Error) => {
                        res.status(500).json({
                            errorMessage: error
                        })
                    });

                if (updatePantry) {
                    if (updatePantry.modifiedCount > 0) {
                        res.status(200).json({ status: "OK" });
                    } else {
                        res.status(500).json({ message: "Pas de modification" });
                    }
                }
                else {
                    res.status(500).json({
                        errorMessage: "Update error"
                    });
                }
            }
            else {
                res.status(400).json({
                    errorMessage: "IngredientName not found"
                });
            }
        }
        else {
            res.status(400).json({
                errorMessage: "IngredientName not provided"
            });
        }
    }

    //DELETE
    export function deletePantry(req: Request, res: Response) {
        basePantry.deleteOne(req.params.id)
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