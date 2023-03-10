import { Request, Response } from "express";
import moment from 'moment';

import { IRecipe } from "../models/recipe";
import { IMeal } from "../models/meal";
import { IDeleteOne, IUpdateOne } from "../models/mongoose";

import { baseRecipe } from "../compute/base/recipe";
import { baseMeal } from "../compute/base/meal";
import { handleRecipe, IIngredientWithQuantity, IPrettyInstruction, IPrettyRecipe } from "../compute/handleRecipe";
import { computeComposition, handleComposition } from "../compute/handleComposition";
import { handleRecipeImage } from "../modules/file";

const isProduction = (process.env.NODE_ENV === "production");
const protocol = isProduction ? "https" : "http";

export namespace recipeController {
  //POST
  export async function createRecipeWithImageUrl(req: any, res: Response){
    if(!req.body.title || !req.body.imageUrl) return res.status(400).json({errorMessage: "Missing title or imageUrl"});

    const url = protocol + '://' + req.get("host");
    const imagePath = "images/" + req.body.title + '-' + Date.now() + '.png';
    const imageUrl = req.body.imageUrl;

    if(!req.body.numberOfLunch || isNaN(req.body.numberOfLunch)) return res.status(400).json({errorMessage: "numberOfLunch must be a number"});
    if(!req.body.category) return res.status(400).json({errorMessage: "Missing category"});
    if(!req.body.duration || isNaN(req.body.duration)) return res.status(400).json({errorMessage: "duration must be a number"});

    baseRecipe.register(
      req.body.title,
      req.body.numberOfLunch,
      url + "/" + imagePath,
      req.body.category,
      req.body.duration,
      undefined,
      req.body.tags ? JSON.parse(req.body.tags) : undefined
    )
    .then(async (result: any) => {
      await handleRecipeImage(imageUrl, imagePath);
      res.status(201).json(result);
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
  export async function createComposition(req: Request, res: Response){
    if(!req.body.recipeId){
      res.status(400).json({message: "Pas d'Id de recette"});
      return;
    }

    return handleComposition.createComposition(req.body.recipeId as string)
    .then((result: IUpdateOne	) => {
      res.status(200).json({ message: result.modifiedCount ? "OK" : "NOK" });
    })
    .catch((error: Error) => {
      res.status(500).json(error);
    })
  }
  export async function addTag(req: any, res: any){
    baseRecipe.addTag(req.body.recipeId, req.body.tagId)
    .then((result: IUpdateOne) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ status: "OK" });
      } else {
        res.status(500).json({ message: "Pas de modification" });
      }
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
  export async function removeTag(req: any, res: any){
    baseRecipe.removeTag(req.body.recipeId, req.body.tagId)
    .then((result: IUpdateOne) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ status: "OK" });
      } else {
        res.status(500).json({ message: "Pas de modification" });
      }
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }

  //GET
  export async function readRecipes(req: any, res: Response){
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
    const currentPage = req.query.currentPage ? parseInt(req.query.currentPage) + 1 : 1;

    let fetchedRecipes: IRecipe[] | void = await baseRecipe.filterRecipe(undefined, undefined, undefined, pageSize, currentPage)
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });

    let count = await baseRecipe.count()
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });

    let data = {
      recipes: fetchedRecipes,
      count: count
    }

    res.status(200).json(data);
  }
  export async function getRecipeByID(req: Request, res: Response){
    baseRecipe.getRecipeByID(req.query.recipeID as string)
    .then((result: IRecipe) => {
      res.status(200).json(result);
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
  export async function getFilteredRecipe(req: any, res: Response){
    let fetchedRecipes: IRecipe[] | void = await baseRecipe.filterRecipe(
      req.query.category, 
      req.query.name, 
      (req.query.tags)? JSON.parse(req.query.tags) : undefined,
      parseInt(req.query.pageSize), 
      parseInt(req.query.currentPage)
    )
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      });
      return;
    });

    let count : number | void = await baseRecipe.count()
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      });
      return;
    });

    let data = {
      recipes: fetchedRecipes,
      count: count
    };
    res.status(200).json(data);
  }
  export async function getRecipeByName(req: Request, res: Response){
    let fetchedRecipes: IRecipe[] | void = await baseRecipe.searchByName(req.query.name as string)
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      });
      return;
    });

    let count : number | void = await baseRecipe.count()
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      });
      return;
    });

    let data = {
      recipes: fetchedRecipes,
      count: count
    }
    res.status(200).json(data);
  }
  export async function getPrettyRecipe(req: Request, res: Response){
    let recipeID: string | void;
    if (req.query.recipeID) {
      recipeID = req.query.recipeID as string;
    } else {
      if (req.query.mealID) {
        let meal : IMeal | void = await baseMeal.getMealByID(req.query.mealID as string)
        .catch((error: Error) => {
          res.status(500).json({
            errorMessage: error
          });
          return;
        });

        if(meal)
        {
          recipeID = meal.recipeID;
        }
      }
    }

    if(recipeID)
    {
      handleRecipe.getPrettyRecipe(recipeID)
      .then((result: IPrettyRecipe) => {
        res.status(200).json(result);
      })
      .catch((error: Error) => {
        res.status(500).json({
          errorMessage: error
        });
        return;
      });
    }
    else
    {
      res.status(400).json({
        errorMessage: "RecipeID not found"
      });
    }
  }
  export async function getInstructions(req: Request, res: Response){
    let recipeID: string | void;
    if (req.query.recipeID) {
      recipeID = req.query.recipeID as string;
      handleRecipe.getInstructionsByRecipeID(recipeID)
      .then((result: IPrettyInstruction[]) => {
        res.status(200).json(result);
      })
      .catch((error: Error) => {
        res.status(500).json({
          errorMessage: error
        });
        return;
      });
    }
    else
    {
      res.status(400).json({
        errorMessage: "RecipeID not found"
      });
    }
    
  }
  export async function getIngredientsNeeded(req: Request, res: Response){
    let recipeID: string | void;
    if (req.query.recipeID) {
      recipeID = req.query.recipeID as string;
    } else {
      if (req.query.mealID) {
        let meal : IMeal | void = await baseMeal.getMealByID(req.query.mealID as string)
        .catch((error: Error) => {
          res.status(500).json({
            errorMessage: error
          })
        });

        if(meal)
        {
          recipeID = meal.recipeID;
        }
      }
    }

    if(recipeID)
    {
      let recipeData : IRecipe | void = await baseRecipe.getRecipeByID(recipeID)
      .catch((error: Error) => {
        res.status(500).json({
          errorMessage: error
        })
      });

      if(recipeData)
      {
        handleRecipe.getIngredientList(recipeData._id, recipeData.numberOfLunch)
        .then((result: IIngredientWithQuantity[]) => {
          res.status(200).json(result);
        })
        .catch((error: Error) => {
          res.status(500).json({
            errorMessage: error
          })
        });
      }
      else
      {
        res.status(400).json({
          errorMessage: "recipeData not found"
        });
      }
    }
    else
    {
      res.status(400).json({
        errorMessage: "RecipeID not found"
      });
    }
  }
  export async function getComposition(req: Request, res: Response){
    if(!req.query.recipeId){
      res.status(400).json({message: "Pas d'Id de recette"});
      return;
    }

    return computeComposition(req.query.recipeId as string)
    .then((result: string) => {
      res.status(200).json(result);
    })
    .catch((error: Error) => {
      res.status(500).json(error);
    })
  }
  export async function readComposition(req: Request, res: Response){
    if(!req.query.recipeId){
      res.status(400).json({message: "Pas d'Id de recette"});
      return;
    }

    return handleComposition.readComposition(req.query.recipeId as string)
    .then((result: object) => {
      res.status(200).json(result);
    })
    .catch((error: Error) => {
      res.status(500).json(error);
    })
  }

  //PUT
  export function updateRecipe(req: Request, res: Response){
    baseRecipe.updateRecipe(
      req.params.id,
      req.body.title,
      req.body.numberOfLunch,
      req.body.imagePath,
      req.body.category,
      req.body.duration,
      req.body.lastCooked ? moment(req.body.expirationDate, "DD/MM/YYYY") : undefined,
      req.body.composition,
      (req.body.tags)? JSON.parse(req.body.tags) : undefined
    )
    .then((result: IUpdateOne) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ status: "OK" });
      } else {
        res.status(500).json({ message: "Pas de modification" });
      }
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }

  //DELETE
  export function deleteRecipe(req: Request, res: Response){
    baseRecipe.deleteOne(req.params.id)
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