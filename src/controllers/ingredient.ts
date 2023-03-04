import { Request, Response } from "express";
import { IIngredient } from "../models/ingredient";
import { baseIngredient } from "../compute/base/ingredient";
import { IDeleteOne, IUpdateOne } from "../models/mongoose";
import { BackendError, errorTypes, IBackendError } from "../error/backendError";
import { resizeImage } from "../modules/tinypng";

const isProduction = (process.env.NODE_ENV === "production");
const protocol = isProduction ? "https" : "http";

export namespace ingredientController {
  //POST
  export async function writeIngredient(req: any, res: Response){
    const url = protocol + '://' + req.get("host");

    baseIngredient.register(
      req.body.name,
      url + "/images/" + req.file.filename,
      req.body.consumable,
      req.body.unitOfMeasure,
      req.body.shelfLife,
      req.body.freezable)
    .then((result: any) => {
      if(isProduction) resizeImage(req.file.filename);
      res.status(201).json(result);
    })
    .catch((error: Error | IBackendError) => {
      if("backendError" in error) res.status(500).json(error.display());
      else res.status(500).json(new BackendError(errorTypes.Controller, error.message).display());
    });
  }

  //GET
  export async function readIngredients(req: any, res: Response){
    var fetchedIngredients: IIngredient[] | void = await baseIngredient.getFilteredIngredient(req.query.name, null, parseInt(req.query.limit))
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
      return;
    });

    let count : number | void = await baseIngredient.count()
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
      return;
    });

    let data = {
      ingredients: fetchedIngredients, 
      ingredientCount: count
    }
    res.status(200).json(data);
  }
  export async function consumableID(req: Request, res: Response){
    baseIngredient.getConsumableIngredients()
    .then((consumableIngredients : IIngredient[]) => {
      let data = { 
        IngredientsID: consumableIngredients.map(e => e._id),
        count: consumableIngredients.length 
      }
      res.status(200).json(data);
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      });
    });
  }
  export async function searchByName(req: Request, res: Response){
    let fetchedIngredients: IIngredient[] | void = await baseIngredient.findByName(req.query.name as string)
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
      return;
    });

    let count = await baseIngredient.count()
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
      return;
    });

    let data = {
      ingredients: fetchedIngredients,
      ingredientCount: count
    }
    res.status(200).json(data);
  }
  export async function getIngredientByID(req: Request, res: Response){
    baseIngredient.getIngredientByID(req.query.ingredientID as string)
      .then((ingredient: IIngredient) => {
        res.status(200).json(ingredient);
      })
      .catch((error: Error) => {
        res.status(500).json({
          errorMessage: error
        })
      });
  }
  export async function getAllIngredientsName(req: Request, res: Response){
    baseIngredient.getAllIngredientsName()
      .then((ingredientsName: string[]) => {
        res.status(200).json(ingredientsName);
      })
      .catch((error: Error) => {
        res.status(500).json({
          errorMessage: error
        })
      });
  }
  export async function filteredIngredients(req: Request, res: Response){
    baseIngredient.getFilteredIngredient(req.query.name as string, req.query.category as string, null)
      .then((result: IIngredient[]) => {
        res.status(200).json(result);
      })
      .catch((error: Error) => {
        res.status(500).json({
          errorMessage: error
        })
      });
  }
  export async function getAllIngredientForAutocomplete(req: Request, res: Response){
    baseIngredient.getAllIngredients()
    .then((result: IIngredient[]) => {
      let prettyIngredient : string[] = [];
      for(let element of result){
        prettyIngredient.push(element.name + " - " + element.unitOfMeasure);
      }
      res.status(200).json(prettyIngredient);
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }
  export async function duplicatesCheck(req: Request, res: Response){
    baseIngredient.getExactIngredient(req.query.name as string)
    .then((result: IIngredient[]) => {
      res.status(200).json(result.length > 0);
    })
    .catch((error: Error) => {
      res.status(500).json({
        errorMessage: error
      })
    });
  }

  //PUT
  export async function editIngredient(req: Request, res: Response){
    baseIngredient.updateIngredient(
      req.params.id,
      req.body.name,
      req.body.consumable,
      req.body.unitOfMeasure,
      req.body.shelfLife ?? undefined,
      req.body.freezable
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
  export function deleteIngredient(req: Request, res: Response){
    baseIngredient.deleteOne(req.params.id)
      .then((result: IDeleteOne) => {
        if (result.deletedCount > 0) {
          res.status(200).json(result);
        } else {
          res.status(401).json(result);
        }
      })
      .catch((error: Error) => {
        res.status(500).json({
          errorMessage: error
        })
      });
  }
}