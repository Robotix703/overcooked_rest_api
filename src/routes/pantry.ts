import express from "express";

import { pantryController } from "../controllers/pantry";

export const pantryRoutes = express.Router();

//GET
pantryRoutes.get("/", pantryController.readPantries);
pantryRoutes.get("/quantityLeft", pantryController.quantityLeft);
pantryRoutes.get("/fullPantryInventory", pantryController.getFullPantryInventory);
pantryRoutes.get("/byID", pantryController.getPantryByID);
pantryRoutes.get("/prettyPantries", pantryController.getPrettyPantries);

//POST
pantryRoutes.post("/", pantryController.writePantry);
pantryRoutes.post("/createByIngredientName", pantryController.writePantryByIngredientName);
pantryRoutes.post("/refreshTodoist", pantryController.refreshTodoist);

//PUT
pantryRoutes.put("/:id", pantryController.updatePantry);

//DELETE
pantryRoutes.delete("/:id", pantryController.deletePantry);