import express from "express";

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
recipeRoutes.get("/instructions", recipeController.getInstructions);

//POST
recipeRoutes.post("/", extractFile, recipeController.writeRecipe);
recipeRoutes.post("/createRecipeWithImageUrl", recipeController.createRecipeWithImageUrl);
recipeRoutes.post("/createComposition", recipeController.createComposition);
recipeRoutes.post("/addTag", recipeController.addTag);
recipeRoutes.post("/removeTag", recipeController.removeTag);

//PUT
recipeRoutes.put("/:id", recipeController.updateRecipe);

//DELETE
recipeRoutes.delete("/:id", recipeController.deleteRecipe);