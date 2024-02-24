import { IIngredient } from "../models/ingredient";
import { IInstruction } from "../models/instruction";
import { baseIngredient } from "./base/ingredient";
import { baseInstruction } from "./base/instruction";
import { IPrettyInstruction } from "./handleRecipe";
import { handleComposition } from "./handleComposition";

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
            order: instruction.order
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

    export async function updateInstructions(instructions : IPrettyInstruction[]) : Promise<boolean | Error>{
        let isUpdateCompositionNeeded = false;

        for(let instruction of instructions){
            let ingredientsName = instruction.composition.map((e) => e.name);
            let ingredientsID = await baseIngredient.getIngredientsIDByName(ingredientsName);
            let ingredientsQuantity = instruction.composition.map((e) => e.quantity);

            //Create new instructions
            if(instruction._id === "NEW"){
                await baseInstruction.register(instruction.text, instruction.recipeID, ingredientsID, ingredientsQuantity, instruction.order);
                isUpdateCompositionNeeded = true;
            }

            //Update existing
            let updateResult = await baseInstruction.updateInstruction(instruction._id, instruction.text, instruction.recipeID, ingredientsID, ingredientsQuantity, instruction.order);
            if(updateResult.modifiedCount > 0){
                isUpdateCompositionNeeded = true;
            }
        }

        if(isUpdateCompositionNeeded){
            handleComposition.editComposition(instructions[0].recipeID);
        }
        
        return true;
    }
}