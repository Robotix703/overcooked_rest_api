import { IIngredient } from "../models/ingredient";
import { baseIngredient } from "./base/ingredient";

export namespace handleIngredient {
    export async function getConsumable(ingredientID : string) : Promise<boolean> {
        let ingredient : IIngredient = await baseIngredient.getIngredientByID(ingredientID);
        return ingredient.consumable;
    }
}