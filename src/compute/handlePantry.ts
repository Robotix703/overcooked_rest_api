import { registerIngredientsOnTodo } from "../worker/registerIngredientsOnTodo";
import { IUpdateOne } from "../models/mongoose";
import { IDiplayablePantry, IPantry } from "../models/pantry";
import { baseIngredient } from "./base/ingredient";
import { basePantry } from "./base/pantry";
import { IIngredient } from "../models/ingredient";

export interface IPantryStatus {
    ingredientName: string,
    quantity: number,
    expirationDate: string
}

declare global {
    interface Date {
       addDays(days: number, useThis?: boolean): Date;
       removeDays(days: number, useThis?: boolean): Date;
       isToday(): boolean;
       clone(): Date;
       isAnotherMonth(date: Date): boolean;
       isWeekend(): boolean;
       isSameDate(date: Date): boolean;
       getStringDate(): String;
    }
 }

Date.prototype.addDays = function (days : number) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
Date.prototype.removeDays = function (days : number) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() - days);
    return date;
}

export namespace handlePantry {

    export async function freezePantry(pantryID : string) : Promise<IUpdateOne> {
        let pantry : IPantry = await basePantry.getByID(pantryID);
        pantry.frozen = true;
        return basePantry.updatePantryWithPantry(pantry);
    }

    export async function checkPantryExpiration() : Promise<IPantryStatus[]> {
        let allPantry : IPantry[] = await basePantry.getAllPantryWithExpirationDate();
    
        let dateAlmostExpired : Date = new Date();
        dateAlmostExpired = dateAlmostExpired.addDays(3);
        let dateExpired : Date = new Date();
        dateExpired = dateExpired.addDays(1);
    
        let almostExpired : IPantryStatus[] = [];
        for (let pantry of allPantry) {
            if (pantry.frozen == false) {
                //Expired
                if (pantry.expirationDate.getTime() < dateExpired.getTime()) {
                    await basePantry.deletePantryByID(pantry._id);

                    let ingredient : IIngredient = await baseIngredient.getIngredientByID(pantry.ingredientID);
                    
                    await registerIngredientsOnTodo.registerIngredient(ingredient._id, ingredient.name, pantry.quantity, "Rachat");
                }
                //Almost expired
                else if (pantry.expirationDate.getTime() < dateAlmostExpired.getTime()) {
                    let ingredientName : string = await baseIngredient.getIngredientNameByID(pantry.ingredientID);
                    almostExpired.push({
                        ingredientName: ingredientName,
                        quantity: pantry.quantity,
                        expirationDate: pantry.expirationDate.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" })
                    })
                }
            }
        }
        return almostExpired;
    }

    export async function getPrettyPantries(): Promise<IDiplayablePantry[]>{
        let pantries = await basePantry.getAllPantries();

        let prettyPantries: IDiplayablePantry[] = [];
        for(let pantry of pantries){
            let ingredient: IIngredient = await baseIngredient.getIngredientByID(pantry.ingredientID as string);
            prettyPantries.push({
                _id: pantry._id,
                ingredientName: ingredient.name,
                ingredientImage: ingredient.imagePath,
                quantity: pantry.quantity,
                quantityUnitOfMeasure: ingredient.unitOfMeasure,
                expirationDate: pantry.expirationDate.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" }),
                frozen: pantry.frozen
            });
        }
        return prettyPantries;
    }
}