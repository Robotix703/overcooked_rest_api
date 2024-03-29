import { IDeleteOne, IUpdateOne } from "../../models/mongoose";
import Instruction, { IInstruction } from "../../models/instruction";

export namespace baseInstruction {

    export async function getInstructionByID(instructionID : string) : Promise<IInstruction> {
        return Instruction.findById(instructionID);
    }

    export async function getInstructionByRecipeID(recipeID : string) : Promise<IInstruction[] | void>{
        return Instruction.find({ 'recipeID': recipeID });
    }

    export async function updateInstruction(_id : string, text : string, recipeID : string, ingredientsID : string[], quantity : number[], order : number) : Promise<IUpdateOne>{
        let elementToUpdate : any = { _id: _id };

        if(text) elementToUpdate.text = text;
        if(recipeID) elementToUpdate.recipeID = recipeID;
        if(ingredientsID) elementToUpdate.ingredientsID = ingredientsID;
        if(quantity) elementToUpdate.quantity = quantity;
        if(order) elementToUpdate.order = order;

        return Instruction.updateOne({ _id: _id }, elementToUpdate);
    }

    export async function register(text: string, recipeID: string, ingredientsID: string[], quantity: number[], order: number) : Promise<any> {
        const instruction = new Instruction({
            text: text,
            recipeID: recipeID,
            ingredientsID: ingredientsID,
            quantity: quantity,
            order: order
        });

        return instruction.save()
        .then((result: any) => {
            return { id: result._id, instruction: instruction };
        })
        .catch((error: Error) => {
            return { error: error };
        });
    }

    export async function getAllInstructions(pageSize: number | null, currentPage: number | null) : Promise<IInstruction[]> {
        return Instruction.find().limit(pageSize).skip(pageSize * (currentPage - 1));
    }

    export async function count() : Promise<number> {
        return Instruction.count();
    }

    export async function deleteOne(id: string) : Promise<IDeleteOne> {
        return Instruction.deleteOne({ _id: id });
    }

    export async function getRecipeId(instructionId: string) : Promise<string | null> {
        return Instruction.findOne({ _id: instructionId })
        .then((instruction : IInstruction) => {
            return instruction ? instruction.recipeID : null;
        })
        .catch((error: Error) => {
            throw error;
        })
    }
}