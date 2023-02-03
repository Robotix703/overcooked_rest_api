import express from "express";

import { mealController } from "../controllers/meal";

export const mealRoutes = express.Router();

//GET
mealRoutes.get("/", mealController.readMeals);
mealRoutes.get("/checkIfReady", mealController.checkIfReady);
mealRoutes.get("/displayable", mealController.displayable);
mealRoutes.get("/byRecipeId", mealController.getByRecipeId);

//POST
mealRoutes.post("/", mealController.writeMeal);
mealRoutes.post("/consume", mealController.consumeMeal);
mealRoutes.post("/setHighPrio", mealController.setHighPrio);

//PUT
mealRoutes.put("/:id", mealController.updateMeal);

//DELETE
mealRoutes.delete("/:id", mealController.deleteMeal);