import { IIngredient } from "../models/ingredient";
import { IInstruction } from "../models/instruction";
import { baseIngredient } from "./base/ingredient";
import { baseInstruction } from "./base/instruction";
import { IPrettyInstruction } from "./handleRecipe";

export namespace handleInstruction {
    export async function getInstructionCountForRecipe(recipeID : string) : Promise<Number> {
        let instructions : IInstruction[] | void = await baseInstruction.getInstructionByRecipeID(recipeID);
        if(!instructions) return 0;
        return instructions.length;
    }

    export async function getPrettyInstructionByID(instructionID : string) : Promise<IPrettyInstruction> {
        let instruction : IInstruction = await baseInstruction.getInstructionByID(instructionID);
        let ingredients : IIngredient[] = await baseIngredient.getIngredientsByID(instruction.ingredientsID);

        let prettyInstruction : IPrettyInstruction = {
            _id: instruction._id,
            text: instruction.text,
            composition: [],
            recipeID: instruction.recipeID,
            order: instruction.order,
            cookingTime: instruction.cookingTime
        }

        for(let i = 0; i < ingredients.length; i++){
            prettyInstruction.composition.push({
                name: ingredients[i].name,
                imagePath: ingredients[i].imagePath,
                quantity: instruction.quantity[i],
                unitOfMeasure: ingredients[i].unitOfMeasure
            })
        }

        return prettyInstruction;
    }
}