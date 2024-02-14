import { Request, Response } from "express";
import { IInstruction } from "../models/instruction";
import { IUpdateOne } from "../models/mongoose";

import { handleRecipe, IPrettyInstruction } from "../compute/handleRecipe";
import { handleInstruction } from "../compute/handleInstructions";

import { baseIngredient } from "../compute/base/ingredient";
import { baseInstruction } from "../compute/base/instruction";
import { handleComposition } from "../compute/handleComposition";

export namespace instructionController {
  //POST
  export async function writeInstruction(req: Request, res: Response){
    baseInstruction.register(
      req.body.text,
      req.body.recipeID,
      req.body.ingredients,
      req.body.quantity,
      req.body.order,
      req.body.cookingTime ?? undefined
    )
    .then((result: any) => {
      handleComposition.editComposition(req.body.recipeID)
      .then((result: IUpdateOne	) => {
        res.status(200).json({ message: result.modifiedCount ? "OK" : "NOK" });
      })
      .catch((error: Error) => {
        res.status(500).json({
          errorMessage: error
        });
      });
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      });
    });
  }
  export async function writeInstructionByIngredientName(req: Request, res: Response){
    const ingredientsName : string[] = req.body.ingredients.map((e: any) => e.ingredientName);
    const ingredientsQuantity : number[] = req.body.ingredients.map((e: any) => e.quantity);

    const ingredientsID: string[] = await baseIngredient.getIngredientsIDByName(ingredientsName);

    if (ingredientsID[0]) {
      baseInstruction.register(
        req.body.text,
        req.body.recipeID,
        ingredientsID,
        ingredientsQuantity,
        req.body.order,
        req.body.cookingTime ?? undefined
      )
      .then((result: any) => {
        handleComposition.editComposition(req.body.recipeID)
        .then((result: IUpdateOne	) => {
          res.status(200).json({ message: result.modifiedCount ? "OK" : "NOK" });
        })
        .catch((error: Error) => {
          res.status(500).json({
            errorMessage: error
          });
        });
      })
      .catch((error: Error) => {
        res.status(500).json({
          errorMessage: error
        })
      });
    } else {
      res.status(500).json({
        errorMessage: "No valid ingredient"
      });
    }
  }

  //GET
  export async function readInstructions(req: any, res: Response){
    const pageSize : number = req.query.pageSize ? parseInt(req.query.pageSize) : 20;
    const currentPage : number = req.query.currentPage ? parseInt(req.query.currentPage) + 1 : 1;

    let fetchedInstructions: IInstruction[] | void = await baseInstruction.getAllInstructions(pageSize, currentPage)
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
      return;
    });

    let count = await baseInstruction.count()
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
      return;
    });
    
    let data = {
      instructions: fetchedInstructions,
      instructionCount: count
    }
    res.status(200).json(data);    
  }
  export async function getByRecipeID(req: Request, res: Response){
    handleRecipe.getInstructionsByRecipeID(req.query.recipeID as string)
      .then((instructions: IPrettyInstruction[]) => {
        res.status(200).json(instructions);
      })
      .catch((error: Error) => {
        res.status(500).json({
          errorMessage: error
        })
      });
  }
  export async function getInstructionCountForRecipe(req: Request, res: Response){
    let count = await handleInstruction.getInstructionCountForRecipe(req.query.recipeID as string)
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });

    res.status(200).json(count);
  }
  export async function getInstructionByID(req: Request, res: Response){
    handleInstruction.getPrettyInstructionByID(req.query.instructionID as string)
    .then((instruction: IPrettyInstruction) => {
      res.status(200).json(instruction);
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }

  //PUT
  export async function updateInstruction(req: Request, res: Response){
    const ingredientsName : string[] = req.body.ingredients.map((e: any) => e.ingredientName);
    const ingredientsQuantity : number[] = req.body.ingredients.map((e: any) => e.quantity);

    const ingredientsID : string[] = await baseIngredient.getIngredientsIDByName(ingredientsName);
    const recipeId : string = await baseInstruction.getRecipeId(req.params.id);
    
    baseInstruction.updateInstruction(
      req.params.id,
      req.body.text,
      undefined,
      ingredientsID,
      ingredientsQuantity,
      req.body.order,
      req.body.cookingTime
    )
    .then((result: IUpdateOne) => {
      if (result.modifiedCount > 0) {
        handleComposition.editComposition(recipeId)
        .then((result: IUpdateOne	) => {
          res.status(200).json({ message: result.modifiedCount ? "OK" : "NOK" });
        })
        .catch((error: Error) => {
          res.status(500).json({
            errorMessage: error
          });
        });
      } else {
        res.status(401).json({ message: "Pas de modification" });
      }
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }

  //DELETE
  export async function deleteInstruction(req: Request, res: Response){
    const recipeId : string = await baseInstruction.getRecipeId(req.params.id);

    baseInstruction.deleteOne(req.params.id)
    .then((result: any) => {
      if (result.deletedCount > 0) {
        handleComposition.editComposition(recipeId)
        .then((result: IUpdateOne	) => {
          res.status(200).json({ message: result.modifiedCount ? "OK" : "NOK" });
        })
        .catch((error: Error) => {
          console.error(error);
          res.status(500).json({
            errorMessage: error
          });
        });
      } else {
        res.status(500).json(result);
      }
    })
    .catch((error: Error) => {
      console.error(error);
      res.status(500).json({
        errorMessage: error
      })
    });
  }
}