import { IDeleteOne, IUpdateOne } from "../../models/mongoose";
import Meal, { IMeal } from "../../models/meal";

export namespace baseMeal {

    export async function getMealByID(mealID : string) : Promise<IMeal | void> {
        return Meal.findById(mealID);
    }

    export async function getAllMeals(pageSize: number | null, currentPage: number | null) : Promise<IMeal[] | void> {
        return Meal.find().limit(pageSize).skip(pageSize * (currentPage - 1));
    }

    export async function deleteMeal(mealID : string) : Promise<IDeleteOne> {
        return Meal.deleteOne({ _id: mealID });
    }

    export async function register(recipeID: string, numberOfLunchPlanned: number) : Promise<any | Error> {
        const meal = new Meal({
            recipeID: recipeID,
            numberOfLunchPlanned: numberOfLunchPlanned
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

    export async function update(_id: string, recipeID: string, numberOfLunchPlanned: number) : Promise<IUpdateOne> {
        const meal = new Meal({
            _id: _id,
            recipeID: recipeID,
            numberOfLunchPlanned: numberOfLunchPlanned
        });
        
        return Meal.updateOne({ _id: _id }, meal);
    }

    export async function deleteOne(id: string) : Promise<IDeleteOne> {
        return Meal.deleteOne({ _id: id });
    }
}