import { registerIngredientsOnTodo } from "../worker/registerIngredientsOnTodo";
import { IUpdateOne } from "../models/mongoose";
import { IDiplayablePantry, IPantry } from "../models/pantry";
import { baseIngredient } from "./base/ingredient";
import { basePantry } from "./base/pantry";
import { IIngredient } from "../models/ingredient";

export interface IPantryStatus {
    ingredientName: string,
    quantity: number
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
                quantityUnitOfMeasure: ingredient.unitOfMeasure
            });
        }
        return prettyPantries;
    }
}