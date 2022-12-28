import express from "express";

import checkAuth from "../middleware/check-auth";

import { mealController } from "../controllers/meal";

export const mealRoutes = express.Router();

//GET
mealRoutes.get("/", mealController.readMeals);
mealRoutes.get("/checkIfReady", mealController.checkIfReady);
mealRoutes.get("/displayable", mealController.displayable);

//POST
mealRoutes.post("/", checkAuth, mealController.writeMeal);
mealRoutes.post("/consume", checkAuth, mealController.consumeMeal);
mealRoutes.post("/setHighPrio", checkAuth, mealController.setHighPrio);

//PUT
mealRoutes.put("/:id", checkAuth, mealController.updateMeal);

//DELETE
mealRoutes.delete("/:id", checkAuth, mealController.deleteMeal);