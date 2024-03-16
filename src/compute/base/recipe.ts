import { IDeleteOne, IUpdateOne } from "../../models/mongoose";
import Recipe, { IRecipe } from "../../models/recipe";

export namespace baseRecipe {

    export async function getRecipeByID(recipeID : string) : Promise<IRecipe | void> {
        return Recipe.findById(recipeID);
    }

    export async function getAllRecipes() : Promise<IRecipe[]> {
        return Recipe.find();
    }

    export async function updateNumberOfTimeCooked(recipeID : string) : Promise<IUpdateOne> {
        let recipeToUpdate : IRecipe = await Recipe.findById(recipeID);
        recipeToUpdate.numberOfTimeCooked ? recipeToUpdate.numberOfTimeCooked++ : recipeToUpdate.numberOfTimeCooked = 1;
        return Recipe.updateOne({ _id: recipeID }, recipeToUpdate);
    }

    export async function addTag(recipeId: string, tagId: string){
        let recipeData = await baseRecipe.getRecipeByID(recipeId);
        if(!recipeData){
            throw new Error("Recipe not found");
        }

        recipeData.tags.push(tagId);
        return Recipe.updateOne({ _id: recipeId }, recipeData);
    }

    export async function removeTag(recipeId: string, tagId: string){
        let recipeData = await baseRecipe.getRecipeByID(recipeId);
        if(!recipeData){
            throw new Error("Recipe not found");
        }

        recipeData.tags = recipeData.tags.filter(e => e !== tagId);
        return Recipe.updateOne({ _id: recipeId }, recipeData);
    }

    export async function filterRecipe(
        category: string | undefined, 
        name: string | undefined, 
        tags: string[] | undefined,
        sort: string | undefined,
        order: Number | undefined
        ) : Promise<IRecipe[]> {
        let filters : any = {};
        if (category) filters.category = category;
        if (name) filters.title = { "$regex": name, "$options": "i" };
        if (tags && tags.length > 0) filters.tags = { $all: tags };

        switch(sort){
            case "numberOfTimeCooked":
                return Recipe.find(filters).sort({ numberOfTimeCooked: order ?? -1 });
            default:
                return Recipe.find(filters);
        }
    }

    export async function searchByName(name : string) : Promise<IRecipe[]> {
        return Recipe.find({ 'title': { "$regex": name, "$options": "i" } });
    }

    export async function updateRecipe(
        _id : string, 
        title : string, 
        numberOfLunch : number, 
        imagePath : string, 
        category : string, 
        duration : number, 
        composition: string,
        tags: string[]) : Promise<IUpdateOne> {
        let elementToUpdate : any = { _id: _id };

        if(title) elementToUpdate.title = title;
        if(numberOfLunch) elementToUpdate.numberOfLunch = numberOfLunch;
        if(imagePath) elementToUpdate.imagePath = imagePath;
        if(category) elementToUpdate.category = category;
        if(duration) elementToUpdate.duration = duration;
        if(composition) elementToUpdate.composition = composition;
        if(tags) elementToUpdate.tags = tags;

        return Recipe.updateOne({ _id: _id }, elementToUpdate);
    }

    export async function register(
        title : string,
        numberOfLunch : number,
        imagePath : string,
        category : string,
        duration : number,
        numberOfTimeCooked : number,
        tags: string[]) : Promise<{ id: string, recipe: IRecipe }> {
            const recipe = new Recipe({
                title: title,
                numberOfLunch: numberOfLunch,
                imagePath: imagePath,
                category: category,
                duration: duration,
                numberOfTimeCooked: numberOfTimeCooked,
                tags: tags
            });

            return recipe.save()
            .then((result: any) => {
                return { id: result._id, recipe: recipe };
            })
            .catch((error: Error) => {
                return { error: error };
            });
    }

    export async function count() : Promise<number> {
        return Recipe.count();
    }

    export async function deleteOne(id : string) : Promise<IDeleteOne> {
        return Recipe.deleteOne({ _id: id });
    }
}