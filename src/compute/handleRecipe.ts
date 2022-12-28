import { IRecipe } from "../models/recipe";
import { IInstruction } from "../models/instruction";
import { IIngredient } from "../models/ingredient";
import { baseInstruction } from "./base/instruction";
import { baseRecipe } from "./base/recipe";
import { baseIngredient } from "./base/ingredient";

export interface IIngredientWithQuantity {
    ingredient: IIngredient,
    quantity: number
}

export interface IIngredientIdWithQuantity {
    ingredientID: string,
    quantity: number
}

export interface IPrettyRecipe {
    _id: string,
    title: string,
    numberOfLunch: number,
    category: string,
    duration: number,
    instructions: IPrettyInstruction[]
}

export interface IPrettyInstruction {
    _id: string,
    text: string,
    recipeID: string,
    composition: IPrettyIngredient[],
    order: number,
    cookingTime: number | null
}

export interface IPrettyIngredient {
    name: string,
    imagePath: string,
    quantity: number,
    unitOfMeasure: string
}

export async function getIngredientIDFromInstruction(instructionID : string) : Promise<IIngredientIdWithQuantity[]> {
    const instruction : IInstruction = await baseInstruction.getInstructionByID(instructionID);

    let ingredientsNeeded : IIngredientIdWithQuantity[] = [];
    instruction.ingredientsID.forEach((ingredient : string, index : number) => {
        ingredientsNeeded.push({
            ingredientID: ingredient,
            quantity: instruction.quantity[index]
        });
    });
    return ingredientsNeeded;
}

export function concatList(originalList : IIngredientWithQuantity[], additionList : IIngredientWithQuantity[]) : void {
    additionList.forEach((elementToAdd : IIngredientWithQuantity) => {
        let existingIngredient = originalList.find((e : IIngredientWithQuantity) => e.ingredient._id.toString() == elementToAdd.ingredient._id.toString());

        if (existingIngredient) existingIngredient.quantity += elementToAdd.quantity;
        else originalList.push(elementToAdd);
    })
}

export function adaptQuantity(ingredientList : IIngredientWithQuantity[], numberOfLunch : number, numberOfLunchRecipe : number) : void {
    ingredientList.forEach((ingredient : IIngredientWithQuantity) => {
        ingredient.quantity *= (numberOfLunch / numberOfLunchRecipe);
    });
}

export function sortInstructions(x : IInstruction, y : IInstruction) : number {
    if (x.order < y.order) return -1;
    if (x.order > y.order) return 1;
    return 0;
}

export namespace handleRecipe {
    export async function getIngredientList(recipeID : string, numberOfLunch : number) : Promise<IIngredientWithQuantity[]> {
        const instructions : IInstruction[] | void = await baseInstruction.getInstructionByRecipeID(recipeID);
        if(!instructions) throw new Error("No instruction found");
        const recipe : IRecipe | void = await baseRecipe.getRecipeByID(recipeID);
        if(!recipe) throw new Error("No recipe found");

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
    
            adaptQuantity(newIngredients, numberOfLunch, recipe.numberOfLunch);
            concatList(ingredientsNeeded, newIngredients);
        }
        return ingredientsNeeded;
    }
    
    export async function getInstructionsByRecipeID(recipeID : string) : Promise<IPrettyInstruction[]> {
        const instructions : IInstruction[] | void = await baseInstruction.getInstructionByRecipeID(recipeID);
        if(!instructions) throw new Error("No instruction found");
        instructions.sort(sortInstructions);
    
        let newInstruction : IPrettyInstruction[] = [];
        for (let instruction of instructions) {
            const ingredientsID : IIngredientIdWithQuantity[] = await getIngredientIDFromInstruction(instruction._id);
            const ingredients : IIngredient[] = await baseIngredient.getIngredientsByID(ingredientsID.map(e => e.ingredientID));
    
            let composition : IPrettyIngredient[] = [];
            for (let i = 0; i < ingredients.length; i++) {
                composition.push(
                    { 
                        name: ingredients[i].name,
                        imagePath: ingredients[i].imagePath,
                        quantity: instruction.quantity[i],
                        unitOfMeasure: ingredients[i].unitOfMeasure
                    });
            }
            
            newInstruction.push({
                _id: instruction._id,
                text: instruction.text,
                recipeID: instruction.recipeID,
                composition: composition,
                order: instruction.order,
                cookingTime: instruction.cookingTime
            });
        }
        return newInstruction;
    }
    
    export async function getPrettyRecipe(recipeID : string) : Promise<IPrettyRecipe> {
        let instructions : IPrettyInstruction[] = await this.getInstructionsByRecipeID(recipeID);
        let recipeData : IRecipe | void = await baseRecipe.getRecipeByID(recipeID);
        if(!recipeData) throw new Error("No Recipe found");
        
        return {
            _id: recipeData._id,
            title: recipeData.title,
            numberOfLunch: recipeData.numberOfLunch,
            category: recipeData.category,
            duration: recipeData.duration,
            instructions: instructions
        };
    }
}