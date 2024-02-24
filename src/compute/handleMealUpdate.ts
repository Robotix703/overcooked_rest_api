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
        const mealToDelete : IMeal | void = await baseMeal.getMealByID(mealID);
        if(!mealToDelete) throw new Error("Meal not found");
        
        //Ingredient list
        const ingredientsNeeded : IIngredientWithQuantity[] = await handleComposition.readComposition(mealToDelete.recipeID);

        //Update TodoList and TodoItem
        for(let ingredientWithQuantity of ingredientsNeeded){
            await deleteIngredientsOnTodo.deleteIngredient(ingredientWithQuantity, mealToDelete._id)
            .catch((error : Error) => {
                console.log(error);
            });
        }

        //Delete meal
        return baseMeal.deleteMeal(mealID);
    }
}