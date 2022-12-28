import { IDeleteOne, IUpdateOne } from "../../models/mongoose";
import Pantry, { IPantry } from "../../models/pantry";

export namespace basePantry {

    export async function getAllPantryByIngredientID(ingredientID : string) : Promise<IPantry[]> {
        return Pantry.find({ingredientID: ingredientID});
    }

    export async function deletePantryByID(pantryID : string) : Promise<IDeleteOne> {
        return Pantry.deleteOne({ _id: pantryID });
    }

    export async function updatePantryWithPantry(pantry : IPantry) : Promise<IUpdateOne> {    
        return Pantry.updateOne({ _id: pantry._id }, pantry);
    }

    export async function getAllPantries(pageSize: number | undefined, currentPage: number | undefined) : Promise<IPantry[]> {
        return Pantry.find().limit(pageSize).skip(pageSize * (currentPage - 1));;
    }

    export async function getPantryByID(pantryID : string) : Promise<IPantry> {
        return Pantry.findById(pantryID);
    }

    export async function getAllPantryWithExpirationDate() : Promise<IPantry[]> {
        return Pantry.find({expirationDate: {$ne:null}});
    }

    export async function updatePantry(_id : string, ingredientID : string, quantity : number, expirationDate : any, frozen : boolean) : Promise<IUpdateOne> {
        let elementToUpdate : any = { _id: _id };

        if(ingredientID) elementToUpdate.ingredientID = ingredientID;
        if(quantity) elementToUpdate.quantity = quantity;
        if(expirationDate) elementToUpdate.expirationDate = expirationDate;
        if(frozen) elementToUpdate.frozen = frozen;

        return Pantry.updateOne({ _id: _id }, elementToUpdate);
    }

    export async function getByID(id: string) : Promise<IPantry> {
        return Pantry.findById(id);
    }

    export async function register(ingredientID: string, quantity: number, expirationDate: any | null, frozen: boolean) : Promise<any> {
        const pantry = new Pantry({
            ingredientID: ingredientID,
            quantity: quantity,
            expirationDate: expirationDate,
            frozen: frozen
        });

        return pantry.save()
        .then((result: any) => {
            return { id: result._id, pantry: pantry };
        })
        .catch((error: Error) => {
            return { error: error };
        });
    }

    export async function count() {
        return Pantry.count();
    }

    export async function getByIngredientID(ingredientID : string) : Promise<IPantry[]> {
        return Pantry.find({ ingredientID: ingredientID });
    }

    export async function deleteOne(id : string) {
        return Pantry.deleteOne({ _id: id });
    }
}