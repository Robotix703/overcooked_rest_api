import { IPantry } from "../models/pantry";
import { IIngredient } from "../models/ingredient";

import { baseIngredient } from "./base/ingredient";
import { basePantry } from "./base/pantry";

export interface IPantryInventory {
    ingredientID: string,
    quantityLeft: number
}

export interface IPantryStatus {
    quantityLeft: number
}

export interface IPrettyPantry {
    ingredientID: string,
    ingredientName: string,
    ingredientImagePath: string,
    ingredientUnitOfMeasure: string,
    pantries: IPantry[]
}

export async function getConsumableID() : Promise<string[]> {
    let consumableIngredients : IIngredient[] = await baseIngredient.getConsumableIngredients();
    return consumableIngredients.map(e => e._id);
}

export async function getInventoryForIngredientID(ingredientID : string) : Promise<IPantryStatus> {  
    let fetchedPantries : IPantry[] = await basePantry.getAllPantryByIngredientID(ingredientID);

    let sum : number = 0;
    fetchedPantries.forEach((e) => {
        sum += e.quantity;
    });
    return { quantityLeft: sum };
}

export namespace PantryInventory{
    export async function getInventory() : Promise<IPantryInventory[]> {
        const consumableIDs : string[] = await getConsumableID();
    
        let listAllConsumableLeft : IPantryInventory[] = [];
    
        for(let ingredientID of consumableIDs){
            const inventory : IPantryStatus = await getInventoryForIngredientID(ingredientID);
            listAllConsumableLeft.push({
                ingredientID: ingredientID,
                quantityLeft: inventory.quantityLeft
            });
        }
        return listAllConsumableLeft;
    }
    
    export async function getFullInventory() : Promise<IPrettyPantry[]> {
        const allPantry : IPantry[] = await basePantry.getAllPantries();
    
        let prettyPantries : IPrettyPantry[] = [];
    
        for(let pantry of allPantry){
            let ingredient : IPrettyPantry = prettyPantries.find(e => e.ingredientID == pantry.ingredientID);
    
            if(ingredient){
                //Add pantry
                ingredient.pantries.push(pantry);
            }else{
                //Create element
                const ingredientInfo : IIngredient = await baseIngredient.getIngredientByID(pantry.ingredientID);
                prettyPantries.push({
                    ingredientID: pantry.ingredientID,
                    ingredientName: ingredientInfo.name,
                    ingredientImagePath: ingredientInfo.imagePath,
                    ingredientUnitOfMeasure: ingredientInfo.unitOfMeasure,
                    pantries: [pantry]
                })
            }
        }
        return prettyPantries;
    }
}