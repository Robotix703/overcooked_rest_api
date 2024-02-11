import { Request, Response } from "express";
import moment from 'moment';

import { IPantry } from "../models/pantry";
import { IIngredient } from "../models/ingredient";
import { IUpdateOne } from "../models/mongoose";
import { IDeleteOne } from "../models/mongoose";

import { IPrettyPantry, PantryInventory } from "../compute/pantryInventory";
import { baseIngredient } from "../compute/base/ingredient";
import { basePantry } from "../compute/base/pantry";
import { handlePantry } from "../compute/handlePantry";

import checkTodoList from "../worker/checkTodoList";
import { registerIngredientsOnTodo } from "../worker/registerIngredientsOnTodo";

export namespace pantryController {
    //POST
    export function buyAgain(req: Request, res: Response){
        if(!req.body.ingredientID) res.status(400).json({errorMessage: "No ingredientID provided"});
        if(!req.body.ingredientName) res.status(400).json({errorMessage: "No ingredientName provided"});
        if(!req.body.quantity) res.status(400).json({errorMessage: "No quantity provided"});
        if(!req.body.pantryID) res.status(400).json({errorMessage: "No pantryID provided"});

        basePantry.deleteOne(req.body.pantryID)
            .then((result: IDeleteOne) => {
                if (result.deletedCount > 0) {
                    registerIngredientsOnTodo.registerIngredient(req.body.ingredientID, req.body.ingredientName, req.body.quantity, "Rachat")
                    .then((result: any) => {
                        res.status(201).json(result);
                    })
                    .catch((error: Error) => {
                        res.status(500).json({
                            errorMessage: error
                        })
                    });
                } else {
                    res.status(401).json(result);
                }
            })
            .catch((error: Error) => {
                res.status(500).json({
                    errorMessage: error
                })
            });
    }
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
            req.body.quantity,
            req.body.expirationDate ? moment(req.body.expirationDate, "DD/MM/YYYY") : null
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
            req.body.quantity,
            req.body.expirationDate ? moment(req.body.expirationDate, "DD/MM/YYYY") : null
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
    export async function getNearestExpirationDate(req: Request, res: Response) {
        basePantry.getByIngredientID(req.query.ingredientID as string)
            .then((documents: IPantry[]) => {
                const fetchedPantries: IPantry[] = [...documents];

                let nearestExpirationDate: Date = new Date();
                nearestExpirationDate.setFullYear(nearestExpirationDate.getFullYear() + 1);

                fetchedPantries.forEach((e) => {
                    if (e.expirationDate < nearestExpirationDate) nearestExpirationDate = e.expirationDate;
                })

                res.status(200).json({ nearestExpirationDate: nearestExpirationDate });
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
                    expirationDate: pantry.expirationDate || null,
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
                    req.body.quantity,
                    req.body.expirationDate ? moment(req.body.expirationDate, "DD/MM/YYYY") : null
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
    export async function updateExpirationDate(req: Request, res: Response) {
        let updatePantry = await basePantry.updatePantry(
            req.params.id,
            undefined,
            undefined,
            req.body.expirationDate ? new Date(req.body.expirationDate,) : null
        )

        if (updatePantry) {
            if (updatePantry.modifiedCount > 0) {
                res.status(200).json({ status: "OK" });
            } else {
                res.status(500).json({ message: "Pas de modification" });
            }
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