import { IDeleteOne, IUpdateOne } from "../../models/mongoose";
import Meal, { IMeal } from "../../models/meal";

export namespace baseMeal {

    export async function getMealByID(mealID : string) : Promise<IMeal | void> {
        return Meal.findById(mealID);
    }

    export async function getMealByRecipeId(recipeId: string): Promise<IMeal | void>{
        return Meal.findOne({ recipeID: recipeId });
    }

    export async function getAllMeals() : Promise<IMeal[] | void> {
        return Meal.find();
    }

    export async function deleteMeal(mealID : string) : Promise<IDeleteOne> {
        return Meal.deleteOne({ _id: mealID });
    }

    export async function register(recipeID: string) : Promise<{id: string, meal: IMeal} | Error> {
        const meal = new Meal({
            recipeID: recipeID
        });

        return meal.save()
        .then((result: any) => {
            return { id: result._id, meal: meal };
        })
        .catch((error: Error) => {
            return { error: error };
        });
    }

    export async function count() : Promise<number | void> {
        return Meal.count();
    }

    export async function update(_id: string, recipeID: string) : Promise<IUpdateOne> {
        const meal = new Meal({
            _id: _id,
            recipeID: recipeID
        });
        
        return Meal.updateOne({ _id: _id }, meal);
    }

    export async function deleteOne(id: string) : Promise<IDeleteOne> {
        return Meal.deleteOne({ _id: id });
    }
}