import { IDeleteOne, IUpdateOne } from '../../models/mongoose';
import Ingredient, { IIngredient } from "../../models/ingredient";

export namespace baseIngredient {
    
    export async function getIngredientNameByID(ingredientID : string) : Promise<string> {
        return Ingredient.findById(ingredientID).then((result : IIngredient) => {
            return result.name;
        });
    }
    
    export async function getIngredientByID(ingredientID : string) : Promise<IIngredient> {
        return Ingredient.findById(ingredientID);
    }
    
    export async function getIngredientsByID(ingredientsID : string[]) : Promise<IIngredient[]> {
        let ingredients : IIngredient[] = [];
    
        for (let ingredientID of ingredientsID) {
            const ingredient : IIngredient = await this.getIngredientByID(ingredientID);
            ingredients.push(ingredient);
        }
        return ingredients;
    }
    
    export async function getIngredientByName(ingredientName : string) : Promise<IIngredient> {
        return Ingredient.find({ name: ingredientName }).then((result : IIngredient[]) => {
            return result[0];
        });
    }
    
    export async function getAllIngredientsName() : Promise<string[]> {
        return Ingredient.find().then((results : IIngredient[]) => {
            return results.map((e : IIngredient) => e.name);
        })
    }
    
    export async function getIngredientsIDByName(ingredientsName : string[]) : Promise<string[]> {
        let ingredientsID : string[] = [];
    
        for (let ingredientName of ingredientsName) {
            const ingredient : IIngredient = await this.getIngredientByName(ingredientName);
            ingredientsID.push(ingredient._id);
        }
        return ingredientsID;
    }
    
    export async function getIngredientsNameFromIDs(ingredientIDs : string[]) : Promise<string[]> {
        let ingredientsName : string[] = [];
    
        for (let ingredientID of ingredientIDs) {
            const ingredientName : string = await this.getIngredientNameByID(ingredientID);
            ingredientsName.push(ingredientName);
        }
        return ingredientsName;
    }
    
    export async function getFilteredIngredient(name : string, category: string, limit : number) : Promise<IIngredient[]> {
        let filters : any = {};
        if (name) filters.name = { "$regex": name, "$options": "i" };
        if (category) filters.category = category;
        
        if (limit && limit > 0) {
            return Ingredient.find(filters).limit(limit);
        }
        return Ingredient.find(filters);
    }
    
    export async function updateIngredient(_id : string, name : string, consumable : boolean, unitOfMeasure : string, shelfLife : number, freezable : boolean) : Promise<IUpdateOne> {
        let elementToUpdate : any = { _id: _id };
    
        if(name) elementToUpdate.name = name;
        if(consumable) elementToUpdate.consumable = consumable;
        if(unitOfMeasure) elementToUpdate.unitOfMeasure = unitOfMeasure;
        if(shelfLife) elementToUpdate.shelfLife = shelfLife;
        if(freezable) elementToUpdate.freezable = freezable;
    
        return Ingredient.updateOne({ _id: _id }, elementToUpdate);
    }
    
    export async function getAllIngredients() : Promise<IIngredient[]>{
        return Ingredient.find();
    }

    export async function getConsumableIngredients() : Promise<IIngredient[]> {
        return Ingredient.find({consumable: true});
    }

    export async function getExactIngredient(name: string) : Promise<IIngredient[]> {
        return Ingredient.find({name: name});
    }

    export async function count() : Promise<number> {
        return Ingredient.count();
    }

    export async function register(
        name: string, 
        imagePath: string, 
        consumable: boolean,
        unitOfMeasure: string, 
        shelfLife: number | undefined,
        freezable: boolean) : Promise<any> {
        const ingredient = new Ingredient({
            name: name,
            imagePath: imagePath,
            consumable: consumable,
            unitOfMeasure: unitOfMeasure,
            shelfLife: shelfLife ? shelfLife : undefined,
            freezable: freezable
        });

        return await ingredient.save()
        .then((result: any) => {
            return { id: result._id, ingredient: ingredient };
        })
        .catch((error: Error) => {
            return { error: error };
        });
    }

    export async function deleteOne(id : string) : Promise<IDeleteOne> {
        return Ingredient.deleteOne({ _id: id })
    }

    export async function findByName(name : string) : Promise<IIngredient[]> {
        return Ingredient.find({ 'name': { "$regex": name, "$options": "i" } });
    }
}