import { IMeal } from "../models/meal";
import { IDeleteOne } from "../models/mongoose";

import { baseMeal } from "./base/meal";
import { IIngredientWithQuantity } from "./handleRecipe";

import { deleteIngredientsOnTodo } from "../worker/deleteIngredientOnTodo";
import { updateIngredientsOnTodo } from "../worker/updateIngredientOnTodo";
import { handleComposition } from "./handleComposition";



export namespace handleMealUpdate {
    export async function deleteMeal(mealID: string) : Promise<IDeleteOne>{
        //Meal
        let mealToDelete : IMeal | void = await baseMeal.getMealByID(mealID);
        if(!mealToDelete) throw new Error("Meal not found");
        
        //Ingredient list
        const ingredientsNeeded : IIngredientWithQuantity[] = await handleComposition.readComposition(mealToDelete.recipeID);

        //Update TodoList ans TodoItem
        for(let ingredientWithQuantity of ingredientsNeeded){
            await deleteIngredientsOnTodo.deleteIngredient(ingredientWithQuantity)
            .catch((error : Error) => {
                //Do nothing
            });
        }

        //Delete meal
        return baseMeal.deleteMeal(mealID);
    }

    export async function setHighPrio(mealID: string) : Promise<any> {
        //Meal
        let mealToUpdate : IMeal | void = await baseMeal.getMealByID(mealID);
        if(!mealToUpdate) throw new Error("Meal not found");
        
        //Ingredient list
        const ingredientsNeeded : IIngredientWithQuantity[] = await handleComposition.readComposition(mealToUpdate.recipeID);

        //Update TodoList ans TodoItem
        for(let ingredientWithQuantity of ingredientsNeeded){
            await updateIngredientsOnTodo.setHighPrioIngredientWithQuantity(ingredientWithQuantity)
            .catch((error : Error) => {
                //Do nothing
            });
        }

        //Update meal
        return baseMeal.update(mealID, mealToUpdate.recipeID);
    }
}