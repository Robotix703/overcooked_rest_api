import express from "express";

import checkAuth from "../middleware/check-auth";
import extractFile from "../middleware/file";

import { recipeController } from "../controllers/recipe";

export const recipeRoutes = express.Router();

//GET
recipeRoutes.get("/", recipeController.readRecipes);
recipeRoutes.get("/byID", recipeController.getRecipeByID);
recipeRoutes.get("/filter", recipeController.getFilteredRecipe);
recipeRoutes.get("/byName", recipeController.getRecipeByName);
recipeRoutes.get("/prettyRecipe", recipeController.getPrettyRecipe);
recipeRoutes.get("/ingredientNeeded", recipeController.getIngredientsNeeded);
recipeRoutes.get("/composition", recipeController.getComposition);
recipeRoutes.get("/readComposition", recipeController.readComposition);

//POST
recipeRoutes.post("/", checkAuth, extractFile, recipeController.writeRecipe);
recipeRoutes.post("/createComposition", recipeController.createComposition);

//PUT
recipeRoutes.put("/:id", checkAuth, recipeController.updateRecipe);

//DELETE
recipeRoutes.delete("/:id", checkAuth, recipeController.deleteRecipe);