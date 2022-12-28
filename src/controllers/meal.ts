import { Request, Response } from "express";

import { IDeleteOne } from "../models/mongoose";
import { IMeal } from "../models/meal";
import { IRecipe } from "../models/recipe";
import { IUpdateOne } from "../models/mongoose";

import { baseMeal } from "../compute/base/meal";
import { baseRecipe } from "../compute/base/recipe";
import { handleRecipe, IIngredientWithQuantity } from "../compute/handleRecipe";
import { handleMeal, IDisplayableMealStatus, IMealStatus } from "../compute/handleMeal";
import { updatePantryWhenMealIsDone } from "../compute/updatePantryWhenMealIsDone";
import { handleMealUpdate } from "../compute/handleMealUpdate";

import { registerIngredientsOnTodo } from "../worker/registerIngredientsOnTodo";

export namespace mealController{
  //POST
  export async function writeMeal(req : Request, res : Response) {

    let registerResult = await baseMeal.register(req.body.recipeID, req.body.numberOfLunchPlanned)
    .catch((error : Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });

    const recipe : IRecipe | void = await baseRecipe.getRecipeByID(req.body.recipeID);
    if(!recipe) throw new Error("Recipe not found");
    
    const ingredientsNeeded : IIngredientWithQuantity[] = await handleRecipe.getIngredientList(req.body.recipeID, req.body.numberOfLunchPlanned);
    
    await registerIngredientsOnTodo.registerIngredients(ingredientsNeeded, recipe.title);

    res.status(201).json(registerResult);
  }
  export async function consumeMeal(req : Request, res : Response) {
    if (req.body.mealID) {
      let error = await updatePantryWhenMealIsDone.updatePantryWhenMealsIsDone(req.body.mealID);
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
    else
    {
      res.status(400).json({ errorMessage: "No mealID provided"});
    }
  }
  export async function setHighPrio(req : Request, res : Response) {
    if (req.body.mealID) {
      handleMealUpdate.setHighPrio(req.body.mealID)
      .then((result : IUpdateOne) => {
        if (result.modifiedCount > 0) {
          res.status(200).json(result);
        } else {
          res.status(401).json({ errorMessage: "Pas de modification" });
        }
      })
      .catch((error : Error) => {
        res.status(500).json({
          errorMessage: error
        })
      });
    }
    else
    {
      res.status(400).json({ errorMessage: "No mealID provided"});
    }
  }

  //GET
  export async function readMeals(req : any, res : Response) {
    const pageSize : number = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
    const currentPage : number = req.query.currentPage ? parseInt(req.query.currentPage) + 1 : 1;

    let fetchedMeals : IMeal[] | void = await baseMeal.getAllMeals(pageSize, currentPage)
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

  //PUT
  export async function updateMeal(req : Request, res: Response) {
    baseMeal.update(req.params.id, req.body.recipeID, req.body.numberOfLunchPlanned)
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