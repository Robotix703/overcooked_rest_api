import { IDeleteOne, IUpdateOne } from "../../models/mongoose";
import Recipe, { IRecipe } from "../../models/recipe";

export namespace baseRecipe {

    export async function getRecipeByID(recipeID : string) : Promise<IRecipe | void> {
        return Recipe.findById(recipeID);
    }

    export async function getAllRecipes() : Promise<IRecipe[]> {
        return Recipe.find();
    }

    export async function updateLastCooked(recipeID : string) : Promise<IUpdateOne> {
        let recipeToUpdate : IRecipe = await Recipe.findById(recipeID);
        recipeToUpdate.lastCooked = new Date;
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
        pageSize: number, 
        currentPage: number
        ) : Promise<IRecipe[]> {
        let filters : any = {};
        if (category) filters.category = category;
        if (name) filters.title = { "$regex": name, "$options": "i" };
        if(tags) filters.tags = { $all: tags };

        if (pageSize && currentPage > 0) {
            const query = Recipe.find(filters).limit(pageSize).skip(pageSize * (currentPage - 1));
            return query;
        }
        return Recipe.find(filters);
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
        lastCooked : any, 
        composition: string,
        tags: string[]) : Promise<IUpdateOne> {
        let elementToUpdate : any = { _id: _id };

        if(title) elementToUpdate.title = title;
        if(numberOfLunch) elementToUpdate.numberOfLunch = numberOfLunch;
        if(imagePath) elementToUpdate.imagePath = imagePath;
        if(category) elementToUpdate.category = category;
        if(duration) elementToUpdate.duration = duration;
        if(lastCooked) elementToUpdate.lastCooked = lastCooked;
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
        lastCooked : any | undefined,
        tags: string[]) : Promise<any> {
            const recipe = new Recipe({
                title: title,
                numberOfLunch: numberOfLunch,
                imagePath: imagePath,
                category: category,
                duration: duration,
                lastCooked: lastCooked,
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