import express from "express";

import { ingredientController } from "../controllers/ingredient";

export const ingredientRoutes = express.Router();

//GET
ingredientRoutes.get("/", ingredientController.readIngredients);
ingredientRoutes.get("/consumableID", ingredientController.consumableID);
ingredientRoutes.get("/name", ingredientController.searchByName);
ingredientRoutes.get("/byID", ingredientController.getIngredientByID);
ingredientRoutes.get("/allNames", ingredientController.getAllIngredientsName);
ingredientRoutes.get("/filter", ingredientController.filteredIngredients);
ingredientRoutes.get("/forAutocomplete", ingredientController.getAllIngredientForAutocomplete);
ingredientRoutes.get("/duplicatesCheck", ingredientController.duplicatesCheck);

//POST
ingredientRoutes.post("/", ingredientController.createWithImageURL);

//PUT
ingredientRoutes.put("/:id", ingredientController.editIngredient);

//DELETE
ingredientRoutes.delete("/:id", ingredientController.deleteIngredient);
