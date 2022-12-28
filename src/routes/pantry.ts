import express from "express";

import checkAuth from "../middleware/check-auth";

import { pantryController } from "../controllers/pantry";

export const pantryRoutes = express.Router();

//GET
pantryRoutes.get("/", pantryController.readPantries);
pantryRoutes.get("/quantityLeft", pantryController.quantityLeft);
pantryRoutes.get("/getNearestExpirationDate", pantryController.getNearestExpirationDate);
pantryRoutes.get("/fullPantryInventory", pantryController.getFullPantryInventory);
pantryRoutes.get("/byID", pantryController.getPantryByID);

//POST
pantryRoutes.post("/", checkAuth, pantryController.writePantry);
pantryRoutes.post("/createByIngredientName", checkAuth, pantryController.writePantryByIngredientName);
pantryRoutes.post("/freeze", checkAuth, pantryController.freezePantry);
pantryRoutes.post("/refreshTodoist", checkAuth, pantryController.refreshTodoist);
pantryRoutes.post("/buyAgain", checkAuth, pantryController.buyAgain);

//PUT
pantryRoutes.put("/:id", checkAuth, pantryController.updatePantry);

//DELETE
pantryRoutes.delete("/:id", checkAuth, pantryController.deletePantry);