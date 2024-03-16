import express from "express";

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
recipeRoutes.post("/", recipeController.createRecipeWithImageUrl);
recipeRoutes.post("/createComposition", recipeController.createComposition);
recipeRoutes.post("/addTag", recipeController.addTag);
recipeRoutes.post("/removeTag", recipeController.removeTag);
recipeRoutes.post("/completeRecipe", recipeController.completeRecipe);

//PUT
recipeRoutes.put("/:id", recipeController.updateRecipe);
recipeRoutes.put("/updateInstructions/:id", recipeController.updateInstructions);

//DELETE
recipeRoutes.delete("/:id", recipeController.deleteRecipe);