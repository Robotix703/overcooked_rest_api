import { Request, Response } from "express";

import { IDeleteOne } from "../models/mongoose";
import { IMeal } from "../models/meal";
import { IRecipe } from "../models/recipe";
import { IUpdateOne } from "../models/mongoose";

import { baseMeal } from "../compute/base/meal";
import { baseRecipe } from "../compute/base/recipe";
import { IIngredientWithQuantity } from "../compute/handleRecipe";
import { handleMeal, IDisplayableMealStatus, IMealStatus } from "../compute/handleMeal";
import { updatePantryWhenMealIsDone } from "../compute/updatePantryWhenMealIsDone";
import { handleMealUpdate } from "../compute/handleMealUpdate";

import { registerIngredientsOnTodo } from "../worker/registerIngredientsOnTodo";
import { handleComposition } from "../compute/handleComposition";

export namespace mealController{
  //POST
  export async function writeMeal(req : Request, res : Response) {
    if (!req.body.recipeID) {
      res.status(400).json({ errorMessage: "No recipeID provided"});
      return;
    }
    const registerResult = await baseMeal.register(req.body.recipeID)
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
    if (!registerResult || registerResult instanceof Error) {
      throw new Error("Recipe not created");
    }

    const recipe: IRecipe | void = await baseRecipe.getRecipeByID(req.body.recipeID);
    if (!recipe) {
      throw new Error("Recipe not found");
    }

    const ingredientsNeeded: IIngredientWithQuantity[] = await handleComposition.readComposition(req.body.recipeID);

    await registerIngredientsOnTodo.registerIngredients(ingredientsNeeded, recipe.title, registerResult.meal?._id)
      .then(() => {
        res.status(201).json(registerResult);
      })
      .catch((error: Error) => {
        res.status(500).json(error);
      })
  }
  export async function consumeMeal(req : Request, res : Response) {
    let mealId: string;
    if (req.body.mealID) {
      mealId = req.body.mealID;
    }
    else if(req.body.recipeID){
      const mealFound = await baseMeal.getMealByRecipeId(req.body.recipeID);
      if(mealFound) mealId = mealFound._id;
      else{
        res.status(400).json({ errorMessage: "No meal found"});
        return;
      }
    }
    else
    {
      res.status(400).json({ errorMessage: "No mealID provided"});
      return;
    }

    const error = await updatePantryWhenMealIsDone.updatePantryWhenMealsIsDone(mealId);
    if(error)
    {
      res.status(500).json({ errorMessage: error });
      return;
    }

    const result : IDeleteOne = await baseMeal.deleteMeal(req.body.mealID);

    if (result.deletedCount > 0) {
      res.status(200).json({ status: "ok" });
    } else {
      res.status(404).json({ errorMessage: "Wrong ID"});
    }
  }

  //GET
  export async function readMeals(req : any, res : Response) {
    let fetchedMeals : IMeal[] | void = await baseMeal.getAllMeals()
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
      return;
    });

    let count = await baseMeal.count();
    if(!count){
      res.status(500).json({ errorMessage: "Count not found" });
      return;
    }
    
    let data = {
      meals: fetchedMeals,
      count: count
    }

    res.status(200).json(data);
  }
  export async function checkIfReady(req : any, res : Response) {
    await handleMeal.initPantryInventory();

    handleMeal.checkIfMealIsReady(req.query.mealID)
    .then((ready : IMealStatus) => {
      res.status(200).json(ready);
    })
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
  export async function displayable(req : Request, res : Response) {
    handleMeal.displayMealWithRecipeAndState()
    .then((mealsData : IDisplayableMealStatus[]) => {
      res.status(200).json(mealsData);
    })
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
  export async function getByRecipeId(req: Request, res: Response){
    baseMeal.getMealByRecipeId(req.query.recipeID as string)
    .then((result: IMeal | void) => {
      res.status(200).json(result);
    })
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }

  //PUT
  export async function updateMeal(req : Request, res: Response) {
    baseMeal.update(req.params.id, req.body.recipeID)
    .then((result : IUpdateOne) => {
      if (result.modifiedCount > 0) {
        res.status(200).json(result);
      } else {
        res.status(500).json({ errorMessage: "Pas de modification" });
      }
    })
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }

  //DELETE
  export async function deleteMeal(req : Request, res : Response) {
    handleMealUpdate.deleteMeal(req.params.id)
    .then((result: IDeleteOne) => {
      if (result.deletedCount > 0) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
}