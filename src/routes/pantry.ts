import express from "express";

import { pantryController } from "../controllers/pantry";

export const pantryRoutes = express.Router();

//GET
pantryRoutes.get("/", pantryController.readPantries);
pantryRoutes.get("/quantityLeft", pantryController.quantityLeft);
pantryRoutes.get("/getNearestExpirationDate", pantryController.getNearestExpirationDate);
pantryRoutes.get("/fullPantryInventory", pantryController.getFullPantryInventory);
pantryRoutes.get("/byID", pantryController.getPantryByID);

//POST
pantryRoutes.post("/", pantryController.writePantry);
pantryRoutes.post("/createByIngredientName", pantryController.writePantryByIngredientName);
pantryRoutes.post("/freeze", pantryController.freezePantry);
pantryRoutes.post("/refreshTodoist", pantryController.refreshTodoist);
pantryRoutes.post("/buyAgain", pantryController.buyAgain);

//PUT
pantryRoutes.put("/:id", pantryController.updatePantry);

//DELETE
pantryRoutes.delete("/:id", pantryController.deletePantry);