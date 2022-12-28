import express from "express";

import checkAuth from "../middleware/check-auth";

import { instructionController } from "../controllers/instruction"; 

export const instructionRoutes = express.Router();

//GET
instructionRoutes.get("/", instructionController.readInstructions);
instructionRoutes.get("/byRecipeID", instructionController.getByRecipeID);
instructionRoutes.get("/countForRecipe", instructionController.getInstructionCountForRecipe);
instructionRoutes.get("/byID", instructionController.getInstructionByID);

//POST
instructionRoutes.post("/", checkAuth, instructionController.writeInstruction);
instructionRoutes.post("/byIngredientName", checkAuth, instructionController.writeInstructionByIngredientName);

//PUT
instructionRoutes.put("/:id", checkAuth, instructionController.updateInstruction);

//DELETE
instructionRoutes.delete("/:id", checkAuth, instructionController.deleteInstruction);