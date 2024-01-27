import { IRecipe } from "../models/recipe";
import { IInstruction } from "../models/instruction";
import { IUpdateOne } from "../models/mongoose";
import { baseInstruction } from "./base/instruction";
import { baseRecipe } from "./base/recipe";
import { IIngredientWithQuantity } from "./handleRecipe";
import { IIngredient } from "../models/ingredient";
import { baseIngredient } from "./base/ingredient";

export async function computeComposition(recipeId: string) : Promise<string>{
    const instructions : IInstruction[] | void = await baseInstruction.getInstructionByRecipeID(recipeId);
    if(!instructions) throw new Error("No instruction found");

    let ingredientsNeeded : IIngredientWithQuantity[] = [];
    for (let instruction of instructions) {

        let newIngredients : IIngredientWithQuantity[] = [];
        for (let i = 0; i < instruction.ingredientsID.length; i++) {
            const ingredient : IIngredient = await baseIngredient.getIngredientByID(instruction.ingredientsID[i]);
            newIngredients.push({
                ingredient: ingredient,
                quantity: instruction.quantity[i]
            });
        }
        concatList(ingredientsNeeded, newIngredients);
    }
    return(JSON.stringify(ingredientsNeeded));
}

export function concatList(originalList : IIngredientWithQuantity[], additionList : IIngredientWithQuantity[]) : void {
    additionList.forEach((elementToAdd : IIngredientWithQuantity) => {
        let existingIngredient = originalList.find((e : IIngredientWithQuantity) => e.ingredient._id.toString() == elementToAdd.ingredient._id.toString());

        if (existingIngredient) existingIngredient.quantity += elementToAdd.quantity;
        else originalList.push(elementToAdd);
    })
}

export namespace handleComposition {
    export async function createComposition(recipeId: string) : Promise<IUpdateOne>{
        const recipe : IRecipe | void = await baseRecipe.getRecipeByID(recipeId);
        if(!recipe) throw new Error("No recipe found");

        const composition = await computeComposition(recipeId);

        return baseRecipe.updateRecipe(recipeId, recipe.title, recipe.numberOfLunch, recipe.imagePath, recipe.category, recipe.duration, recipe.numberOfTimeCooked, composition, recipe.tags);
    }

    export async function readComposition(recipeId: string) : Promise<IIngredientWithQuantity[] | null>{
        const recipe = await baseRecipe.getRecipeByID(recipeId);
        if(!recipe) return null;

        return recipe.composition ? JSON.parse(recipe.composition) : null;
    }
}